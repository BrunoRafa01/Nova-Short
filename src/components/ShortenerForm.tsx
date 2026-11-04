"use client";

import { useState } from "react";
import { Link2, Sparkles, QrCode, ExternalLink, ArrowRight, Clock, Key, BarChart2, Video, Download } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [showQR, setShowQR] = useState(false);

  const videoInfo = checkVideoPlatform(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Normalização automática: adiciona https:// se o usuário colar sem protocolo
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-6 sm:p-8 shadow-nova-card nova-glow-border transition-all">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              URL de Destino (Sites, YouTube, TikTok, Instagram...)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Link2 className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <input
                id="url-input"
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com ou youtube.com, tiktok.com/@usuario..."
                className="w-full pl-11 pr-4 py-3 bg-[#080C15] border border-[#1E2C48] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm transition-colors"
              />
            </div>

            {/* Notificação Inteligente de Mídia */}
            {videoInfo.isVideo && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs animate-fade-in">
                <div className="flex items-center space-x-2 text-[#60A5FA]">
                  <Video className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>
                    Vídeo do <strong>{videoInfo.platformName}</strong> detectado! Você pode encurtar este link ou baixá-lo diretamente.
                  </span>
                </div>
                {onSwitchToDownloader && (
                  <button
                    type="button"
                    onClick={() => onSwitchToDownloader(url.trim())}
                    className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar no Downloader</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Toggle de Opções Avançadas */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-[#60A5FA] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{showAdvanced ? "Ocultar opções avançadas" : "+ Opções avançadas (slug, expiração, senha)"}</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-[#1E2C48] animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="custom-slug" className="block text-xs font-medium text-[#94A3B8] mb-1">
                    Slug Personalizado (opcional)
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-[#1E2C48] bg-[#080C15]">
                    <span className="px-2.5 py-2 text-xs text-[#64748B] bg-[#152238] border-r border-[#1E2C48] flex items-center">
                      /s/
                    </span>
                    <input
                      id="custom-slug"
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="meu-video"
                      className="w-full px-3 py-2 bg-transparent text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="link-title" className="block text-xs font-medium text-[#94A3B8] mb-1">
                    Título do Link (opcional)
                  </label>
                  <input
                    id="link-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vídeo do TikTok sobre IA"
                    className="w-full px-3 py-2 bg-[#080C15] border border-[#1E2C48] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expires-at" className="block text-xs font-medium text-[#94A3B8] mb-1 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Data de Expiração (opcional)</span>
                  </label>
                  <input
                    id="expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080C15] border border-[#1E2C48] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label htmlFor="password-prot" className="block text-xs font-medium text-[#94A3B8] mb-1 flex items-center space-x-1">
                    <Key className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Senha de Proteção (opcional)</span>
                  </label>
                  <input
                    id="password-prot"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha para redirecionar"
                    className="w-full px-3 py-2 bg-[#080C15] border border-[#1E2C48] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-nova-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Encurtando e Gerando QR Code...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>Encurtar Link Agora</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Card de Resultado */}
        {result && (
          <div className="mt-6 pt-6 border-t border-[#1E2C48] animate-fade-in">
            <div className="bg-[#080C15] p-4 sm:p-5 rounded-xl border border-[#3B82F6]/30 shadow-inner">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Encurtado com Sucesso
                  </span>
                  <h4 className="text-sm font-semibold text-[#F8FAFC] mt-2 font-mono">
                    {result.shortUrl}
                  </h4>
                  <p className="text-xs text-[#94A3B8] truncate max-w-sm sm:max-w-md mt-1">
                    Destino: {result.originalUrl}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#1E2C48]/60">
                <CopyButton text={result.shortUrl} label="Copiar Link" />

                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#152238] text-[#F8FAFC] hover:bg-[#1E2C48] border border-[#1E2C48] transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Ver QR Code</span>
                </button>

                {checkVideoPlatform(result.originalUrl).isVideo && onSwitchToDownloader && (
                  <button
                    type="button"
                    onClick={() => onSwitchToDownloader(result.originalUrl)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#3B82F6]/20 text-[#60A5FA] hover:bg-[#3B82F6]/30 border border-[#3B82F6]/40 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Vídeo</span>
                  </button>
                )}

                <Link
                  href={`/estatisticas/${result.slug}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#152238] text-[#60A5FA] hover:bg-[#1E2C48] border border-[#1E2C48] transition-colors"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Estatísticas</span>
                </Link>

                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors ml-auto"
                >
                  <span>Testar Redirecionamento</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] underline cursor-pointer"
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
