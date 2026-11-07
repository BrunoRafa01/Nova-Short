"use client";

import { useState, useEffect } from "react";
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Detectar se já está rodando como PWA instalado (standalone)
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detectar se é dispositivo iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Capturar evento de instalação nativo no Android / Chromium
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Ouvir quando o app for instalado
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setIsOpen(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // Abre o modal informativo com instruções
      setIsOpen(true);
    }
  };

  // Se já estiver em modo app instalado, não precisa exibir botão de instalação
  if (isStandalone || installed) {
    return null;
  }

  return (
    <>
      {/* Botão de Instalação Discreto no Topo / Navegação */}
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Instalar aplicativo no celular"
        className="cursor-pointer inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0E121B] hover:bg-[#141A28] border border-white/5 hover:border-white/10 transition-all duration-200"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span className="hidden sm:inline">Instalar no Celular</span>
        <span className="sm:hidden">App</span>
      </button>

      {/* Modal de Instalação PWA */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#0B0E14] border border-white/10 p-6 text-left shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabeçalho */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center text-[#3B82F6] shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Instalar NOVA SHORT</h3>
                <p className="text-xs text-[#94A3B8]">Acesse direto da sua tela de início</p>
              </div>
            </div>

            {/* Conteúdo com Passo a Passo */}
            <div className="space-y-3.5 my-5 text-xs text-[#94A3B8]">
              {isIOS ? (
                <>
                  <p className="text-[#CBD5E1]">
                    No iPhone/iPad pelo Safari, adicione o ícone em apenas 2 toques:
                  </p>
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#07080B] border border-white/5">
                    <Share className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                    <span>
                      1. Toque no botão <strong>Compartilhar</strong> (ícone quadrado com seta no rodapé do Safari).
                    </span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#07080B] border border-white/5">
                    <PlusSquare className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                    <span>
                      2. Role a lista e selecione <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                    </span>
                  </div>
                </>
              ) : deferredPrompt ? (
                <div className="text-center py-2">
                  <p className="text-[#CBD5E1] mb-4">
                    Instale como um aplicativo leve, sem gastar memória da Play Store e com abertura instantânea.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (deferredPrompt) {
                        await deferredPrompt.prompt();
                        const choice = await deferredPrompt.userChoice;
                        if (choice.outcome === "accepted") {
                          setInstalled(true);
                          setIsOpen(false);
                        }
                      }
                    }}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-xs transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Confirmar Instalação</span>
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[#CBD5E1]">
                    Para fixar o app no seu smartphone Android ou navegador:
                  </p>
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#07080B] border border-white/5">
                    <Download className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                    <span>
                      1. Toque nos <strong>três pontos</strong> do menu do navegador (topo direito).
                    </span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#07080B] border border-white/5">
                    <PlusSquare className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                    <span>
                      2. Selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Rodapé Informativo */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>PWA Standalone • Sem Anúncios</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
