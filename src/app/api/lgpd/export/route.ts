import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anonymizeIp, logSecurityEvent } from "@/lib/security/compliance";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent");

  try {
    // Busca os links públicos mais recentes associados à sessão ou gerais para portabilidade
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
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro ao gerar arquivo de exportação de dados.", details: err.message },
      { status: 500 }
    );
  }
}
