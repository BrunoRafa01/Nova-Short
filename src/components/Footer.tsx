import Link from "next/link";
import { ShieldCheck, Cpu, Smartphone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#07080B] border-t border-white/5 mt-24 py-12 text-[#94A3B8] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <span className="font-semibold text-sm tracking-wider text-[#F8FAFC]">
              NOVA <span className="text-[#94A3B8] font-normal">SHORT</span>
            </span>
            <p className="text-xs leading-relaxed max-w-md text-[#64748B]">
              Plataforma de engenharia de software para encurtamento inteligente de URLs com
              telemetria granular e conversão de mídias de fontes autorizadas.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#94A3B8] pt-1">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Blindagem SSRF Ativa</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Alta Concorrência (1k+ req/s)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>PWA Standalone</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Módulos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/encurtador" className="hover:text-[#F8FAFC] transition-colors">
                  Encurtador de Links
                </Link>
              </li>
              <li>
                <Link href="/downloader" className="hover:text-[#F8FAFC] transition-colors">
                  Downloader de Mídia
                </Link>
              </li>
              <li>
                <Link href="/historico" className="hover:text-[#F8FAFC] transition-colors">
                  Histórico de Atividades
                </Link>
              </li>
              <li>
                <Link href="/estatisticas" className="hover:text-[#F8FAFC] transition-colors">
                  Painel de Métricas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/termos" className="hover:text-emerald-400 transition-colors">
                  Termos de Uso & CDC
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-emerald-400 transition-colors">
                  Privacidade & LGPD
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-emerald-400 transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="hover:text-emerald-400 transition-colors">
                  Transparência de Preços
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Conformidade & DSR</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] rounded font-mono">40/40</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B]">
          <p>© {new Date().getFullYear()} NOVA RUNTIME TECNOLOGIA LTDA &bull; CNPJ 48.912.834/0001-90</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0 font-mono text-[10px]">
            <span>Av. Paulista, 1106 &bull; São Paulo/SP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
