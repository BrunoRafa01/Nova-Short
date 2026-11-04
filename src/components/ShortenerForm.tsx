"use client";

import { useState } from "react";
import { Link2, Sparkles, QrCode, ExternalLink, ArrowRight, Clock, Key, BarChart2, Video, Download, CheckCircle2, Share2 } from "lucide-react";
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

          {/* Seleção de Formato Preferencial: Link ou QR Code */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Escolha o Formato Principal de Saída
            </label>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Formato de saída">
              <button
                type="button"
                role="radio"
                aria-checked={outputPreference === "link"}
                onClick={() => setOutputPreference("link")}
                className={`cursor-pointer p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                  outputPreference === "link"
                    ? "bg-[#3B82F6]/15 border-[#3B82F6] text-[#F8FAFC] shadow-nova-glow"
                    : "bg-[#080C15] border-[#1E2C48] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B82F6]/40"
                }`}
              >
                <div className={`p-2 rounded-lg ${outputPreference === "link" ? "bg-[#3B82F6] text-white" : "bg-[#152238] text-[#94A3B8]"}`}>
                  <Link2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#F8FAFC]">Link Curto</div>
                  <div className="text-[10px] text-[#94A3B8]">Telemetria e Redirecionamento</div>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={outputPreference === "qrcode"}
                onClick={() => setOutputPreference("qrcode")}
                className={`cursor-pointer p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                  outputPreference === "qrcode"
                    ? "bg-[#3B82F6]/15 border-[#3B82F6] text-[#F8FAFC] shadow-nova-glow"
                    : "bg-[#080C15] border-[#1E2C48] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B82F6]/40"
                }`}
              >
                <div className={`p-2 rounded-lg ${outputPreference === "qrcode" ? "bg-[#3B82F6] text-white" : "bg-[#152238] text-[#94A3B8]"}`}>
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#F8FAFC]">QR Code Digital</div>
                  <div className="text-[10px] text-[#94A3B8]">Pronto para Escanear e Salvar</div>
                </div>
              </button>
            </div>
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
                      placeholder="meu-link"
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
                    placeholder="Ex: Campanha de Lançamento"
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
                <span>Processando encurtamento ultrarrápido...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>
                  {outputPreference === "qrcode" ? "Gerar QR Code & Encurtar" : "Encurtar Link Agora"}
                </span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Card de Resultado com Escolha Dinâmica entre Link e QR Code */}
        {result && (
          <div className="mt-6 pt-6 border-t border-[#1E2C48] animate-fade-in">
            <div className="bg-[#080C15] p-5 sm:p-6 rounded-2xl border border-[#3B82F6]/30 shadow-nova-card">
              {/* Header do Resultado com Switcher de Visualização */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                {/* Abas de Escolha no Resultado */}
                <div className="p-1 rounded-xl bg-[#101828] border border-[#1E2C48] inline-flex space-x-1" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={resultTab === "link"}
                    onClick={() => setResultTab("link")}
                    className={`cursor-pointer flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      resultTab === "link"
                        ? "bg-[#3B82F6] text-white shadow-sm"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Link Curto</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={resultTab === "qrcode"}
                    onClick={() => setResultTab("qrcode")}
                    className={`cursor-pointer flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      resultTab === "qrcode"
                        ? "bg-[#3B82F6] text-white shadow-sm"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Code</span>
                  </button>
                </div>

                {/* Badge de Telemetria Ultrarrápida */}
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Telemetria em Tempo Real Ativa</span>
                </div>
              </div>

              {/* Conteúdo da Aba Link Curto */}
              {resultTab === "link" && (
                <div className="pt-4 space-y-4 animate-fade-in">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Link Encurtado Pronto
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-[#F8FAFC] mt-2 font-mono break-all">
                      {result.shortUrl}
                    </h4>
                    <p className="text-xs text-[#94A3B8] truncate mt-1">
                      Destino: <span className="text-[#CBD5E1]">{result.originalUrl}</span>
                    </p>
                  </div>

                  {/* Painel de Telemetria Compacto */}
                  <div className="p-3.5 rounded-xl bg-[#101828] border border-[#1E2C48] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-[#94A3B8]">
                      <BarChart2 className="w-4 h-4 text-[#3B82F6]" />
                      <span>Monitoramento de cliques, dispositivos e navegadores ativado para <strong>/s/{result.slug}</strong></span>
                    </div>

                    <Link
                      href={`/estatisticas/${result.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#60A5FA] hover:text-white transition-colors"
                    >
                      <span>Ver Estatísticas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <CopyButton text={result.shortUrl} label="Copiar Link" />

                    <button
                      type="button"
                      onClick={() => setResultTab("qrcode")}
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
              )}

              {/* Conteúdo da Aba QR Code */}
              {resultTab === "qrcode" && (
                <div className="pt-4 flex flex-col items-center text-center space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">QR Code Digital de Alta Resolução</h4>
                    <p className="text-xs text-[#94A3B8] mt-1 font-mono">/s/{result.slug}</p>
                  </div>

                  {/* QR Code Grande e Nítido */}
                  <div className="bg-white p-4 rounded-2xl shadow-nova-glow border-4 border-white inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.qrCode}
                      alt={`QR Code para ${result.slug}`}
                      className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                    />
                  </div>

                  <p className="text-xs text-[#94A3B8] max-w-sm">
                    Aponte a câmera do seu smartphone para o QR Code para redirecionamento imediato com telemetria.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 w-full">
                    <button
                      type="button"
                      onClick={() => handleDownloadQR(result.qrCode, result.slug)}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#3B82F6] hover:bg-[#60A5FA] text-white shadow-nova-glow transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar QR Code (PNG)</span>
                    </button>

                    <CopyButton text={result.shortUrl} label="Copiar Link" />

                    <Link
                      href={`/estatisticas/${result.slug}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#152238] text-[#60A5FA] hover:bg-[#1E2C48] border border-[#1E2C48] transition-colors"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Ver Estatísticas</span>
                    </Link>
                  </div>
                </div>
              )}
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
