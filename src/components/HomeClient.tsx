"use client";

import { useState } from "react";
import { Link2, Download } from "lucide-react";
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
    <div className="flex-1 flex flex-col w-full">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 mb-7 border-b border-[#111815]/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111815]">
            {activeTab === "shortener" ? "Encurtador de URLs" : "Extrator de Mídia"}
          </h1>
          <p className="mt-1 text-sm text-[#465750]">
            {activeTab === "shortener"
              ? "Crie links curtos com slug personalizado, expiração programada e QR Code vetorial."
              : "Analise e extraia faixas de vídeo ou áudio de origens autorizadas com validação SSRF."}
          </p>
        </div>

        {/* Segmented Control */}
        <div
          className="inline-flex p-1 rounded-full bg-[#D9E2DE] border border-[#111815]/10 self-start sm:self-auto"
          role="tablist"
          aria-label="Seleção de Ferramenta"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "shortener"}
            onClick={() => handleTabChange("shortener")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors select-none ${
              activeTab === "shortener"
                ? "bg-[#111815] text-white shadow-sm"
                : "text-[#465750] hover:text-[#111815]"
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
            className={`cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors select-none ${
              activeTab === "downloader"
                ? "bg-[#111815] text-white shadow-sm"
                : "text-[#465750] hover:text-[#111815]"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Downloader</span>
          </button>
        </div>
      </div>

      {/* Ferramenta Ativa */}
      <div className="w-full mb-8">
        {activeTab === "shortener" ? (
          <ShortenerForm onSwitchToDownloader={(videoUrl) => handleTabChange("downloader", videoUrl)} />
        ) : (
          <DownloaderForm />
        )}
      </div>

      {/* Technical Spec Strip */}
      <div className="w-full pt-4 mt-auto border-t border-[#111815]/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5C6D66]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px]">
          <span>SSRF GUARD: ATIVO</span>
          <span className="text-[#111815]/25">/</span>
          <span>TELEMETRIA: SHA-256 ANONIMIZADO</span>
          <span className="text-[#111815]/25">/</span>
          <span>EXPORTAÇÃO: SVG QR & MP4</span>
        </div>
        <span className="text-[11px] text-[#5C6D66]">
          Links e downloads auditados por política de origem
        </span>
      </div>
    </div>
  );
}
