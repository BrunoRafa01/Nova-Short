import { NextRequest, NextResponse } from "next/server";
import { anonymizeIp, logSecurityEvent, sanitizeInput } from "@/lib/security/compliance";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent");

  try {
    const body = await req.json();
    const { name, email, requestType, message } = body;

    if (!email || !requestType) {
      return NextResponse.json(
        { error: "E-mail e Tipo de Solicitação são obrigatórios para identificar o titular." },
        { status: 400 }
      );
    }

    const validTypes = ["confirmacao", "acesso", "correcao", "anonimizacao", "exclusao", "revogacao"];
    if (!validTypes.includes(requestType)) {
      return NextResponse.json(
        { error: `Tipo inválido. Opções aceitas: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const protocol = `LGPD-NOVA-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;

    logSecurityEvent(
      "DSR_REQUEST_CREATED",
      {
        protocol,
        requestType,
        email_masked: email.replace(/(.{2})(.*)(?=@)/, "$1***"),
        message: message ? sanitizeInput(message) : "",
      },
      ip,
      userAgent
    );

    return NextResponse.json(
      {
        success: true,
        protocolo: protocol,
        mensagem: "Sua solicitação de direitos de titular foi registrada com sucesso e será respondida em até 15 dias úteis.",
        tipo: requestType,
        contato_dpo: "dpo@novashort.com.br",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
}
