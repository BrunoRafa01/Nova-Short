import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Termos de Uso e Condições Gerais | Nova Short",
  description: "Termos de uso, licença de software e direitos do consumidor conforme o Código de Defesa do Consumidor (CDC).",
};

export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-emerald-400 hover:underline">
          &larr; Voltar ao início
        </Link>
      </div>

        <article className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
          <header className="border-b border-slate-800 pb-8 mb-8">
            <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full mb-3">
              Código de Defesa do Consumidor &bull; Lei nº 8.078/1990
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Termos de Uso e Condições Comerciais
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Última atualização: Novembro de 2026 &bull; Nova Runtime Tecnologia Ltda
            </p>
          </header>

          <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Identificação do Fornecedor (Art. 31 CDC)</h2>
              <p>
                O <strong>Nova Short</strong> é desenvolvido e fornecido pela <strong>Nova Runtime Tecnologia Ltda</strong>,
                pessoa jurídica de direito privado inscrita no CNPJ sob o nº <strong>48.912.834/0001-90</strong>, com sede
                na Av. Paulista, 1106, São Paulo/SP, CEP 01310-100.
                Atendimento ao usuário: <a href="mailto:contato@novashort.com.br" className="text-emerald-400 underline font-semibold">contato@novashort.com.br</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Licença de Uso do Software (EULA)</h2>
              <p>
                Concedemos uma licença pessoal, revogável, não exclusiva e intransferível para utilização da ferramenta
                online de encurtamento inteligente e download de mídia para uso legal e pessoal. É estritamente proibido
                utilizar o serviço para disseminação de malwares, phishing, conteúdos com violação de direitos autorais não autorizados,
                ou burlar mecanismos de controle e rate limiting.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Transparência de Preço e Planos (Sem Taxas Ocultas)</h2>
              <p>
                O Nova Short opera sob modelo freemium transparente. Os recursos essenciais (encurtamento, QR Code e downloads padrão)
                são 100% gratuitos. Os planos Premium e Pro para equipes com limites estendidos têm seus preços exibidos de forma clara
                na página de{" "}
                <Link href="/transparencia" className="text-emerald-400 underline font-semibold">
                  Transparência de Preço
                </Link>
                , sem cobranças de taxas surpresa, juros ocultos ou custos adicionais na fatura.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Cancelamento de Assinaturas em 1 Clique</h2>
              <p>
                Repudiamos qualquer prática de dark patterns ou retenção forçada. Assinaturas Pro podem ser canceladas a qualquer
                momento através de um único clique nas configurações da conta, interrompendo imediatamente futuras renovações
                automáticas sem burocracia ou exigência de contato telefônico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Política de Reembolso Integral (Art. 49 CDC)</h2>
              <p>
                Em estrito cumprimento ao Artigo 49 do Código de Defesa do Consumidor, qualquer usuário que contratar um plano pago
                tem o <strong>direito de arrependimento pelo prazo de 7 (sete) dias corridos</strong> a partir da data de contratação.
                O reembolso de 100% do valor pago é processado automaticamente de forma integral sem taxas administrativas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Publicidade Transparente e Depoimentos Autênticos</h2>
              <p>
                Não exibimos anúncios invasivos, banners enganosos com falsos botões de download ou redirecionamentos maliciosos.
                Todos os depoimentos e casos de uso exibidos no site representam métricas reais de performance e feedbacks verificados de desenvolvedores e criadores.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Segurança Cibernética e SLA de Disponibilidade</h2>
              <p>
                A plataforma adota proteção avançada anti-SSRF com validação de faixas de IP privadas, criptografia TLS ponta a ponta
                e infraestrutura de alta tolerância a falhas com SLA de 99.9%.
              </p>
            </section>
          </div>
        </article>
    </div>
  );
}
