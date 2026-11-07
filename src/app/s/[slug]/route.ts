import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/security/rate-limiter";
import { verifyPassword } from "@/lib/security/auth";

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

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderHtmlStatusPage({
  title,
  message,
  badgeText,
  badgeBg,
  badgeColor,
  statusCode,
  isPasswordPrompt = false,
  slug = "",
  error = "",
}: {
  title: string;
  message: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  statusCode: number;
  isPasswordPrompt?: boolean;
  slug?: string;
  error?: string;
}) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeBadgeText = escapeHtml(badgeText);
  const safeSlug = escapeHtml(slug);
  const safeError = escapeHtml(error);

  const formHtml = isPasswordPrompt
    ? `
      <form method="POST" action="/s/${safeSlug}" style="margin-top: 16px;">
        ${safeError ? `<div style="background-color: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.25); color: #FCA5A5; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;">${safeError}</div>` : ""}
        <input type="password" name="password" required placeholder="Digite a senha de acesso..." style="width: 100%; box-sizing: border-box; padding: 12px 16px; background-color: #07080B; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: #F8FAFC; font-size: 14px; margin-bottom: 16px; outline: none;" />
        <button type="submit" style="width: 100%; background-color: #1E2536; color: white; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,0.12); cursor: pointer; transition: background-color 0.2s;">Desbloquear e Acessar</button>
      </form>
    `
    : `
      <a href="/" style="display: inline-block; background-color: #1E2536; color: white; padding: 10px 22px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 500; border: 1px solid rgba(255,255,255,0.1); transition: background-color 0.2s;">Voltar para o Início</a>
    `;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — NOVA SHORT</title>
  <style>
    body { margin: 0; background-color: #07080B; color: #F8FAFC; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
    .card { background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 36px 32px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 18px; background-color: ${badgeBg}; color: ${badgeColor}; }
    h1 { font-size: 18px; margin: 0 0 10px; color: #F8FAFC; font-weight: 700; }
    p { font-size: 13px; color: #94A3B8; margin: 0 0 24px; line-height: 1.5; }
    .brand { font-size: 11px; color: #64748B; margin-top: 24px; letter-spacing: 1px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${safeBadgeText}</div>
    <h1>${safeTitle}</h1>
    <p>${safeMessage}</p>
    ${formHtml}
    <div class="brand">NOVA SHORT • NOVA RUNTIME</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: statusCode,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
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
      return renderHtmlStatusPage({
        title: "Link Não Encontrado ou Desativado",
        message: "O endereço que você tentou acessar não existe, foi alterado ou está temporariamente inativo na plataforma.",
        badgeText: "Erro 404 • Não Encontrado",
        badgeBg: "rgba(239, 68, 68, 0.15)",
        badgeColor: "#FCA5A5",
        statusCode: 404,
      });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return renderHtmlStatusPage({
        title: "Este Link Encurtado Expirou",
        message: "O prazo de validade deste link foi atingido e o redirecionamento foi encerrado pelo criador.",
        badgeText: "Erro 410 • Link Expirado",
        badgeBg: "rgba(234, 179, 8, 0.15)",
        badgeColor: "#FDE047",
        statusCode: 410,
      });
    }

    // Se o link possui senha e nenhuma senha foi informada via query
    if (link.password) {
      const queryPassword = req.nextUrl.searchParams.get("pwd");
      if (queryPassword) {
        const isMatch = await verifyPassword(queryPassword, link.password);
        if (!isMatch) {
          return renderHtmlStatusPage({
            title: "Link Protegido por Senha",
            message: "Este link requer autenticação prévia para redirecionamento.",
            badgeText: "Acesso Restrito",
            badgeBg: "rgba(59, 130, 246, 0.15)",
            badgeColor: "#93C5FD",
            statusCode: 401,
            isPasswordPrompt: true,
            slug,
            error: "Senha incorreta. Tente novamente.",
          });
        }
      } else {
        return renderHtmlStatusPage({
          title: "Link Protegido por Senha",
          message: "Este link foi configurado com proteção de acesso por senha. Digite-a abaixo para prosseguir:",
          badgeText: "Acesso Restrito",
          badgeBg: "rgba(59, 130, 246, 0.15)",
          badgeColor: "#93C5FD",
          statusCode: 401,
          isPasswordPrompt: true,
          slug,
        });
      }
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formData = await req.formData().catch(() => null);
    const password = formData?.get("password")?.toString() || "";

    const link = await prisma.shortLink.findUnique({
      where: { slug },
    });

    if (!link || !link.isActive) {
      return renderHtmlStatusPage({
        title: "Link Não Encontrado ou Desativado",
        message: "O endereço que você tentou acessar não existe ou foi removido.",
        badgeText: "Erro 404",
        badgeBg: "rgba(239, 68, 68, 0.15)",
        badgeColor: "#FCA5A5",
        statusCode: 404,
      });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return renderHtmlStatusPage({
        title: "Link Expirado",
        message: "O prazo de validade deste link foi atingido.",
        badgeText: "Erro 410",
        badgeBg: "rgba(234, 179, 8, 0.15)",
        badgeColor: "#FDE047",
        statusCode: 410,
      });
    }

    if (!link.password) {
      return NextResponse.redirect(link.originalUrl, 307);
    }

    const isMatch = await verifyPassword(password, link.password);
    if (!isMatch) {
      return renderHtmlStatusPage({
        title: "Link Protegido por Senha",
        message: "A senha fornecida está incorreta.",
        badgeText: "Acesso Não Autorizado",
        badgeBg: "rgba(239, 68, 68, 0.15)",
        badgeColor: "#FCA5A5",
        statusCode: 401,
        isPasswordPrompt: true,
        slug,
        error: "Senha incorreta. Verifique e tente novamente.",
      });
    }

    // Coleta de telemetria anônima
    const ip = getClientIp(req.headers);
    const ipHash = crypto.createHash("sha256").update(ip + "nova_salt").digest("hex").slice(0, 16);
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "Direto";
    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);

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
    ]).catch(() => {});

    return NextResponse.redirect(link.originalUrl, 307);
  } catch (err) {
    console.error("Erro no POST de desbloqueio do slug:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
