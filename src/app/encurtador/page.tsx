import Link from "next/link";
import { ShortenerForm } from "@/components/ShortenerForm";
import { Link2, Download } from "lucide-react";

export default function EncurtadorPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101828] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-3">
          <Link2 className="w-3.5 h-3.5" />
          <span>Encurtador Inteligente</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Encurtador de Links</h1>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto mt-2">
          Crie links curtos, proteja com senha, defina prazos de validade e gere QR Codes para compartilhamento imediato.
        </p>

        {/* Tab Switcher Link */}
        <div className="flex items-center justify-center mt-6">
          <div className="p-1 rounded-2xl bg-[#101828] border border-[#1E2C48] shadow-inner flex space-x-1">
            <span className="flex items-center space-x-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#3B82F6] text-white shadow-nova-glow">
              <Link2 className="w-4 h-4" />
              <span>Encurtador de Links</span>
            </span>

            <Link
              href="/downloader"
              className="flex items-center space-x-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#152238] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Downloader de Mídia</span>
            </Link>
          </div>
        </div>
      </div>

      <ShortenerForm />
    </div>
  );
}
