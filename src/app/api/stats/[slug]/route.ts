import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const link = await prisma.shortLink.findUnique({
      where: { slug },
      include: {
        clicks: {
          orderBy: { createdAt: "desc" },
          take: 500,
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link não encontrado." }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Agrupamento por dispositivo
    const deviceMap: Record<string, number> = {};
    const browserMap: Record<string, number> = {};
    const refererMap: Record<string, number> = {};
    const dailyMap: Record<string, number> = {};

    link.clicks.forEach((c) => {
      const dev = c.device || "Desktop";
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;

      const br = c.browser || "Outro";
      browserMap[br] = (browserMap[br] || 0) + 1;

      const ref = c.referer ? new URL(c.referer, "http://localhost").hostname : "Direto";
      refererMap[ref] = (refererMap[ref] || 0) + 1;

      const day = c.createdAt.toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    // Converter para arrays de gráficos
    const timeline = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }));
    const devices = Object.entries(deviceMap).map(([name, count]) => ({ name, count }));
    const browsers = Object.entries(browserMap).map(([name, count]) => ({ name, count }));
    const referers = Object.entries(refererMap).map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      link: {
        id: link.id,
        slug: link.slug,
        shortUrl: `${appUrl}/s/${link.slug}`,
        originalUrl: link.originalUrl,
        title: link.title,
        clicksCount: link.clicksCount,
        isActive: link.isActive,
        expiresAt: link.expiresAt,
        createdAt: link.createdAt,
      },
      stats: {
        totalClicks: link.clicksCount,
        timeline,
        devices,
        browsers,
        referers,
      },
    });
  } catch (err) {
    console.error("Erro ao obter estatísticas:", err);
    return NextResponse.json({ error: "Erro ao carregar estatísticas do link." }, { status: 500 });
  }
}
