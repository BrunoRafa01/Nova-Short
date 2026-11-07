"use client";

import { useState } from "react";
import { Link2, Download, ShieldCheck, BarChart2, QrCode } from "lucide-react";
import { ShortenerForm } from "@/components/ShortenerForm";
import { DownloaderForm } from "@/components/DownloaderForm";

interface HomeClientProps {
  initialTab?: "shortener" | "downloader";
}

export function HomeClient({ initialTab = "shortener" }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<"shortener" | "downloader">(initialTab);

  const handleTabChange = (tab: "shortener" | "downloader", prefillUrl?: string) => {
    setActiveTab(tab);
    const newUrl = prefillUrl
      ? `/?tab=${tab}&url=${encodeURIComponent(prefillUrl)}`
      : `/?tab=${tab}`;
    window.history.pushState(null, "", newUrl);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 max-w-5xl mx-auto w-full">
      {/* Hero Section Minimalista */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E121B] border border-white/10 text-[11px] text-[#94A3B8] mb-6 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>NOVA SHORT • ECOSSISTEMA RUNTIME</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8FAFC] leading-[1.15]">
          Encurtamento & Download{" "}
          <span className="nova-gradient-text">de Alta Precisão</span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
          Plataforma minimalista com telemetria analítica, geração imediata de QR Code e extração segura
          de mídias autorizadas com proteção contra SSRF e alta concorrência.
        </p>

        {/* Tab Switcher Minimalista */}
        <div className="flex items-center justify-center mt-8">
          <div
            className="p-1 rounded-xl bg-[#0B0E14] border border-white/10 flex space-x-1"
            role="tablist"
            aria-label="Seleção de Ferramenta"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "shortener"}
              onClick={() => handleTabChange("shortener")}
              className={`cursor-pointer flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
                activeTab === "shortener"
                  ? "bg-[#1E2536] text-[#F8FAFC] shadow-sm border border-white/10"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Encurtador</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "downloader"}
              onClick={() => handleTabChange("downloader")}
              className={`cursor-pointer flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
                activeTab === "downloader"
                  ? "bg-[#1E2536] text-[#F8FAFC] shadow-sm border border-white/10"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Downloader</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ferramenta Ativa */}
      <div className="w-full mb-16">
        {activeTab === "shortener" ? (
          <ShortenerForm onSwitchToDownloader={(videoUrl) => handleTabChange("downloader", videoUrl)} />
        ) : (
          <DownloaderForm />
        )}
      </div>

      {/* Grid de Diferenciais Clean & Separado */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
        <div className="p-6 rounded-2xl bg-[#0B0E14] border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#141A26] border border-white/10 flex items-center justify-center text-[#94A3B8] mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
            Segurança & Blindagem SSRF
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Filtragem estrita de faixas de IPs privados, metadados de nuvem e esquemas perigosos para proteção total da infraestrutura.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B0E14] border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#141A26] border border-white/10 flex items-center justify-center text-[#94A3B8] mb-4">
            <BarChart2 className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
            Métricas de Acesso
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Estatísticas com anonimização criptográfica de IP (SHA-256), análise de dispositivos e origens de tráfego.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B0E14] border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#141A26] border border-white/10 flex items-center justify-center text-[#94A3B8] mb-4">
            <QrCode className="w-4 h-4 text-slate-300" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-2">
            QR Code & Slugs Únicos
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Geração vetorial de QR Code para leitura rápida no celular e personalização flexível de slugs com controle de expiração.
          </p>
        </div>
      </div>
    </div>
  );
}
