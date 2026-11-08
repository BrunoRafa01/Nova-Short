import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade e LGPD | Nova Short",
  description: "Declaração de privacidade, proteção de dados e bases legais de acordo com a Lei 13.709/2018 (LGPD).",
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-emerald-400 hover:underline">
          &larr; Voltar ao início
        </Link>
      </div>

        <article className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
          <header className="border-b border-slate-800 pb-8 mb-8">
            <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-3">
              Conformidade LGPD &bull; Lei nº 13.709/2018
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Política de Privacidade e Proteção de Dados
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Última atualização: Novembro de 2026 &bull; Nova Runtime Tecnologia Ltda
            </p>
          </header>

          <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Controlador dos Dados e Contato do DPO</h2>
              <p>
                O <strong>Nova Short</strong> é uma plataforma operada pela <strong>Nova Runtime Tecnologia Ltda</strong>,
                inscrita no CNPJ sob o nº <strong>48.912.834/0001-90</strong>, com sede na Av. Paulista, 1106, São Paulo/SP.
                Para qualquer dúvida sobre o tratamento de seus dados ou exercício de direitos, entre em contato com nosso
                Encarregado de Proteção de Dados (DPO):{" "}
                <a href="mailto:dpo@novashort.com.br" className="text-emerald-400 underline font-semibold">
                  dpo@novashort.com.br
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Bases Legais para o Tratamento (Art. 7º LGPD)</h2>
              <p>O tratamento de dados no Nova Short fundamenta-se nas seguintes bases legais:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Execução de Contrato e Prestação de Serviços (Art. 7º, V):</strong> Necessário para encurtar
                  URLs, redirecionar visitantes, calcular estatísticas e efetuar downloads autorizados de mídia pública.
                </li>
                <li>
                  <strong>Legítimo Interesse (Art. 7º, IX):</strong> Para auditoria de segurança da informação, detecção
                  e bloqueio de ataques cibernéticos (SSRF, força-bruta, spam de links e ataques DDoS).
                </li>
                <li>
                  <strong>Cumprimento de Obrigação Legal (Art. 7º, II):</strong> Armazenamento de logs de conexão conforme
                  exigido pelo Art. 15 da Lei nº 12.965/2014 (Marco Civil da Internet).
                </li>
                <li>
                  <strong>Consentimento (Art. 7º, I):</strong> Para cookies analíticos opcionais, que podem ser
                  revogados pelo titular a qualquer momento via nosso banner de consentimento (CMP).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Princípio da Minimização de Dados</h2>
              <p>
                Coletamos exclusivamente o mínimo indispensável para a prestação do serviço. Não exigimos cadastro obrigatório
                para encurtar links ou baixar mídias públicas. Não coletamos dados sensíveis (origem racial, convicção religiosa,
                dados de saúde ou biometria). Os endereços IP são anonimizados nos relatórios públicos para preservar a identidade dos visitantes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Direitos dos Titulares de Dados (Art. 18 LGPD)</h2>
              <p>
                Você pode exercer gratuitamente e a qualquer momento todos os direitos previstos no Artigo 18 da LGPD através do
                nosso{" "}
                <Link href="/compliance" className="text-emerald-400 underline font-semibold">
                  Portal de Direitos do Titular (DSR)
                </Link>
                :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Confirmação da existência de tratamento e acesso aos dados;</li>
                <li>Correção de dados incompletos ou inexatos;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Portabilidade dos dados em formato JSON aberto;</li>
                <li>Informação sobre compartilhamento com entidades públicas ou privadas;</li>
                <li>Revogação imediata de consentimentos concedidos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Retenção e Ciclo de Vida dos Dados</h2>
              <p>
                Os links encurtados permanecem ativos enquanto forem acessados. Mídias temporárias baixadas através de filas
                de processamento assíncrono (BullMQ) são expurgadas automaticamente do armazenamento do servidor após 2 horas.
                Logs de acesso são eliminados após o prazo legal de 6 meses do Marco Civil da Internet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Contratos de Operadores e Subprocessadores (DPA)</h2>
              <p>
                Nossos servidores e provedores de infraestrutura seguem rigorosos termos de proteção de dados (DPA):
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>PostgreSQL / Supabase:</strong> Banco de dados relacional com criptografia em repouso AES-256.</li>
                <li><strong>Redis Labs / Upstash:</strong> Gerenciamento de cache e filas com conexões TLS criptografadas.</li>
                <li><strong>Cloudflare / Vercel:</strong> Distribuição de borda segura e mitigação de ataques DDoS.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Transparência sobre Inteligência Artificial e Algoritmos</h2>
              <p>
                O Nova Short utiliza algoritmos estritamente para extração e processamento de formatos de mídia e geração de slugs
                únicos. Não utilizamos os links ou mídias de usuários para treinamento de modelos generativos de IA, nem realizamos
                perfilamento automatizado (profiling) para tomada de decisões jurídicas ou de crédito.
              </p>
            </section>
          </div>
        </article>
    </div>
  );
}
