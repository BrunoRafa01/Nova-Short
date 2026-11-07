"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { History, Link2, ExternalLink, Trash2, BarChart2, QrCode, Search, RefreshCw, Download, Video, Music, Clock } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { QRCodeModal } from "@/components/QRCodeModal";
import QRCode from "qrcode";

export interface LinkItem {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  title?: string;
  clicksCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  platform: string;
  thumbnail?: string;
  format: string;
  quality: string;
  status: string;
  progress: number;
  createdAt: string;
  expiresAt: string;
  downloadUrl?: string | null;
}

interface HistoricoClientProps {
  initialLinks?: LinkItem[];
}

export function HistoricoClient({ initialLinks = [] }: HistoricoClientProps) {
  const [activeTab, setActiveTab] = useState<"links" | "downloads">("links");
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(initialLinks.length === 0);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedQR, setSelectedQR] = useState<{ url: string; slug: string } | null>(null);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAdmin(true);
        }
      } catch {}
    }
    checkAdminStatus();
  }, []);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/links?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (res.ok && data.links) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error("Erro ao carregar links:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/download/history");
      const data = await res.json();
      if (res.ok && data.downloads) {
        setDownloads(data.downloads);
      }
    } catch (err) {
      console.error("Erro ao carregar downloads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "links") {
      fetchLinks();
    } else {
      fetchDownloads();
    }
  }, [activeTab, fetchLinks, fetchDownloads]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza de que deseja remover este link encurtado?")) return;

    try {
      const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert("Erro ao excluir link.");
      }
    } catch {
      alert("Falha na comunicação com o servidor.");
    }
  };

  const handleOpenQR = async (link: LinkItem) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(link.shortUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#07080B", light: "#FFFFFF" },
      });
      setSelectedQR({ url: qrDataUrl, slug: link.slug });
    } catch (err) {
      console.error("Falha ao gerar QR Code:", err);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E121B] border border-white/10 text-[11px] text-[#94A3B8] mb-2 tracking-wide">
            <History className="w-3.5 h-3.5" />
            <span>CENTRAL DE REGISTROS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Histórico de Atividades</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Links encurtados com telemetria e downloads processados recentemente.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => (activeTab === "links" ? fetchLinks() : fetchDownloads())}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0E121B] border border-white/10 hover:border-white/20 text-xs font-medium text-[#F8FAFC] transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#3B82F6]" : ""}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("links")}
          className={`cursor-pointer pb-3 px-4 text-xs sm:text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "links"
              ? "border-[#3B82F6] text-[#F8FAFC]"
              : "border-transparent text-[#64748B] hover:text-[#94A3B8]"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Links ({links.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("downloads")}
          className={`cursor-pointer pb-3 px-4 text-xs sm:text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "downloads"
              ? "border-[#3B82F6] text-[#F8FAFC]"
              : "border-transparent text-[#64748B] hover:text-[#94A3B8]"
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Downloads ({downloads.length})</span>
        </button>
      </div>

      {/* Aba de Links */}
      {activeTab === "links" && (
        <div>
          {/* Busca */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por slug, título ou URL..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0E14] border border-white/10 rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#64748B]">Carregando...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-12 text-center">
              <Link2 className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
              <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">Nenhum link registrado</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-6">
                Encurte URLs para acompanhar métricas e gerar QR codes.
              </p>
              <Link
                href="/encurtador"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1E2536] hover:bg-[#253046] border border-white/10 text-white text-xs font-medium transition-colors"
              >
                <span>Encurtar Link</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="bg-[#0B0E14] border border-white/5 hover:border-white/10 rounded-xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm sm:text-base font-semibold text-[#F8FAFC] tracking-tight">
                        /s/{link.slug}
                      </span>
                      {link.expiresAt && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded flex items-center space-x-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Expira</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] truncate mt-1 max-w-md">
                      {link.originalUrl}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-[#64748B] mt-2">
                      <span>{new Date(link.createdAt).toLocaleDateString("pt-BR")}</span>
                      <span>•</span>
                      <span className="text-[#94A3B8] font-medium">{link.clicksCount} cliques</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <CopyButton text={link.shortUrl} label="Copiar" />

                    <button
                      type="button"
                      onClick={() => handleOpenQR(link)}
                      className="p-2 rounded-lg bg-[#07080B] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/5 hover:border-white/15 transition-colors"
                      title="Ver QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href={`/estatisticas/${link.slug}`}
                      className="p-2 rounded-lg bg-[#07080B] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/5 hover:border-white/15 transition-colors"
                      title="Ver Estatísticas"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                    </Link>

                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#07080B] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/5 hover:border-white/15 transition-colors"
                      title="Testar Redirecionamento"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(link.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                        title="Excluir Link (Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba de Downloads */}
      {activeTab === "downloads" && (
        <div>
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#64748B]">Carregando downloads...</p>
            </div>
          ) : downloads.length === 0 ? (
            <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-12 text-center">
              <Download className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
              <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">Nenhum download recente</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-6">
                Arquivos processados pelo downloader ficam disponíveis para download por até 2 horas.
              </p>
              <Link
                href="/downloader"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1E2536] hover:bg-[#253046] border border-white/10 text-white text-xs font-medium transition-colors"
              >
                <span>Usar Downloader</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0B0E14] border border-white/5 hover:border-white/10 rounded-xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#07080B] border border-white/5 flex items-center justify-center flex-shrink-0">
                      {item.format === "mp3" ? (
                        <Music className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Video className="w-4 h-4 text-[#3B82F6]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-[#F8FAFC] truncate max-w-md">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-[#64748B] mt-0.5">
                        <span className="capitalize">{item.platform}</span>
                        <span>•</span>
                        <span className="uppercase">{item.quality}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.status === "completed" && item.downloadUrl ? (
                      <a
                        href={item.downloadUrl}
                        download
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E2536] hover:bg-[#253046] border border-white/10 text-[#F8FAFC] text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                      </a>
                    ) : item.status === "processing" ? (
                      <span className="text-xs text-[#94A3B8] flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
                        <span>Processando ({item.progress}%)</span>
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">Falha</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de QR Code */}
      {selectedQR && (
        <QRCodeModal
          isOpen={!!selectedQR}
          onClose={() => setSelectedQR(null)}
          qrCodeUrl={selectedQR.url}
          slug={selectedQR.slug}
        />
      )}
    </div>
  );
}
