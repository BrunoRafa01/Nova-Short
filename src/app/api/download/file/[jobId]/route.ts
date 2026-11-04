import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { getJobStatus } from "@/lib/queue/download-queue";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    const job = await getJobStatus(jobId);

    if (!job || job.status !== "completed" || !job.filePath) {
      return new NextResponse("Arquivo não encontrado ou processamento ainda não concluído.", {
        status: 404,
      });
    }

    const storageDir = path.resolve(process.env.STORAGE_DIR || "./storage/downloads");
    const normalizedFilePath = path.resolve(job.filePath);

    // Proteção rigorosa contra Path Traversal
    if (!normalizedFilePath.startsWith(storageDir)) {
      return new NextResponse("Acesso não autorizado.", { status: 403 });
    }

    try {
      const stats = await fs.stat(normalizedFilePath);
      const isAudio = normalizedFilePath.endsWith(".mp3");
      const ext = isAudio ? "mp3" : "mp4";
      const sanitizedTitle = (job.title || "nova-media")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .slice(0, 50);

      const downloadFileName = `${sanitizedTitle}.${ext}`;

      // Criar stream de leitura
      const nodeStream = createReadStream(normalizedFilePath);
      const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

      return new NextResponse(webStream, {
        headers: {
          "Content-Type": isAudio ? "audio/mpeg" : "video/mp4",
          "Content-Length": stats.size.toString(),
          "Content-Disposition": `attachment; filename="${downloadFileName}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      return new NextResponse("Arquivo de mídia expirado ou indisponível no servidor.", {
        status: 410,
      });
    }
  } catch (err) {
    console.error("Erro ao servir arquivo:", err);
    return new NextResponse("Erro ao processar download do arquivo.", { status: 500 });
  }
}
