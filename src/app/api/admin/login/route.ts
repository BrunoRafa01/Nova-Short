import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signAdminToken, verifyPassword, ADMIN_COOKIE_NAME } from "@/lib/security/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await checkRateLimit(`admin_login:${ip}`, 5, 300); // 5 tentativas a cada 5 min

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de login falhas. Tente novamente em 5 minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados de login inválidos." }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@novaruntime.com";
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin_change_me_123";

    let admin = await prisma.adminUser.findUnique({
      where: { email },
    }).catch(() => null);

    let isValid = false;

    if (admin) {
      isValid = await verifyPassword(password, admin.passwordHash);
    } else if (email === defaultEmail && password === defaultPassword) {
      // Login inicial com credencial padrão configurada
      isValid = true;
      admin = {
        id: "default-admin-id",
        email: defaultEmail,
        name: "Administrador NOVA",
        role: "admin",
        passwordHash: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    if (!isValid || !admin) {
      return NextResponse.json({ error: "Credenciais de acesso incorretas." }, { status: 401 });
    }

    const token = await signAdminToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Erro no login administrativo:", err);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Sessão encerrada." });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
