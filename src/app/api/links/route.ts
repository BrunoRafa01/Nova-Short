import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10)));
    const search = searchParams.get("search")?.trim() || "";

    const where = search
      ? {
          OR: [
            { slug: { contains: search, mode: "insensitive" as const } },
            { originalUrl: { contains: search, mode: "insensitive" as const } },
            { title: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, links] = await Promise.all([
      prisma.shortLink.count({ where }),
      prisma.shortLink.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const formatted = links.map((l) => ({
      id: l.id,
      slug: l.slug,
      shortUrl: `${appUrl}/s/${l.slug}`,
      originalUrl: l.originalUrl,
      title: l.title,
      clicksCount: l.clicksCount,
      isActive: l.isActive,
      expiresAt: l.expiresAt,
      createdAt: l.createdAt,
    }));

    return NextResponse.json({
      links: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Erro ao listar links:", err);
    return NextResponse.json({ error: "Erro ao carregar histórico de links." }, { status: 500 });
  }
}
