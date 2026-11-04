import { Queue, Worker } from "bullmq";
import { redis } from "../redis";
import { processMediaDownload } from "../downloader/extractor";
import { prisma } from "../prisma";
import path from "path";

export interface DownloadJobData {
  jobId: string;
  url: string;
  type: "video" | "audio";
  quality: string;
  outputDir: string;
}

const QUEUE_NAME = "nova-media-downloads";

// Estado em memória caso Redis esteja offline
const memoryJobs = new Map<string, { status: string; progress: number; filePath?: string; error?: string }>();

let bullQueue: Queue<DownloadJobData> | null = null;

if (redis && redis.status === "ready") {
  try {
    bullQueue = new Queue<DownloadJobData>(QUEUE_NAME, {
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    // Iniciar Worker do BullMQ
    new Worker<DownloadJobData>(
      QUEUE_NAME,
      async (job) => {
        const { jobId, url, type, quality, outputDir } = job.data;
        await executeDownloadTask(jobId, url, type, quality, outputDir, (p) => job.updateProgress(p));
      },
      { connection: redis, concurrency: 2 }
    );
  } catch {
    bullQueue = null;
  }
}

// Execução central do download
async function executeDownloadTask(
  jobId: string,
  url: string,
  type: "video" | "audio",
  quality: string,
  outputDir: string,
  progressCallback?: (p: number) => void
) {
  try {
    // Atualizar status no banco e memória
    memoryJobs.set(jobId, { status: "processing", progress: 10 });
    await prisma.downloadJob.update({
      where: { id: jobId },
      data: { status: "processing", progress: 10 },
    }).catch(() => {});

    const result = await processMediaDownload(url, type, quality, outputDir, jobId, async (p) => {
      memoryJobs.set(jobId, { status: "processing", progress: p });
      if (progressCallback) progressCallback(p);
      await prisma.downloadJob.update({
        where: { id: jobId },
        data: { progress: p },
      }).catch(() => {});
    });

    memoryJobs.set(jobId, { status: "completed", progress: 100, filePath: result.filePath });
    await prisma.downloadJob.update({
      where: { id: jobId },
      data: {
        status: "completed",
        progress: 100,
        filePath: result.filePath,
        fileSize: BigInt(result.fileSize),
      },
    }).catch(() => {});
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    memoryJobs.set(jobId, { status: "failed", progress: 0, error: errorMsg });
    await prisma.downloadJob.update({
      where: { id: jobId },
      data: { status: "failed", errorMessage: errorMsg },
    }).catch(() => {});
  }
}

export async function enqueueDownloadJob(data: DownloadJobData): Promise<string> {
  const { jobId, url, type, quality, outputDir } = data;

  if (bullQueue) {
    await bullQueue.add(`download-${jobId}`, data, { jobId });
  } else {
    // Fallback: executa assincronamente em background no processo Node
    memoryJobs.set(jobId, { status: "pending", progress: 0 });
    setImmediate(() => {
      executeDownloadTask(jobId, url, type, quality, outputDir);
    });
  }

  return jobId;
}

export async function getJobStatus(jobId: string) {
  // Verificar banco primeiro
  const dbJob = await prisma.downloadJob.findUnique({
    where: { id: jobId },
  }).catch(() => null);

  if (dbJob) {
    return {
      id: dbJob.id,
      status: dbJob.status,
      progress: dbJob.progress,
      filePath: dbJob.filePath,
      errorMessage: dbJob.errorMessage,
      title: dbJob.title,
      platform: dbJob.platform,
      format: dbJob.format,
      quality: dbJob.quality,
      expiresAt: dbJob.expiresAt,
    };
  }

  const mem = memoryJobs.get(jobId);
  if (mem) {
    return {
      id: jobId,
      status: mem.status,
      progress: mem.progress,
      filePath: mem.filePath,
      errorMessage: mem.error,
    };
  }

  return null;
}
