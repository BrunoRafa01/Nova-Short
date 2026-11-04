import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/security/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const [totalLinks, totalClicks, activeLinks, totalDownloads, recentDownloads] = await Promise.all([
      prisma.shortLink.count().catch(() => 0),
      prisma.linkClick.count().catch(() => 0),
      prisma.shortLink.count({ where: { isActive: true } }).catch(() => 0),
      prisma.downloadJob.count().catch(() => 0),
      prisma.downloadJob.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }).catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      summary: {
        totalLinks,
        totalClicks,
        activeLinks,
        totalDownloads,
      },
      recentDownloads: recentDownloads.map((d) => ({
        id: d.id,
        title: d.title,
        platform: d.platform,
        status: d.status,
        format: d.format,
        quality: d.quality,
        progress: d.progress,
        createdAt: d.createdAt,
      })),
    });
  } catch (err) {
    console.error("Erro ao obter métricas admin:", err);
    return NextResponse.json({ error: "Erro ao carregar dados do painel." }, { status: 500 });
  }
}
