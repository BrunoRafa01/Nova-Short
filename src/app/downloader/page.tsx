import { DownloaderForm } from "@/components/DownloaderForm";
import { Download } from "lucide-react";

export default function DownloaderPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101622] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-3">
          <Download className="w-3.5 h-3.5" />
          <span>Downloader de Mídia</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Downloader Seguro</h1>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto mt-2">
          Insira links do YouTube, TikTok ou Instagram, visualize a prévia e selecione qualidade de vídeo MP4 ou áudio MP3 de alta fidelidade.
        </p>
      </div>

      <DownloaderForm />
    </div>
  );
}
