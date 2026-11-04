import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateUrlAgainstSSRF } from "@/lib/security/ssrf";
import { analyzeMediaUrl } from "@/lib/downloader/extractor";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";

const analyzeSchema = z.object({
  url: z.string().url("URL inválida").min(1),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await checkRateLimit(`download_analyze:${ip}`, 15, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Limite de análises atingido. Aguarde 1 minuto." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = analyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "URL inválida ou ausente." }, { status: 400 });
    }

    const ssrfCheck = await validateUrlAgainstSSRF(parsed.data.url);
    if (!ssrfCheck.valid) {
      return NextResponse.json({ error: ssrfCheck.error }, { status: 400 });
    }

    const metadata = await analyzeMediaUrl(ssrfCheck.sanitizedUrl || parsed.data.url);

    return NextResponse.json({ success: true, metadata });
  } catch (err: unknown) {
    console.error("Erro na análise de mídia:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao analisar a URL informada." },
      { status: 500 }
    );
  }
}
