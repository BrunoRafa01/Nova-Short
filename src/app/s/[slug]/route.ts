import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/security/rate-limiter";

function parseDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "Mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "Tablet";
  return "Desktop";
}

function parseBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("chrome") && !ua.includes("edg")) return "Chrome";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("opera") || ua.includes("opr")) return "Opera";
  return "Outro";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const link = await prisma.shortLink.findUnique({
      where: { slug },
    });

    if (!link || !link.isActive) {
      return new NextResponse("Link não encontrado ou desativado.", { status: 404 });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return new NextResponse("Este link encurtado expirou.", { status: 410 });
    }

    // Coleta de telemetria anônima
    const ip = getClientIp(req.headers);
    const ipHash = crypto.createHash("sha256").update(ip + "nova_salt").digest("hex").slice(0, 16);
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "Direto";
    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);

    // Atualização de métricas assíncrona
    prisma.$transaction([
      prisma.shortLink.update({
        where: { id: link.id },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.linkClick.create({
        data: {
          linkId: link.id,
          ipHash,
          userAgent: userAgent.slice(0, 255),
          referer: referer.slice(0, 255),
          device,
          browser,
        },
      }),
    ]).catch((err) => {
      console.error("Erro ao registrar métrica de clique:", err);
    });

    // Redirecionamento 307
    return NextResponse.redirect(link.originalUrl, 307);
  } catch (err) {
    console.error("Erro no redirecionamento do slug:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
