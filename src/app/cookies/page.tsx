import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Política de Cookies | Nova Short",
  description: "Conheça os cookies utilizados pelo Nova Short e saiba como gerenciar suas preferências.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-emerald-400 hover:underline">
          &larr; Voltar ao início
        </Link>
      </div>

        <article className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
          <header className="border-b border-slate-800 pb-8 mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Política de Cookies e Rastreamento
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Transparência total e respeito à sua privacidade digital &bull; Novembro de 2026
            </p>
          </header>

          <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. O que são cookies?</h2>
              <p>
                Cookies são pequenos arquivos gravados no seu navegador para armazenar dados técnicos de sessão,
                garantir a segurança contra ataques de sequestro de sessão e memorizar preferências de interface.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Tabela de Cookies Utilizados</h2>
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-white font-semibold border-b border-slate-700">
                    <tr>
                      <th className="p-3">Nome do Cookie</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Finalidade</th>
                      <th className="p-3">Duração</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">nova_admin_token</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">Essencial</span></td>
                      <td className="p-3">Token JWT assinado para autenticação administrativa segura com flag HttpOnly</td>
                      <td className="p-3">24 horas</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">nova_short_consent</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">Essencial</span></td>
                      <td className="p-3">Armazena sua escolha no banner de consentimento (CMP)</td>
                      <td className="p-3">1 ano</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">nova_pwa_dismissed</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">Preferência</span></td>
                      <td className="p-3">Evita exibição repetida do modal de instalação PWA</td>
                      <td className="p-3">30 dias</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Como gerenciar ou revogar</h2>
              <p>
                Você pode gerenciar ou revogar suas preferências de cookies a qualquer momento limpando os dados de navegação
                ou através do nosso botão de consentimento presente no rodapé do site.
              </p>
            </section>
          </div>
        </article>
    </div>
  );
}
