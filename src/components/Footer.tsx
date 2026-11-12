import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#09090B] border-t border-zinc-800 mt-16 py-10 text-zinc-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-2.5">
            <span className="font-semibold text-sm tracking-tight text-zinc-50">
              Nova Short
            </span>
            <p className="text-xs leading-relaxed max-w-md text-zinc-500">
              Plataforma corporativa para encurtamento de URLs com telemetria analítica, geração de QR Code e extração de mídias de origens autorizadas.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Módulos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/encurtador" className="hover:text-zinc-100 transition-colors">
                  Encurtador de Links
                </Link>
              </li>
              <li>
                <Link href="/downloader" className="hover:text-zinc-100 transition-colors">
                  Downloader de Mídia
                </Link>
              </li>
              <li>
                <Link href="/historico" className="hover:text-zinc-100 transition-colors">
                  Histórico de Atividades
                </Link>
              </li>
              <li>
                <Link href="/estatisticas" className="hover:text-zinc-100 transition-colors">
                  Painel de Métricas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/termos" className="hover:text-zinc-100 transition-colors">
                  Termos de Uso & CDC
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-zinc-100 transition-colors">
                  Privacidade & LGPD
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-zinc-100 transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="hover:text-zinc-100 transition-colors">
                  Transparência de Preços
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-zinc-100 transition-colors">
                  Conformidade & DSR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} NOVA RUNTIME TECNOLOGIA LTDA &bull; CNPJ 48.912.834/0001-90</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0 font-mono text-[10px]">
            <span>Av. Modelo, 100 &bull; Cidade Fictícia/SP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
