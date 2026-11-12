import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/security/auth";
import { anonymizeIp, logSecurityEvent } from "@/lib/security/compliance";
import { getClientIp } from "@/lib/security/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const userAgent = req.headers.get("user-agent");

  const admin = await getAdminSession().catch(() => null);
  if (!admin) {
    return NextResponse.json(
      { error: "Autenticação administrativa necessária para exportar registros completos." },
      { status: 401 }
    );
  }

  try {
    // Busca os links mais recentes para portabilidade administrativa
    const links = await prisma.shortLink.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        clicksCount: true,
        createdAt: true,
      },
    });

    logSecurityEvent("DSR_DATA_EXPORT", { exported_count: links.length }, ip, userAgent);

    return NextResponse.json({
      success: true,
      titular: {
        ip_anonymized: anonymizeIp(ip),
        solicitacao: "Exportação e Portabilidade de Dados Pessoais (Art. 18, V LGPD)",
        timestamp: new Date().toISOString(),
      },
      links,
      politica_retencao: "Os dados de redirecionamento são armazenados exclusivamente pelo tempo necessário para prestação do serviço.",
      base_legal: "Art. 7º, V da Lei 13.709/2018 (Execução de contrato/serviço)",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar arquivo de exportação de dados." },
      { status: 500 }
    );
  }
}
