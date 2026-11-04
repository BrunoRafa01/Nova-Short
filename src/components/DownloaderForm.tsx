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
      // Ajustar qualidade inicial
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-6 sm:p-8 shadow-nova-card nova-glow-border transition-all">
        {/* Formulário de Input */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label htmlFor="media-url" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Link do Vídeo ou Áudio (YouTube, TikTok, Instagram)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Search className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <input
                id="media-url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Cole aqui o link do YouTube, TikTok ou Instagram..."
                className="w-full pl-11 pr-4 py-3 bg-[#080C15] border border-[#1E2C48] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={analyzing || !url.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-nova-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Inspecionando link e formatos disponíveis...</span>
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analisar e Obter Prévia</span>
              </>
            )}
          </button>
        </form>

        {/* Prévia da Mídia e Seleção de Formatos */}
        {metadata && (
          <div className="mt-6 pt-6 border-t border-[#1E2C48] animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 bg-[#080C15] p-4 rounded-xl border border-[#1E2C48]">
              {metadata.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="w-full sm:w-36 h-24 object-cover rounded-lg border border-[#1E2C48]"
                />
              ) : (
                <div className="w-full sm:w-36 h-24 bg-[#152238] rounded-lg flex items-center justify-center">
                  <Video className="w-8 h-8 text-[#64748B]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
                  {metadata.platform}
                </span>
                <h4 className="text-sm font-semibold text-[#F8FAFC] truncate mt-1.5" title={metadata.title}>
                  {metadata.title}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-[#94A3B8] mt-2">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{metadata.author}</span>
                  </span>
                  {metadata.duration > 0 && (
                    <span className="flex items-center space-x-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDuration(metadata.duration)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Alternador de Tipo: Vídeo vs Áudio */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                1. Escolha o Tipo de Arquivo
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("video");
                    setSelectedQuality("720p");
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                    selectedType === "video"
                      ? "bg-[#3B82F6] text-white shadow-nova-glow"
                      : "bg-[#080C15] text-[#94A3B8] border border-[#1E2C48] hover:text-[#F8FAFC]"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Vídeo (MP4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("audio");
                    setSelectedQuality("320k");
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                    selectedType === "audio"
                      ? "bg-[#3B82F6] text-white shadow-nova-glow"
                      : "bg-[#080C15] text-[#94A3B8] border border-[#1E2C48] hover:text-[#F8FAFC]"
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Áudio (MP3)</span>
                </button>
              </div>
            </div>

            {/* Seleção de Qualidade */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                2. Selecione a Qualidade
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedType === "video" ? (
                  <>
                    {[
                      { q: "1080p", label: "1080p FHD" },
                      { q: "720p", label: "720p HD (Recomendado)" },
                      { q: "480p", label: "480p SD" },
                    ].map((opt) => (
                      <button
                        key={opt.q}
                        type="button"
                        onClick={() => setSelectedQuality(opt.q)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedQuality === opt.q
                            ? "bg-[#152238] border-[#3B82F6] text-[#60A5FA]"
                            : "bg-[#080C15] border-[#1E2C48] text-[#94A3B8] hover:border-[#3B82F6]/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { q: "320k", label: "MP3 320kbps (Alta fidelidade)" },
                      { q: "192k", label: "MP3 192kbps (Padrão)" },
                    ].map((opt) => (
                      <button
                        key={opt.q}
                        type="button"
                        onClick={() => setSelectedQuality(opt.q)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedQuality === opt.q
                            ? "bg-[#152238] border-[#3B82F6] text-[#60A5FA]"
                            : "bg-[#080C15] border-[#1E2C48] text-[#94A3B8] hover:border-[#3B82F6]/50"
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
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleStartDownload}
                  disabled={downloading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-nova-glow transition-all disabled:opacity-50"
                >
                  {downloading ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processando Mídia com FFmpeg ({progress}%)...</span>
                    </span>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Processar e Baixar Agora</span>
                    </>
                  )}
                </button>

                {downloading && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Progresso do processamento</span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#080C15] rounded-full overflow-hidden border border-[#1E2C48]">
                      <div
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
                <div className="flex items-center justify-center space-x-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Arquivo Processado com Sucesso!</span>
                </div>
                <a
                  href={downloadReadyUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Salvar Arquivo no Computador</span>
                </a>

                <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#1E2C48]">
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadReadyUrl(null);
                      setJobId(null);
                      setProgress(0);
                      setJobStatus(null);
                    }}
                    className="text-xs text-[#60A5FA] hover:text-white font-medium hover:underline transition-colors"
                  >
                    Baixar outra qualidade/formato deste conteúdo
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
                    className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:underline transition-colors"
                  >
                    Analisar novo link
                  </button>
                </div>
              </div>
            )}

            {/* Aviso de Termos e Direitos Autorais */}
            <div className="p-3 rounded-lg bg-[#080C15] border border-[#1E2C48] text-[11px] text-[#64748B] flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <span>
                <strong>Aviso Legal:</strong> O NOVA SHORT destina-se ao download de materiais
                autorizados, de domínio público ou próprios. O sistema não quebra proteções digitais
                (DRM) e segue os termos de serviço das plataformas.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
