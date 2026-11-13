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
    <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E121B] border border-white/10 text-[11px] text-[#94A3B8] mb-3 tracking-wide">
          <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>ANALYTICS & TELEMETRIA</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Estatísticas de Acesso</h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1.5 leading-relaxed">
          Consulte o relatório consolidado de cliques, dispositivos e distribuição geográfica de qualquer link.
        </p>
      </div>

      <div className="w-full bg-[#111113] border border-zinc-800 rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="slug-search" className="block text-xs font-medium text-zinc-400 mb-2">
              Slug ou Link Encurtado
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="slug-search"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: meu-link ou cole o link curto..."
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 px-5 rounded-md bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Consultar Métricas</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
