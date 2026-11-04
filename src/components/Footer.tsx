import Link from "next/link";
import { ShieldCheck, Zap, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#080B12] border-t border-[#1E293B] mt-24 py-12 text-[#94A3B8] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <span className="font-bold text-base tracking-wider text-[#F8FAFC]">
              NOVA<span className="text-[#3B82F6]">SHORT</span>
            </span>
            <p className="mt-2 text-xs leading-relaxed max-w-md text-[#94A3B8]">
              Plataforma de alta performance para encurtamento inteligente de links com telemetria
              avançada e download seguro de mídias de criadores autorizados. Desenvolvido e mantido
              pela <strong>NOVA RUNTIME</strong>.
            </p>
            <div className="flex items-center space-x-4 mt-4 text-xs">
              <span className="flex items-center space-x-1.5 text-[#3B82F6]">
                <Zap className="w-3.5 h-3.5" />
                <span>Next.js 15 & BullMQ</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Proteção SSRF Ativa</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Ferramentas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/encurtador" className="hover:text-[#60A5FA] transition-colors">
                  Encurtador de Links
                </Link>
              </li>
              <li>
                <Link href="/downloader" className="hover:text-[#60A5FA] transition-colors">
                  Downloader de Vídeo & Áudio
                </Link>
              </li>
              <li>
                <Link href="/historico" className="hover:text-[#60A5FA] transition-colors">
                  Histórico de Atividades
                </Link>
              </li>
              <li>
                <Link href="/estatisticas" className="hover:text-[#60A5FA] transition-colors">
                  Painel de Estatísticas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Termos & Compliance
            </h4>
            <p className="text-[11px] leading-normal text-[#64748B]">
              O NOVA SHORT respeita integralmente os direitos autorais e termos de serviço das
              plataformas parceiras. Apenas conteúdos próprios, Creative Commons ou explicitamente
              autorizados pelos detentores de direitos devem ser processados. O sistema não burla
              DRM ou mecanismos de controle de acesso.
            </p>
          </div>
        </div>

        <div className="border-t border-[#1E293B] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} NOVA RUNTIME. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Fedora Linux Ready</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
