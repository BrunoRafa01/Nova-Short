import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import path from "path";
import { prisma } from "@/lib/prisma";
import { enqueueDownloadJob } from "@/lib/queue/download-queue";
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
    const storageDir = path.resolve(process.env.STORAGE_DIR || "./storage/downloads");

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas de validade

    // Criar job no banco
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
        expiresAt,
      },
    }).catch((err) => {
      console.warn("Aviso ao persistir job no banco (fallback em memória ativo):", err.message);
    });

    // Enfileirar na fila de processamento
    await enqueueDownloadJob({
      jobId,
      url: ssrfCheck.sanitizedUrl || url,
      type,
      quality,
      outputDir: storageDir,
    });

    return NextResponse.json({
      success: true,
      jobId,
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
