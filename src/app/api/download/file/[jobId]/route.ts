import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import { createReadStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { getJobStatus } from "@/lib/queue/download-queue";
import { getAdminSession } from "@/lib/security/auth";

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    // 1. Validação estrita do formato de UUID
    if (!jobId || !UUID_REGEX.test(jobId)) {
      return new NextResponse("Identificador de download inválido.", { status: 400 });
    }

    const storageDir = path.resolve(process.env.STORAGE_DIR || "./storage/downloads");
    const job = await getJobStatus(jobId);

    // 2. Validação de expiração da tarefa
    if (job?.expiresAt && new Date() > new Date(job.expiresAt)) {
      if (job.filePath && fsSync.existsSync(job.filePath)) {
        await fs.unlink(job.filePath).catch(() => {});
      }
      return new NextResponse("O arquivo expirou e não está mais disponível no servidor.", { status: 410 });
    }

    // 3. Controle de acesso e autorização por Token ou Sessão Administrativa (fail-closed)
    const requestToken = req.nextUrl.searchParams.get("token") || req.headers.get("x-download-token");
    const hasValidToken = Boolean(job?.downloadToken && requestToken && job.downloadToken === requestToken);
    if (!hasValidToken) {
      const adminSession = await getAdminSession().catch(() => null);
      if (!adminSession) {
        return new NextResponse("Acesso não autorizado para baixar este arquivo de mídia.", { status: 403 });
      }
    }

    // 4. Identificar caminho do arquivo: via job ou direto no disco
    let resolvedFilePath = job?.filePath ? path.resolve(job.filePath) : null;

    if (!resolvedFilePath || !fsSync.existsSync(resolvedFilePath)) {
      const candidates = [
        path.join(storageDir, `nova_${jobId}.mp4`),
        path.join(storageDir, `nova_${jobId}.mp3`),
        path.join(storageDir, `nova_${jobId}.m4a`),
        path.join(storageDir, `nova_${jobId}.webm`),
      ];
      const found = candidates.find((c) => fsSync.existsSync(c));
      if (found) {
        resolvedFilePath = found;
      }
    }

    if (!resolvedFilePath || !fsSync.existsSync(resolvedFilePath)) {
      return new NextResponse("Arquivo de mídia não encontrado ou ainda em processamento.", {
        status: 404,
      });
    }

    // Proteção rigorosa contra Path Traversal
    if (!resolvedFilePath.startsWith(storageDir)) {
      return new NextResponse("Acesso não autorizado.", { status: 403 });
    }

    try {
      const stats = await fs.stat(resolvedFilePath);
      const isAudio = resolvedFilePath.endsWith(".mp3") || resolvedFilePath.endsWith(".m4a");
      const ext = path.extname(resolvedFilePath).replace(".", "") || (isAudio ? "mp3" : "mp4");
      
      const sanitizedTitle = (job?.title || "nova_media")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .slice(0, 50);

      const downloadFileName = `${sanitizedTitle}.${ext}`;

      // Criar stream de leitura
      const nodeStream = createReadStream(resolvedFilePath);
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
      return new NextResponse("Erro ao ler o arquivo de mídia no servidor.", {
        status: 500,
      });
    }
  } catch (err) {
    console.error("Erro ao servir arquivo:", err);
    return new NextResponse("Erro interno ao processar o download.", { status: 500 });
  }
}
