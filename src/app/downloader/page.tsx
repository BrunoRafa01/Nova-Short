import Link from "next/link";
import { DownloaderForm } from "@/components/DownloaderForm";
import { Download, Link2 } from "lucide-react";

export default function DownloaderPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101828] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-3">
          <Download className="w-3.5 h-3.5" />
          <span>Downloader de Mídia</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Downloader Seguro</h1>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto mt-2">
          Insira links do YouTube, TikTok ou Instagram, visualize a prévia e selecione qualidade de vídeo MP4 ou áudio MP3 de alta fidelidade.
        </p>

        {/* Tab Switcher Link */}
        <div className="flex items-center justify-center mt-6">
          <div className="p-1 rounded-2xl bg-[#101828] border border-[#1E2C48] shadow-inner flex space-x-1">
            <Link
              href="/encurtador"
              className="flex items-center space-x-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#152238] transition-all"
            >
              <Link2 className="w-4 h-4" />
              <span>Encurtador de Links</span>
            </Link>

            <span className="flex items-center space-x-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#3B82F6] text-white shadow-nova-glow">
              <Download className="w-4 h-4" />
              <span>Downloader de Mídia</span>
            </span>
          </div>
        </div>
      </div>

      <DownloaderForm />
    </div>
  );
}
