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
        <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101622] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Painel de Controle Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            Administração NOVA RUNTIME
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Monitoramento de tráfego, filas BullMQ e integridade de instâncias.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-500/20 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>

      {/* Cards de Métricas Globais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101622] border border-[#1E293B] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center justify-between text-[#3B82F6] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Total de Links
            </span>
            <Link2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-[#F8FAFC] font-mono">
            {summary?.totalLinks || 0}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            {summary?.activeLinks || 0} ativos no sistema
          </span>
        </div>

        <div className="bg-[#101622] border border-[#1E293B] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center justify-between text-[#60A5FA] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Cliques Registrados
            </span>
            <MousePointerClick className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-[#F8FAFC] font-mono">
            {summary?.totalClicks || 0}
          </p>
          <span className="text-[10px] text-[#94A3B8] font-mono mt-1 block">
            Telemetria agregada
          </span>
        </div>

        <div className="bg-[#101622] border border-[#1E293B] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Downloads Concluídos
            </span>
            <Download className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-[#F8FAFC] font-mono">
            {summary?.totalDownloads || 0}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            Workers ativos
          </span>
        </div>

        <div className="bg-[#101622] border border-[#1E293B] rounded-2xl p-5 shadow-nova-card">
          <div className="flex items-center justify-between text-[#F8FAFC] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Segurança & SSRF
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-emerald-400">100% Protegido</p>
          <span className="text-[10px] text-[#94A3B8] font-mono mt-1 block">
            Filtros RFC1918 & Cloud Meta
          </span>
        </div>
      </div>

      {/* Tabela de Trabalhos Recentes de Download */}
      <div className="bg-[#101622] border border-[#1E293B] rounded-2xl p-6 shadow-nova-card">
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#3B82F6]" />
          <span>Fila Recente de Mídias Processadas</span>
        </h3>

        {recentDownloads.length === 0 ? (
          <p className="text-xs text-[#64748B] py-6 text-center">
            Nenhuma mídia processada recentemente no histórico.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#94A3B8] border-b border-[#1E293B] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5">Título / Mídia</th>
                  <th className="py-2.5">Plataforma</th>
                  <th className="py-2.5">Formato</th>
                  <th className="py-2.5">Qualidade</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60 text-[#F8FAFC]">
                {recentDownloads.map((job) => (
                  <tr key={job.id} className="hover:bg-[#161F30]/40 transition-colors">
                    <td className="py-3 font-medium truncate max-w-[200px]" title={job.title}>
                      {job.title}
                    </td>
                    <td className="py-3 uppercase font-mono text-[10px] text-[#3B82F6]">
                      {job.platform}
                    </td>
                    <td className="py-3 uppercase font-mono text-[10px]">{job.format}</td>
                    <td className="py-3 font-mono text-[10px]">{job.quality}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          job.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : job.status === "failed"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/20"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#94A3B8] font-mono text-[10px]">
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
