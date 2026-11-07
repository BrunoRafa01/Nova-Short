"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Link2, MousePointerClick, Download, LogOut, CheckCircle2, Clock } from "lucide-react";

interface AdminSummary {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  totalDownloads: number;
}

interface DownloadJobItem {
  id: string;
  title: string;
  platform: string;
  status: string;
  format: string;
  quality: string;
  progress: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [recentDownloads, setRecentDownloads] = useState<DownloadJobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (res.ok && data.summary) {
          setSummary(data.summary);
          setRecentDownloads(data.recentDownloads || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E121B] border border-white/10 text-[11px] text-[#94A3B8] mb-2 tracking-wide">
            <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>PAINEL ADMINISTRATIVO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Gestão & Monitoramento
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Status geral do cluster, métricas agregadas e filas de conversão.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>

      {/* Cards de Métricas Globais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
              Links Cadastrados
            </span>
            <Link2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC] font-mono">
            {summary?.totalLinks || 0}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            {summary?.activeLinks || 0} ativos
          </span>
        </div>

        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
              Cliques Registrados
            </span>
            <MousePointerClick className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC] font-mono">
            {summary?.totalClicks || 0}
          </p>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
            Telemetria agregada
          </span>
        </div>

        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
              Downloads de Mídia
            </span>
            <Download className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC] font-mono">
            {summary?.totalDownloads || 0}
          </p>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
            Processamentos
          </span>
        </div>

        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
              Blindagem SSRF
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-base font-semibold text-emerald-400 mt-1">Ativa & Auditada</p>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
            RFC1918 & Cloud Metadata
          </span>
        </div>
      </div>

      {/* Tabela de Trabalhos Recentes de Download */}
      <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-4 flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Fila de Downloads Recentes</span>
        </h3>

        {recentDownloads.length === 0 ? (
          <p className="text-xs text-[#64748B] py-6 text-center">
            Nenhuma mídia processada recentemente no histórico.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#64748B] border-b border-white/5 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5">Título / Mídia</th>
                  <th className="py-2.5">Plataforma</th>
                  <th className="py-2.5">Formato</th>
                  <th className="py-2.5">Qualidade</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#F8FAFC]">
                {recentDownloads.map((job) => (
                  <tr key={job.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-medium truncate max-w-[200px]" title={job.title}>
                      {job.title}
                    </td>
                    <td className="py-3 uppercase font-mono text-[10px] text-[#94A3B8]">
                      {job.platform}
                    </td>
                    <td className="py-3 uppercase font-mono text-[10px]">{job.format}</td>
                    <td className="py-3 font-mono text-[10px]">{job.quality}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          job.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : job.status === "failed"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-[#1E2536] text-[#CBD5E1] border border-white/10"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#64748B] font-mono text-[10px]">
                      {new Date(job.createdAt).toLocaleTimeString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
