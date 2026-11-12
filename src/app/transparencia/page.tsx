import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Transparência de Preços e Condições Comerciais | Nova Short",
  description: "Conheça nossos planos, preços transparentes, política de cancelamento e reembolso sem taxas ocultas.",
};

export default function TransparenciaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-3">
            Transparência Total &bull; Código de Defesa do Consumidor
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparência de Preços & Condições
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto mt-3">
            Sem taxas ocultas, sem letras miúdas. Aqui você sabe exatamente o que está contratando e como funciona cada recurso.
          </p>
        </div>

        {/* Tabela de Preços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Plano Gratuito */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comunidade & Criadores</div>
              <h2 className="text-2xl font-black text-white">Plano Gratuito</h2>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 0</span>
                <span className="text-slate-500 text-sm"> / para sempre</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">✅ Encurtamento de links ilimitado</li>
                <li className="flex items-center gap-2">✅ Geração instantânea de QR Code HD</li>
                <li className="flex items-center gap-2">✅ Downloader de YouTube, TikTok e Instagram</li>
                <li className="flex items-center gap-2">✅ Estatísticas básicas de cliques</li>
                <li className="flex items-center gap-2">✅ Proteção anti-SSRF e HTTPS completo</li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
              Ideal para uso pessoal, criadores de conteúdo e projetos independentes.
            </div>
          </div>

          {/* Plano Pro / Enterprise */}
          <div className="bg-slate-900/80 border-2 border-emerald-500/50 rounded-2xl p-8 flex flex-col justify-between shadow-2xl shadow-emerald-950/20">
            <div>
              <div className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded mb-2 uppercase tracking-wide">Mais Popular</div>
              <h2 className="text-2xl font-black text-white">Plano Pro / Empresas</h2>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 29</span>
                <span className="text-slate-400 text-sm"> / mês</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2">✨ Tudo do plano gratuito</li>
                <li className="flex items-center gap-2">✨ Domínio personalizado (ex: link.suaempresa.com.br)</li>
                <li className="flex items-center gap-2">✨ API REST com limite estendido (10.000 req/min)</li>
                <li className="flex items-center gap-2">✨ Analytics avançado com geolocalização e referrers</li>
                <li className="flex items-center gap-2">✨ Suporte prioritário com SLA de 4 horas úteis</li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
              Cobrança mensal ou anual com 20% de desconto. Emissão de Nota Fiscal de Serviços automática.
            </div>
          </div>
        </div>

        {/* Compromissos CDC */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-xl mb-2">⚡</div>
            <strong className="text-white block mb-1">Cancelamento em 1 Clique</strong>
            <p className="text-slate-400 text-xs leading-relaxed">
              Cancele diretamente pelo painel a qualquer momento. Não cobramos multa de rescisão nem exigimos permanência mínima.
            </p>
          </div>
          <div>
            <div className="text-xl mb-2">🛡️</div>
            <strong className="text-white block mb-1">Reembolso em 7 Dias (CDC Art. 49)</strong>
            <p className="text-slate-400 text-xs leading-relaxed">
              Garantia incondicional de devolução de 100% do seu dinheiro nos primeiros 7 dias da assinatura caso não se adapte.
            </p>
          </div>
          <div>
            <div className="text-xl mb-2">🏢</div>
            <strong className="text-white block mb-1">Fornecedor Identificado</strong>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nova Runtime Tecnologia Ltda &bull; CNPJ: 48.912.834/0001-90 &bull; Av. Modelo, 100, Cidade Fictícia/SP.
            </p>
          </div>
        </div>
    </div>
  );
}
