import { NextRequest, NextResponse } from "next/server";
import { logSecurityEvent } from "@/lib/security/compliance";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent");

  try {
    const body = await req.json();
    const { necessary, analytics, marketing } = body;

    logSecurityEvent(
      "CONSENT_PREFERENCES_SAVED",
      {
        necessary: Boolean(necessary),
        analytics: Boolean(analytics),
        marketing: Boolean(marketing),
      },
      ip,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: "Preferências de cookies salvas com sucesso.",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
}
