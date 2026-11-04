import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import path from "path";
import { prisma } from "@/lib/prisma";
import { enqueueDownloadJob, cleanExpiredDownloads } from "@/lib/queue/download-queue";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { validateUrlAgainstSSRF } from "@/lib/security/ssrf";

const startDownloadSchema = z.object({
  url: z.string().url(),
  platform: z.string().default("outros"),
  title: z.string().default("Mídia"),
  thumbnail: z.string().optional(),
  type: z.enum(["video", "audio"]),
  quality: z.string().default("720p"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = crypto.createHash("sha256").update(ip + "nova_salt").digest("hex").slice(0, 16);
    const rateLimit = await checkRateLimit(`download_start:${ip}`, 10, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Limite de downloads simultâneos atingido. Aguarde alguns instantes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = startDownloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Parâmetros de download inválidos." }, { status: 400 });
    }

    const { url, platform, title, thumbnail, type, quality } = parsed.data;

    const ssrfCheck = await validateUrlAgainstSSRF(url);
    if (!ssrfCheck.valid) {
      return NextResponse.json({ error: ssrfCheck.error }, { status: 400 });
    }

    const jobId = crypto.randomUUID();
    const downloadToken = crypto.randomBytes(16).toString("hex");
    const storageDir = path.resolve(process.env.STORAGE_DIR || "./storage/downloads");

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas de validade

    // Acionar limpeza assíncrona de itens expirados sem bloquear a requisição
    cleanExpiredDownloads().catch(() => {});

    // Criar job no banco com token de isolamento
    await prisma.downloadJob.create({
      data: {
        id: jobId,
        url: ssrfCheck.sanitizedUrl || url,
        platform,
        title: title.slice(0, 255),
        thumbnail,
        format: type === "audio" ? "mp3" : "mp4",
        quality,
        status: "pending",
        progress: 0,
        downloadToken,
        ipHash,
        expiresAt,
      },
    }).catch((err) => {
      console.warn("Aviso ao persistir job no banco (fallback em memória ativo):", err.message);
    });

    // Enfileirar na fila de processamento com metadados e token
    await enqueueDownloadJob({
      jobId,
      url: ssrfCheck.sanitizedUrl || url,
      type,
      quality,
      outputDir: storageDir,
      title: title.slice(0, 255),
      platform,
      downloadToken,
    });

    return NextResponse.json({
      success: true,
      jobId,
      downloadToken,
      status: "pending",
      message: "Download enfileirado com sucesso.",
    });
  } catch (err: unknown) {
    console.error("Erro ao iniciar download:", err);
    return NextResponse.json(
      { error: "Erro interno ao enfileirar o processamento do download." },
      { status: 500 }
    );
  }
}
