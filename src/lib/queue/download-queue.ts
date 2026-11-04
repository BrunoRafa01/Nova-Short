import { Queue, Worker } from "bullmq";
import { redis } from "../redis";
import { processMediaDownload } from "../downloader/extractor";
import { prisma } from "../prisma";
import path from "path";
import fsSync from "fs";

export interface DownloadJobData {
  jobId: string;
  url: string;
  type: "video" | "audio";
  quality: string;
  outputDir: string;
}

const QUEUE_NAME = "nova-media-downloads";

// Estado em memória caso Redis esteja offline
const memoryJobs = new Map<
  string,
  {
    status: string;
    progress: number;
    filePath?: string;
    error?: string;
    title?: string;
    platform?: string;
    format?: string;
    quality?: string;
  }
>();

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
    const current = memoryJobs.get(jobId) || { status: "processing", progress: 10 };
    current.status = "processing";
    current.progress = 10;
    memoryJobs.set(jobId, current);

    await prisma.downloadJob.update({
      where: { id: jobId },
      data: { status: "processing", progress: 10 },
    }).catch(() => {});

    const result = await processMediaDownload(url, type, quality, outputDir, jobId, async (p) => {
      const j = memoryJobs.get(jobId);
      if (j) {
        j.status = "processing";
        j.progress = p;
      }
      if (progressCallback) progressCallback(p);
      await prisma.downloadJob.update({
        where: { id: jobId },
        data: { progress: p },
      }).catch(() => {});
    });

    const completedJob = memoryJobs.get(jobId) || { status: "completed", progress: 100 };
    completedJob.status = "completed";
    completedJob.progress = 100;
    completedJob.filePath = result.filePath;
    memoryJobs.set(jobId, completedJob);

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
    console.error(`[DownloadJob] Erro na tarefa ${jobId}:`, errorMsg);
    const failedJob = memoryJobs.get(jobId) || { status: "failed", progress: 0 };
    failedJob.status = "failed";
    failedJob.progress = 0;
    failedJob.error = errorMsg;
    memoryJobs.set(jobId, failedJob);

    await prisma.downloadJob.update({
      where: { id: jobId },
      data: { status: "failed", errorMessage: errorMsg },
    }).catch(() => {});
  }
}

export async function enqueueDownloadJob(data: DownloadJobData): Promise<string> {
  const { jobId, url, type, quality, outputDir } = data;

  memoryJobs.set(jobId, { status: "pending", progress: 0 });

  if (bullQueue) {
    await bullQueue.add(`download-${jobId}`, data, { jobId });
  } else {
    // Fallback: executa assincronamente em background no processo Node
    setImmediate(() => {
      executeDownloadTask(jobId, url, type, quality, outputDir);
    });
  }

  return jobId;
}

export async function getJobStatus(jobId: string) {
  // 1. Verificar estado em memória
  const mem = memoryJobs.get(jobId);
  if (mem && mem.status === "completed" && mem.filePath && fsSync.existsSync(mem.filePath)) {
    return {
      id: jobId,
      status: "completed",
      progress: 100,
      filePath: mem.filePath,
      errorMessage: undefined,
      title: mem.title,
      platform: mem.platform,
      format: mem.format,
      quality: mem.quality,
    };
  }

  // 2. Verificar diretamente no disco se o arquivo já foi baixado
  const storageDir = path.resolve(process.env.STORAGE_DIR || "./storage/downloads");
  const possiblePaths = [
    path.join(storageDir, `nova_${jobId}.mp4`),
    path.join(storageDir, `nova_${jobId}.mp3`),
    path.join(storageDir, `nova_${jobId}.m4a`),
    path.join(storageDir, `nova_${jobId}.webm`),
  ];

  for (const p of possiblePaths) {
    if (fsSync.existsSync(p)) {
      return {
        id: jobId,
        status: "completed",
        progress: 100,
        filePath: p,
      };
    }
  }

  // 3. Se ainda em processamento em memória
  if (mem) {
    return {
      id: jobId,
      status: mem.status,
      progress: mem.progress,
      filePath: mem.filePath,
      errorMessage: mem.error,
      title: mem.title,
      platform: mem.platform,
      format: mem.format,
      quality: mem.quality,
    };
  }

  // 4. Verificar banco
  const dbJob = await prisma.downloadJob.findUnique({
    where: { id: jobId },
  }).catch(() => null);

  if (dbJob) {
    return {
      id: dbJob.id,
      status: dbJob.status,
      progress: dbJob.progress,
      filePath: dbJob.filePath || undefined,
      errorMessage: dbJob.errorMessage || undefined,
      title: dbJob.title,
      platform: dbJob.platform,
      format: dbJob.format,
      quality: dbJob.quality,
      expiresAt: dbJob.expiresAt,
    };
  }

  return null;
}
