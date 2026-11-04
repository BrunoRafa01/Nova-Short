import { ShortenerForm } from "@/components/ShortenerForm";
import { Link2 } from "lucide-react";

export default function EncurtadorPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101622] border border-[#3B82F6]/30 text-xs text-[#60A5FA] mb-3">
          <Link2 className="w-3.5 h-3.5" />
          <span>Encurtador Inteligente</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Encurtador de Links</h1>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto mt-2">
          Crie links curtos, proteja com senha, defina prazos de validade e gere QR Codes para compartilhamento imediato.
        </p>
      </div>

      <ShortenerForm />
    </div>
  );
}
