import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { validateUrlAgainstSSRF } from "@/lib/security/ssrf";
import { generateSlug, validateCustomSlug } from "@/lib/security/slug";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { hashPassword } from "@/lib/security/auth";
import { getBaseAppUrl } from "@/lib/network";

const shortenSchema = z.object({
  url: z.string().min(1, "URL é obrigatória").max(2048, "URL muito longa"),
  customSlug: z.string().optional(),
  title: z.string().max(255).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres").optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await checkRateLimit(`shorten:${ip}`, 30, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Limite de requisições excedido. Aguarde alguns instantes." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();
    const parsed = shortenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const { url, customSlug, title, expiresAt, password } = parsed.data;

    // Proteção SSRF rigorosa
    const ssrfCheck = await validateUrlAgainstSSRF(url);
    if (!ssrfCheck.valid) {
      return NextResponse.json({ error: ssrfCheck.error }, { status: 400 });
    }

    let slug: string;

    if (customSlug && customSlug.trim() !== "") {
      const slugVal = validateCustomSlug(customSlug.trim());
      if (!slugVal.valid) {
        return NextResponse.json({ error: slugVal.error }, { status: 400 });
      }

      slug = customSlug.trim();

      // Checar se já existe no banco
      const existing = await prisma.shortLink.findUnique({
        where: { slug },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Este link personalizado já está em uso. Escolha outro." },
          { status: 409 }
        );
      }
    } else {
      // Gerar slug único
      let attempts = 0;
      do {
        slug = generateSlug(6);
        const existing = await prisma.shortLink.findUnique({
          where: { slug },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < 5);
    }

    let hashedPassword = null;
    if (password && password.trim() !== "") {
      hashedPassword = await hashPassword(password);
    }

    const newLink = await prisma.shortLink.create({
      data: {
        slug,
        originalUrl: ssrfCheck.sanitizedUrl || url,
        title: title?.trim() || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        password: hashedPassword,
      },
    });

    const hostHeader = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const appUrl = getBaseAppUrl(hostHeader);
    const shortUrl = `${appUrl}/s/${slug}`;

    // Gerar QR Code em Base64
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#080C15",
        light: "#F8FAFC",
      },
    });

    return NextResponse.json(
      {
        success: true,
        link: {
          id: newLink.id,
          slug: newLink.slug,
          originalUrl: newLink.originalUrl,
          title: newLink.title,
          shortUrl,
          qrCode: qrCodeDataUrl,
          expiresAt: newLink.expiresAt,
          createdAt: newLink.createdAt,
          hasPassword: Boolean(newLink.password),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Erro ao encurtar link:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar a criação do link." },
      { status: 500 }
    );
  }
}
