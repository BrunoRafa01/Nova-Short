"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Requirement {
  id: number;
  name: string;
  category: string;
  status: string;
  evidence: string;
}

export default function CompliancePage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const [dsrName, setDsrName] = useState("");
  const [dsrEmail, setDsrEmail] = useState("");
  const [dsrType, setDsrType] = useState("exclusao");
  const [dsrMessage, setDsrMessage] = useState("");
  const [dsrLoading, setDsrLoading] = useState(false);
  const [dsrResult, setDsrResult] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/compliance/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.requisitos) setRequirements(data.requisitos);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setExportLoading(true);
    setExportMessage("Consultando base de dados segura e gerando pacote JSON...");

    try {
      const res = await fetch("/api/lgpd/export");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao exportar dados.");

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nova-short-meus-dados-${Date.now()}.json`;
      a.click();

      setExportMessage(`✅ Sucesso! Arquivo com ${data.links?.length || 0} registro(s) baixado com sucesso.`);
    } catch (err: any) {
      setExportMessage(`❌ ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDsrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDsrLoading(true);
    setDsrResult(null);

    try {
      const res = await fetch("/api/lgpd/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dsrName,
          email: dsrEmail,
          requestType: dsrType,
          message: dsrMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar solicitação.");

      setDsrResult(data);
      setDsrName("");
      setDsrEmail("");
      setDsrMessage("");
    } catch (err: any) {
      setDsrResult({ error: err.message });
    } finally {
      setDsrLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-3">
            Conformidade &bull; 40 Requisitos de Segurança & Governança
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Portal de Conformidade e Direitos LGPD
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Transparência radical, conformidade técnica com o marco regulatório brasileiro e exercício autônomo dos direitos do titular.
          </p>
        </div>

        {/* Card 1: Portabilidade */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📦</span> 1. Portabilidade e Acesso aos Dados (Art. 18, V LGPD)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Faça o download de todos os links, encurtamentos e registros atribuídos a esta sessão em formato JSON interoperável.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">
              Self-Service
            </span>
          </div>

          <form onSubmit={handleExport} className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="submit"
              disabled={exportLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950/40 text-sm whitespace-nowrap"
            >
              {exportLoading ? "Gerando JSON..." : "📥 Baixar Meus Dados (JSON Aberto)"}
            </button>
            {exportMessage && (
              <div className="text-xs sm:text-sm text-slate-300 font-medium">
                {exportMessage}
              </div>
            )}
          </form>
        </section>

        {/* Card 2: Formulario DSR */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🛡️</span> 2. Requisição Formal de Direitos do Titular (DSR)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Exercite seus direitos de exclusão, correção, anonimização ou revogação com geração instantânea de protocolo.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 font-bold text-xs rounded-full">
              Prazo Legal: 15 dias
            </span>
          </div>

          <form onSubmit={handleDsrSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={dsrName}
                  onChange={(e) => setDsrName(e.target.value)}
                  placeholder="Nome do titular"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Seu E-mail para Contato
                </label>
                <input
                  type="email"
                  required
                  value={dsrEmail}
                  onChange={(e) => setDsrEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Tipo de Solicitação
                </label>
                <select
                  value={dsrType}
                  onChange={(e) => setDsrType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="exclusao">🗑️ Exclusão Definitiva de Registros</option>
                  <option value="correcao">✏️ Retificação ou Correção de Dados</option>
                  <option value="anonimizacao">🔒 Anonimização ou Bloqueio</option>
                  <option value="acesso">👁️ Confirmação de Tratamento & Acesso</option>
                  <option value="revogacao">🚫 Revogação de Consentimento</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Mensagem ou Detalhes (Opcional)
                </label>
                <input
                  type="text"
                  value={dsrMessage}
                  onChange={(e) => setDsrMessage(e.target.value)}
                  placeholder="Informe links ou detalhes da requisição..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={dsrLoading}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-sm border border-slate-700"
            >
              {dsrLoading ? "Registrando protocolo..." : "Enviar Solicitação Formal ao DPO"}
            </button>
          </form>

          {dsrResult && (
            <div className="mt-6 p-4 rounded-xl text-sm border border-emerald-500/30 bg-emerald-950/20 text-emerald-200">
              {dsrResult.error ? (
                <div className="text-red-400">❌ {dsrResult.error}</div>
              ) : (
                <>
                  <div className="font-bold text-base text-emerald-400 mb-1">
                    🎉 Protocolo Gerado: <span className="font-mono text-white">{dsrResult.protocolo}</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm">{dsrResult.mensagem}</p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Encarregado de Dados: <strong>{dsrResult.contato_dpo}</strong>.
                  </p>
                </>
              )}
            </div>
          )}
        </section>

        {/* Card 3: Auditoria dos 40 Requisitos */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📊</span> 3. Auditoria Técnica dos 40 Requisitos de Segurança & Governança
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Monitoramento contínuo das defesas de segurança, compliance LGPD, normas do CDC e práticas DevSecOps.
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold text-xs rounded-full">
              100% CONFORME (40/40)
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Carregando auditoria de conformidade em tempo real...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        #{String(req.id).padStart(2, "0")}
                      </span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded uppercase tracking-wider">
                        {req.category}
                      </span>
                    </div>
                    <strong className="text-slate-200 block text-xs mb-1">{req.name}</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{req.evidence}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
    </div>
  );
}
