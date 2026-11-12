"use client";

import { useState } from "react";
import { Link2, QrCode, ExternalLink, ArrowRight, Clock, Key, BarChart2, Video, Download } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { QRCodeModal } from "./QRCodeModal";
import Link from "next/link";

interface ShortenResult {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  title?: string;
  qrCode: string;
  expiresAt?: string;
}

interface ShortenerFormProps {
  onSwitchToDownloader?: (url: string) => void;
}

function checkVideoPlatform(targetUrl: string): { isVideo: boolean; platformName: string } {
  const lower = targetUrl.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return { isVideo: true, platformName: "YouTube" };
  }
  if (lower.includes("tiktok.com")) {
    return { isVideo: true, platformName: "TikTok" };
  }
  if (lower.includes("instagram.com")) {
    return { isVideo: true, platformName: "Instagram" };
  }
  if (lower.includes("twitter.com") || lower.includes("x.com")) {
    return { isVideo: true, platformName: "X (Twitter)" };
  }
  return { isVideo: false, platformName: "" };
}

export function ShortenerForm({ onSwitchToDownloader }: ShortenerFormProps = {}) {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [title, setTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [password, setPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [outputPreference, setOutputPreference] = useState<"link" | "qrcode">("link");
  const [resultTab, setResultTab] = useState<"link" | "qrcode">("link");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [showQR, setShowQR] = useState(false);

  const videoInfo = checkVideoPlatform(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const rawUrl = url.trim();
    const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: normalizedUrl,
          customSlug: customSlug.trim() || undefined,
          title: title.trim() || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          password: password.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao encurtar o link.");
      }

      setResult(data.link);
      setResultTab(outputPreference);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = (qrDataUrl: string, slug: string) => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode-${slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetForm = () => {
    setUrl("");
    setCustomSlug("");
    setTitle("");
    setExpiresAt("");
    setPassword("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="url-input" className="block text-xs font-medium text-zinc-400 mb-2">
              URL de Destino
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                id="url-input"
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com ou cole links de vídeos..."
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm transition-colors"
              />
            </div>

            {/* Notificação de Mídia */}
            {videoInfo.isVideo && (
              <div className="mt-3 p-3 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <Video className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  <span>
                    Vídeo do <strong>{videoInfo.platformName}</strong> detectado.
                  </span>
                </div>
                {onSwitchToDownloader && (
                  <button
                    type="button"
                    onClick={() => onSwitchToDownloader(url.trim())}
                    className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Usar Downloader</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Seleção de Formato Preferencial: Link ou QR Code */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Formato de Saída
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Formato de saída">
              <button
                type="button"
                role="radio"
                aria-checked={outputPreference === "link"}
                onClick={() => setOutputPreference("link")}
                className={`cursor-pointer p-3 rounded-md border flex items-center space-x-3 transition-colors ${
                  outputPreference === "link"
                    ? "bg-zinc-900 border-zinc-600 text-zinc-50"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"
                }`}
              >
                <div className={`p-2 rounded-md ${outputPreference === "link" ? "bg-zinc-800 text-zinc-50" : "bg-zinc-900 text-zinc-500"}`}>
                  <Link2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-zinc-100">Link Curto</div>
                  <div className="text-[11px] text-zinc-500">Redirecionamento & Métricas</div>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={outputPreference === "qrcode"}
                onClick={() => setOutputPreference("qrcode")}
                className={`cursor-pointer p-3 rounded-md border flex items-center space-x-3 transition-colors ${
                  outputPreference === "qrcode"
                    ? "bg-zinc-900 border-zinc-600 text-zinc-50"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"
                }`}
              >
                <div className={`p-2 rounded-md ${outputPreference === "qrcode" ? "bg-zinc-800 text-zinc-50" : "bg-zinc-900 text-zinc-500"}`}>
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-zinc-100">QR Code Digital</div>
                  <div className="text-[10px] text-[#64748B]">Escanear & Salvar</div>
                </div>
              </button>
            </div>
          </div>

          {/* Toggle de Opções Avançadas */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>{showAdvanced ? "Ocultar configurações adicionais" : "+ Opções adicionais (slug personalizado, senha, validade)"}</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 pt-3 border-t border-white/5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="custom-slug" className="block text-xs font-medium text-[#94A3B8] mb-1">
                    Slug Personalizado (opcional)
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-white/10 bg-[#07080B]">
                    <span className="px-2.5 py-2 text-xs text-[#64748B] bg-[#0E121B] border-r border-white/5 flex items-center">
                      /s/
                    </span>
                    <input
                      id="custom-slug"
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="meu-link"
                      className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="link-title" className="block text-xs font-medium text-[#94A3B8] mb-1">
                    Título (opcional)
                  </label>
                  <input
                    id="link-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Campanha Especial"
                    className="w-full px-3 py-2 bg-[#07080B] border border-white/10 rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expires-at" className="block text-xs font-medium text-[#94A3B8] mb-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#64748B]" />
                    <span>Data de Expiração (opcional)</span>
                  </label>
                  <input
                    id="expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#07080B] border border-white/10 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label htmlFor="password-prot" className="block text-xs font-medium text-[#94A3B8] mb-1 flex items-center space-x-1">
                    <Key className="w-3 h-3 text-[#64748B]" />
                    <span>Senha de Acesso (opcional)</span>
                  </label>
                  <input
                    id="password-prot"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Proteção para redirecionar"
                    className="w-full px-3 py-2 bg-[#07080B] border border-white/10 rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full h-10 px-5 rounded-md bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin" />
                <span>Processando link...</span>
              </span>
            ) : (
              <>
                <span>
                  {outputPreference === "qrcode" ? "Gerar QR Code & Encurtar" : "Encurtar Link"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Card de Resultado Clean */}
        {result && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
            <div className="bg-[#07080B] p-5 sm:p-6 rounded-2xl border border-white/10">
              {/* Header do Resultado */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/5">
                <div className="p-1 rounded-xl bg-[#0B0E14] border border-white/10 inline-flex space-x-1" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={resultTab === "link"}
                    onClick={() => setResultTab("link")}
                    className={`cursor-pointer flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      resultTab === "link"
                        ? "bg-[#1E2536] text-[#F8FAFC]"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Link Curto</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={resultTab === "qrcode"}
                    onClick={() => setResultTab("qrcode")}
                    className={`cursor-pointer flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      resultTab === "qrcode"
                        ? "bg-[#1E2536] text-[#F8FAFC]"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <QrCode className="w-3 h-3" />
                    <span>QR Code</span>
                  </button>
                </div>

                <div className="inline-flex items-center space-x-1.5 text-xs text-[#94A3B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Telemetria Ativa</span>
                </div>
              </div>

              {/* Aba Link Curto */}
              {resultTab === "link" && (
                <div className="pt-4 space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#F8FAFC] font-mono break-all">
                      {result.shortUrl}
                    </h4>
                    <p className="text-xs text-[#64748B] truncate mt-1">
                      Destino: <span className="text-[#94A3B8]">{result.originalUrl}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0E14] border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-[#94A3B8]">
                      <BarChart2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Cliques monitorados em tempo real</span>
                    </div>

                    <Link
                      href={`/estatisticas/${result.slug}`}
                      className="inline-flex items-center space-x-1 text-xs text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <span>Ver Estatísticas</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <CopyButton text={result.shortUrl} label="Copiar Link" />

                    <button
                      type="button"
                      onClick={() => setResultTab("qrcode")}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#10141E] text-[#CBD5E1] hover:bg-[#182030] border border-white/10 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Ver QR Code</span>
                    </button>

                    {checkVideoPlatform(result.originalUrl).isVideo && onSwitchToDownloader && (
                      <button
                        type="button"
                        onClick={() => onSwitchToDownloader(result.originalUrl)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#10141E] text-[#CBD5E1] hover:bg-[#182030] border border-white/10 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Mídia</span>
                      </button>
                    )}

                    <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-[#CBD5E1] transition-colors ml-auto"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Aba QR Code */}
              {resultTab === "qrcode" && (
                <div className="pt-4 flex flex-col items-center text-center space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-xs font-medium text-[#94A3B8]">QR Code para Compartilhamento</h4>
                    <p className="text-xs text-[#CBD5E1] font-mono mt-0.5">/s/{result.slug}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl shadow-xl inline-block border-2 border-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.qrCode}
                      alt={`QR Code para ${result.slug}`}
                      className="w-44 h-44 sm:w-48 sm:h-48 mx-auto object-contain"
                    />
                  </div>

                  <p className="text-xs text-[#64748B] max-w-sm">
                    Aponte a câmera do seu celular para testar ou baixar o código em PNG.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
                    <button
                      type="button"
                      onClick={() => handleDownloadQR(result.qrCode, result.slug)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#1E2536] hover:bg-[#253046] border border-white/10 text-white transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar PNG</span>
                    </button>

                    <CopyButton text={result.shortUrl} label="Copiar Link" />

                    <Link
                      href={`/estatisticas/${result.slug}`}
                      className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium bg-[#0B0E14] text-[#94A3B8] hover:text-white border border-white/5 transition-colors"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Estatísticas</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-[#64748B] hover:text-[#94A3B8] underline cursor-pointer"
              >
                Encurtar outro link
              </button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          qrCodeUrl={result.qrCode}
          slug={result.slug}
        />
      )}
    </div>
  );
}
