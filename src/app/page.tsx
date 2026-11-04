"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Link2, Download, Zap, Sparkles, BarChart2, QrCode } from "lucide-react";
import { ShortenerForm } from "@/components/ShortenerForm";
import { DownloaderForm } from "@/components/DownloaderForm";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"shortener" | "downloader">("shortener");

  useEffect(() => {
    if (tabParam === "downloader") {
      setActiveTab("downloader");
    } else if (tabParam === "shortener") {
      setActiveTab("shortener");
    }
  }, [tabParam]);

  const handleTabChange = (tab: "shortener" | "downloader") => {
    setActiveTab(tab);
    const newUrl = tab === "downloader" ? "/?tab=downloader" : "/?tab=shortener";
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      {/* Glow Superior */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3B82F6]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101828] border border-[#3B82F6]/40 text-xs text-[#60A5FA] mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ecossistema NOVA RUNTIME</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
          Velocidade e Precisão para seus{" "}
          <span className="nova-gradient-text">Links e Mídias</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          Encurtamento ultrarrápido com telemetria e QR Code, aliado a um downloader profissional
          para YouTube, TikTok e Instagram com blindagem de segurança completa.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center mt-8">
          <div className="p-1 rounded-2xl bg-[#101828] border border-[#1E2C48] shadow-inner flex space-x-1">
            <button
              type="button"
              onClick={() => handleTabChange("shortener")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "shortener"
                  ? "bg-[#3B82F6] text-white shadow-nova-glow"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Encurtador de Links</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("downloader")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "downloader"
                  ? "bg-[#3B82F6] text-white shadow-nova-glow"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Downloader de Mídia</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ferramenta Ativa */}
      <div className="w-full relative z-10 mb-16">
        {activeTab === "shortener" ? <ShortenerForm /> : <DownloaderForm />}
      </div>

      {/* Grid de Diferenciais */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="p-6 rounded-2xl bg-[#101828] border border-[#1E2C48] shadow-nova-card hover:border-[#3B82F6]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">Redirecionamento Instantâneo</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Resolução de links com latência mínima e processamento concorrente seguro com cache Redis.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#101828] border border-[#1E2C48] shadow-nova-card hover:border-[#3B82F6]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">Telemetria Detalhada</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Acompanhe cliques em tempo real, navegadores, dispositivos e origens de tráfego com gráficos interativos.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#101828] border border-[#1E2C48] shadow-nova-card hover:border-[#3B82F6]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center text-[#60A5FA] mb-4">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">QR Code & Personalização</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Geração instantânea de QR Code para cada link e criação de slugs customizados sob medida.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20 text-xs text-[#94A3B8]">Carregando ferramentas...</div>}>
      <HomeContent />
    </Suspense>
  );
}
