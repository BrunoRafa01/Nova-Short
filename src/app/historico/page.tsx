"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { History, Link2, ExternalLink, Trash2, BarChart2, QrCode, Search, RefreshCw, Download, Video, Music, Clock } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { QRCodeModal } from "@/components/QRCodeModal";
import QRCode from "qrcode";

interface LinkItem {
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

interface DownloadItem {
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

export default function HistoricoPage() {
  const [activeTab, setActiveTab] = useState<"links" | "downloads">("links");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.error("Erro ao carregar histórico de downloads:", err);
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
    if (!confirm("Tem certeza que deseja excluir este link encurtado?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert(data.error || "Apenas administradores autenticados podem excluir links. Acesse o Painel Admin.");
      }
    } catch (err) {
      console.error("Erro ao excluir link:", err);
      alert("Falha na comunicação com o servidor.");
    }
  };

  const handleOpenQR = async (shortUrl: string, slug: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#080C15", light: "#F8FAFC" },
      });
      setSelectedQR({ url: dataUrl, slug });
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101828] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Gerenciamento Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">Histórico de Atividades</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Visualize e gerencie todos os seus links encurtados e downloads de mídia processados.
          </p>
        </div>

        <button
          onClick={activeTab === "links" ? fetchLinks : fetchDownloads}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#101828] hover:bg-[#152238] border border-[#1E2C48] text-xs font-medium text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#3B82F6]" : ""}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#1E2C48] mb-6 pb-2">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "links"
              ? "bg-[#3B82F6] text-white shadow-nova-glow"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101828]"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Links Encurtados ({links.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("downloads")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "downloads"
              ? "bg-[#3B82F6] text-white shadow-nova-glow"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101828]"
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Downloads de Mídia ({downloads.length})</span>
        </button>
      </div>

      {/* Visualização de Links */}
      {activeTab === "links" && (
        <>
          {/* Busca */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por slug, título ou URL de destino..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#101828] border border-[#1E2C48] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#94A3B8]">Carregando links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-12 text-center shadow-nova-card">
              <Link2 className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Nenhum link encontrado</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-6">
                Você ainda não encurtou nenhum link ou nenhum resultado correspondeu à sua pesquisa.
              </p>
              <Link
                href="/encurtador"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#60A5FA] text-white text-xs font-semibold transition-colors shadow-nova-glow"
              >
                <span>Encurtar Primeiro Link</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="bg-[#101828] border border-[#1E2C48] hover:border-[#3B82F6]/40 rounded-xl p-4 sm:p-5 transition-all shadow-nova-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-mono text-sm font-bold text-[#60A5FA]">
                        {link.shortUrl}
                      </span>
                      {link.title && (
                        <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                          • {link.title}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] truncate mb-2" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                    <div className="flex items-center space-x-4 text-[11px] text-[#64748B]">
                      <span className="text-emerald-400 font-semibold">{link.clicksCount} cliques</span>
                      <span>Criado em {new Date(link.createdAt).toLocaleDateString("pt-BR")}</span>
                      {link.expiresAt && (
                        <span className="text-amber-400">
                          Expira em {new Date(link.expiresAt).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <CopyButton text={link.shortUrl} />
                    <button
                      onClick={() => handleOpenQR(link.shortUrl, link.slug)}
                      title="Ver QR Code"
                      className="p-2 rounded-lg bg-[#080C15] hover:bg-[#152238] border border-[#1E2C48] text-[#94A3B8] hover:text-[#60A5FA] transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/estatisticas/${link.slug}`}
                      title="Ver Métricas"
                      className="p-2 rounded-lg bg-[#080C15] hover:bg-[#152238] border border-[#1E2C48] text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </Link>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Testar Redirecionamento"
                      className="p-2 rounded-lg bg-[#080C15] hover:bg-[#152238] border border-[#1E2C48] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(link.id)}
                        title="Excluir Link (Apenas Administrador)"
                        className="p-2 rounded-lg bg-[#080C15] hover:bg-red-950/40 border border-[#1E2C48] hover:border-red-500/40 text-[#94A3B8] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Visualização de Downloads */}
      {activeTab === "downloads" && (
        <div>
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#94A3B8]">Carregando histórico de downloads...</p>
            </div>
          ) : downloads.length === 0 ? (
            <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-12 text-center shadow-nova-card">
              <Download className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Nenhum download registrado</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-6">
                Você ainda não realizou downloads de vídeos ou áudios nesta sessão.
              </p>
              <Link
                href="/downloader"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#60A5FA] text-white text-xs font-semibold transition-colors shadow-nova-glow"
              >
                <span>Ir para o Downloader</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((d) => (
                <div
                  key={d.id}
                  className="bg-[#101828] border border-[#1E2C48] hover:border-[#3B82F6]/40 rounded-xl p-4 sm:p-5 transition-all shadow-nova-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 min-w-0 flex-1">
                    {d.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.thumbnail}
                        alt={d.title}
                        className="w-16 h-12 object-cover rounded-lg border border-[#1E2C48] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-[#080C15] rounded-lg border border-[#1E2C48] flex items-center justify-center shrink-0">
                        {d.format === "mp3" ? (
                          <Music className="w-5 h-5 text-[#60A5FA]" />
                        ) : (
                          <Video className="w-5 h-5 text-[#3B82F6]" />
                        )}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
                          {d.platform}
                        </span>
                        <span className="text-xs font-semibold text-[#F8FAFC] truncate" title={d.title}>
                          {d.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-[#64748B]">
                        <span className="font-mono text-[#60A5FA] uppercase font-semibold">
                          {d.format} • {d.quality}
                        </span>
                        <span>{new Date(d.createdAt).toLocaleDateString("pt-BR")}</span>
                        <span
                          className={`font-medium ${
                            d.status === "completed"
                              ? "text-emerald-400"
                              : d.status === "failed"
                              ? "text-red-400"
                              : d.status === "expired"
                              ? "text-amber-400"
                              : "text-blue-400 animate-pulse"
                          }`}
                        >
                          {d.status === "completed"
                            ? "Concluído"
                            : d.status === "failed"
                            ? "Falhou"
                            : d.status === "expired"
                            ? "Expirado"
                            : `Processando (${d.progress}%)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {d.downloadUrl ? (
                      <a
                        href={d.downloadUrl}
                        download
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                      </a>
                    ) : (
                      <Link
                        href={`/downloader?url=${encodeURIComponent(d.url)}`}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#080C15] hover:bg-[#152238] border border-[#1E2C48] text-[#94A3B8] hover:text-[#60A5FA] text-xs font-medium transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Baixar Novamente</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal QR Code */}
      {selectedQR && (
        <QRCodeModal
          isOpen={true}
          onClose={() => setSelectedQR(null)}
          qrCodeDataUrl={selectedQR.url}
          slug={selectedQR.slug}
        />
      )}
    </div>
  );
}
