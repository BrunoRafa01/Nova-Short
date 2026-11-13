import { prisma } from "@/lib/prisma";
import { getBaseAppUrl } from "@/lib/network";
import { HistoricoClient, LinkItem } from "@/components/HistoricoClient";

export const dynamic = "force-dynamic";

export default async function HistoricoPage() {
  const appUrl = getBaseAppUrl();

  let initialLinks: LinkItem[] = [];
  let dbOffline = false;
  try {
    const rawLinks = await prisma.shortLink.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    initialLinks = rawLinks.map((l) => ({
      id: l.id,
      slug: l.slug,
      shortUrl: `${appUrl}/s/${l.slug}`,
      originalUrl: l.password ? "[Protegido por senha]" : l.originalUrl,
      title: l.title || undefined,
      clicksCount: l.clicksCount,
      isActive: l.isActive,
      expiresAt: l.expiresAt ? l.expiresAt.toISOString() : undefined,
      createdAt: l.createdAt.toISOString(),
    }));
  } catch {
    dbOffline = true;
    console.warn("Banco de dados indisponível ao carregar histórico inicial.");
  }

  return <HistoricoClient initialLinks={initialLinks} initialDbOffline={dbOffline} />;
}
