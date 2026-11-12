import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/security/rate-limiter";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = crypto.createHash("sha256").update(ip + "nova_salt").digest("hex").slice(0, 16);

    const downloads = await prisma.downloadJob.findMany({
      where: { ipHash },
      orderBy: { createdAt: "desc" },
      take: 20,
    }).catch(() => []);

    return NextResponse.json({
      success: true,
      downloads: downloads.map((d) => ({
        id: d.id,
        url: d.url,
        title: d.title,
        platform: d.platform,
        thumbnail: d.thumbnail,
        format: d.format,
        quality: d.quality,
        status: d.status,
        progress: d.progress,
        createdAt: d.createdAt,
        expiresAt: d.expiresAt,
        downloadUrl:
          d.status === "completed"
            ? `/api/download/file/${d.id}${d.downloadToken ? `?token=${encodeURIComponent(d.downloadToken)}` : ""}`
            : null,
      })),
    });
  } catch (err) {
    console.error("Erro ao listar histórico de downloads:", err);
    return NextResponse.json({ error: "Erro ao carregar histórico de downloads." }, { status: 500 });
  }
}
