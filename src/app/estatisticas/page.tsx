"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Search, ArrowRight, TrendingUp } from "lucide-react";

export default function EstatisticasOverviewPage() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = slug.trim().replace(/^\/s\//, "").replace(/^.*\/s\//, "");
    if (clean) {
      router.push(`/estatisticas/${clean}`);
    }
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101622] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Analytics & Telemetria</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Estatísticas de Links</h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto mt-2">
          Insira o código do slug para visualizar o painel completo de métricas, dispositivos e origens de tráfego.
        </p>
      </div>

      <div className="w-full bg-[#101622] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-nova-card nova-glow-border">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="slug-search" className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Código ou URL Encurtada
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-[#3B82F6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="slug-search"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: meu-link ou https://.../s/meu-link"
                className="w-full pl-11 pr-4 py-3 bg-[#080B12] border border-[#1E293B] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-nova-glow"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Consultar Estatísticas</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
