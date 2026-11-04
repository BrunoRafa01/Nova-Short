"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { History, Link2, ExternalLink, Trash2, BarChart2, QrCode, Search, RefreshCw } from "lucide-react";
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

export default function HistoricoPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQR, setSelectedQR] = useState<{ url: string; slug: string } | null>(null);

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

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este link encurtado?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error("Erro ao excluir link:", err);
    }
  };

  const handleOpenQR = async (shortUrl: string, slug: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#080B12", light: "#F8FAFC" },
      });
      setSelectedQR({ url: dataUrl, slug });
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101622] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Gerenciamento de Links</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">Histórico de Links</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Visualize, monitore cliques e gerencie todos os links gerados na plataforma.
          </p>
        </div>

        <button
          onClick={fetchLinks}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#101622] hover:bg-[#161F30] border border-[#1E293B] text-xs font-medium text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#3B82F6]" : ""}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por slug, título ou URL de destino..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#101622] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Lista de Links */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#94A3B8]">Carregando histórico...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="bg-[#101622] border border-[#1E293B] rounded-2xl p-12 text-center shadow-nova-card">
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
              className="bg-[#101622] border border-[#1E293B] hover:border-[#3B82F6]/40 rounded-xl p-4 sm:p-5 transition-all shadow-nova-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="font-mono text-sm font-bold text-[#60A5FA]">
                    {link.shortUrl}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#161F30] border border-[#1E293B] text-[#94A3B8]">
                    {link.clicksCount} {link.clicksCount === 1 ? "clique" : "cliques"}
                  </span>
                  {link.title && (
                    <span className="text-xs text-[#F8FAFC] font-medium truncate max-w-[200px]">
                      • {link.title}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#94A3B8] truncate max-w-md sm:max-w-xl" title={link.originalUrl}>
                  Destino: {link.originalUrl}
                </p>

                <div className="text-[10px] text-[#64748B] mt-2 font-mono flex items-center space-x-3">
                  <span>Criado em: {new Date(link.createdAt).toLocaleDateString("pt-BR")}</span>
                  {link.expiresAt && (
                    <span className="text-amber-400">
                      Expira: {new Date(link.expiresAt).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center space-x-2 shrink-0">
                <CopyButton text={link.shortUrl} />

                <button
                  type="button"
                  onClick={() => handleOpenQR(link.shortUrl, link.slug)}
                  className="p-2 rounded-lg bg-[#161F30] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors border border-[#1E293B]"
                  title="Ver QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <Link
                  href={`/estatisticas/${link.slug}`}
                  className="p-2 rounded-lg bg-[#161F30] hover:bg-[#1E293B] text-[#60A5FA] transition-colors border border-[#1E293B]"
                  title="Ver Estatísticas Detalhadas"
                >
                  <BarChart2 className="w-4 h-4" />
                </Link>

                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#161F30] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors border border-[#1E293B]"
                  title="Abrir Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(link.id)}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 transition-colors border border-red-500/20"
                  title="Excluir Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQR && (
        <QRCodeModal
          isOpen={Boolean(selectedQR)}
          onClose={() => setSelectedQR(null)}
          qrCodeUrl={selectedQR.url}
          slug={selectedQR.slug}
        />
      )}
    </div>
  );
}
