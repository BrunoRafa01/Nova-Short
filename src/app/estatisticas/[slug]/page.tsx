"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MousePointerClick, Calendar, ShieldCheck, AlertCircle } from "lucide-react";
import { StatsCharts } from "@/components/StatsCharts";
import { CopyButton } from "@/components/CopyButton";

interface StatsData {
  link: {
    id: string;
    slug: string;
    shortUrl: string;
    originalUrl: string;
    title?: string;
    clicksCount: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
  };
  stats: {
    totalClicks: number;
    timeline: { date: string; clicks: number }[];
    devices: { name: string; count: number }[];
    browsers: { name: string; count: number }[];
    referers: { name: string; count: number }[];
  };
}

export default function LinkStatsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`/api/stats/${resolvedParams.slug}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Falha ao carregar métricas.");
        }
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#F8FAFC]">Link Não Encontrado</h2>
        <p className="text-xs text-[#94A3B8] mt-2 mb-6">{error || "Não há dados para este slug."}</p>
        <Link
          href="/historico"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#152238] text-sm text-[#F8FAFC] border border-[#1E2C48]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Histórico</span>
        </Link>
      </div>
    );
  }

  const { link, stats } = data;

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/historico"
          className="inline-flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Histórico</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
              Métricas Detalhadas
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-2 font-mono">
              /s/{link.slug}
            </h1>
            <p className="text-xs text-[#94A3B8] truncate max-w-lg mt-1" title={link.originalUrl}>
              Destino: {link.originalUrl}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <CopyButton text={link.shortUrl} label="Copiar Link" />
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#101828] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E2C48] transition-colors"
              title="Testar Redirecionamento"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center space-x-2 text-[#3B82F6] mb-2">
            <MousePointerClick className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Total de Cliques
            </span>
          </div>
          <p className="text-3xl font-extrabold text-[#F8FAFC] font-mono">{stats.totalClicks}</p>
        </div>

        <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Status do Link
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-400">
            {link.isActive ? "Ativo & Saudável" : "Desativado"}
          </p>
        </div>

        <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center space-x-2 text-[#60A5FA] mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Data de Criação
            </span>
          </div>
          <p className="text-sm font-medium text-[#F8FAFC] font-mono">
            {new Date(link.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Gráficos Interativos */}
      <StatsCharts
        timeline={stats.timeline}
        devices={stats.devices}
        browsers={stats.browsers}
        referers={stats.referers}
      />
    </div>
  );
}
