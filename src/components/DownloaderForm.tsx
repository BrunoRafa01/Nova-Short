"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Search, Video, Music, CheckCircle2, AlertCircle, Clock, User, ShieldCheck } from "lucide-react";

interface FormatOption {
  formatId: string;
  type: "video" | "audio";
  extension: string;
  quality: string;
  label: string;
}

interface MediaMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  platform: string;
  availableFormats: FormatOption[];
}

export function DownloaderForm() {
  const searchParams = useSearchParams();
  const urlParam = searchParams?.get("url") || "";
  const [url, setUrl] = useState(urlParam);
  const [analyzing, setAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [selectedType, setSelectedType] = useState<"video" | "audio">("video");
  const [selectedQuality, setSelectedQuality] = useState<string>("720p");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (urlParam) {
      setUrl(urlParam);
    }
  }, [urlParam]);

  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [downloadReadyUrl, setDownloadReadyUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setAnalyzing(true);
    setError(null);
    setMetadata(null);
    setJobId(null);
    setProgress(0);
    setJobStatus(null);
    setDownloadReadyUrl(null);

    try {
      const res = await fetch("/api/download/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha ao inspecionar a URL.");
      }

      setMetadata(data.metadata);
      if (selectedType === "video") setSelectedQuality("720p");
      else setSelectedQuality("320k");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao analisar link.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartDownload = async () => {
    if (!metadata) return;

    setDownloading(true);
    setError(null);
    setProgress(10);
    setJobStatus("pending");

    try {
      const res = await fetch("/api/download/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          platform: metadata.platform,
          title: metadata.title,
          thumbnail: metadata.thumbnail,
          type: selectedType,
          quality: selectedQuality,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha ao iniciar processamento.");
      }

      setJobId(data.jobId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao enfileirar o download.");
      setDownloading(false);
    }
  };

  // Polling de status do job
  useEffect(() => {
    if (!jobId || jobStatus === "completed" || jobStatus === "failed") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/download/status/${jobId}`);
        const data = await res.json();

        if (res.ok && data.job) {
          setProgress(data.job.progress);
          setJobStatus(data.job.status);

          if (data.job.status === "completed") {
            setDownloadReadyUrl(data.job.downloadUrl);
            setDownloading(false);
            clearInterval(interval);
          } else if (data.job.status === "failed") {
            setError(data.job.errorMessage || "Processamento de mídia falhou.");
            setDownloading(false);
            clearInterval(interval);
          }
        }
      } catch {
        // Retry na próxima iteração
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [jobId, jobStatus]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  return (
    <div className="w-full">
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-5 sm:p-6">
        {/* Formulário de Input */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label htmlFor="media-url" className="block text-xs font-medium text-zinc-400 mb-2">
              Link de Vídeo ou Áudio (YouTube, TikTok, Instagram)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="media-url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou tiktok.com, instagram.com"
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={analyzing || !url.trim()}
            className="w-full h-10 px-5 rounded-md bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {analyzing ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin" />
                <span>Inspecionando formatos...</span>
              </span>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Analisar Link</span>
              </>
            )}
          </button>
        </form>

        {/* Prévia da Mídia e Seleção de Formatos */}
        {metadata && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in space-y-5">
            <div className="flex flex-col sm:flex-row gap-4 bg-[#07080B] p-4 rounded-xl border border-white/5">
              {metadata.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="w-full sm:w-32 h-20 object-cover rounded-lg border border-white/10"
                />
              ) : (
                <div className="w-full sm:w-32 h-20 bg-[#10141E] rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-[#64748B]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#94A3B8] bg-[#141A26] px-2 py-0.5 rounded border border-white/10">
                  {metadata.platform}
                </span>
                <h4 className="text-xs sm:text-sm font-medium text-[#F8FAFC] truncate mt-1.5" title={metadata.title}>
                  {metadata.title}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-[#64748B] mt-1.5">
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{metadata.author}</span>
                  </span>
                  {metadata.duration > 0 && (
                    <span className="flex items-center space-x-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(metadata.duration)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Alternador de Tipo: Vídeo vs Áudio */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-2">
                1. Tipo de Formato
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("video");
                    setSelectedQuality("720p");
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
                    selectedType === "video"
                      ? "bg-[#1E2536] text-white border border-white/15"
                      : "bg-[#07080B] text-[#94A3B8] border border-white/5 hover:text-[#F8FAFC]"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vídeo (MP4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("audio");
                    setSelectedQuality("320k");
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
                    selectedType === "audio"
                      ? "bg-[#1E2536] text-white border border-white/15"
                      : "bg-[#07080B] text-[#94A3B8] border border-white/5 hover:text-[#F8FAFC]"
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Áudio (MP3)</span>
                </button>
              </div>
            </div>

            {/* Seleção de Qualidade */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-2">
                2. Qualidade
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedType === "video" ? (
                  <>
                    {[
                      { q: "1080p", label: "1080p FHD" },
                      { q: "720p", label: "720p HD" },
                      { q: "480p", label: "480p SD" },
                    ].map((opt) => (
                      <button
                        key={opt.q}
                        type="button"
                        onClick={() => setSelectedQuality(opt.q)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedQuality === opt.q
                            ? "bg-[#1E2536] border-white/20 text-[#F8FAFC]"
                            : "bg-[#07080B] border-white/5 text-[#94A3B8] hover:border-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { q: "320k", label: "MP3 320kbps" },
                      { q: "192k", label: "MP3 192kbps" },
                    ].map((opt) => (
                      <button
                        key={opt.q}
                        type="button"
                        onClick={() => setSelectedQuality(opt.q)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedQuality === opt.q
                            ? "bg-[#1E2536] border-white/20 text-[#F8FAFC]"
                            : "bg-[#07080B] border-white/5 text-[#94A3B8] hover:border-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Ação e Progresso */}
            {!downloadReadyUrl ? (
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleStartDownload}
                  disabled={downloading}
                  className="w-full py-3 px-6 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {downloading ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processando ({progress}%)...</span>
                    </span>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Iniciar Download</span>
                    </>
                  )}
                </button>

                {downloading && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Progresso</span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#07080B] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-slate-300 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center space-y-3 animate-fade-in">
                <div className="flex items-center justify-center space-x-2 text-emerald-400 font-medium text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Download Concluído</span>
                </div>
                <a
                  href={downloadReadyUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Salvar Arquivo</span>
                </a>

                <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadReadyUrl(null);
                      setJobId(null);
                      setProgress(0);
                      setJobStatus(null);
                    }}
                    className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    Baixar em outro formato
                  </button>

                  <span className="text-[#334155]">•</span>

                  <button
                    type="button"
                    onClick={() => {
                      setMetadata(null);
                      setUrl("");
                      setJobId(null);
                      setDownloadReadyUrl(null);
                      setProgress(0);
                      setJobStatus(null);
                    }}
                    className="text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
                  >
                    Novo link
                  </button>
                </div>
              </div>
            )}

            {/* Aviso de Termos e Direitos Autorais */}
            <div className="p-3 rounded-lg bg-[#07080B] border border-white/5 text-[11px] text-[#64748B] flex items-start space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Aviso Legal:</strong> Processamento restrito a conteúdos próprios,
                de domínio público ou autorizados. O sistema respeita as políticas de DRM.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
