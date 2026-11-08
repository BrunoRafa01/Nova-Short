"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "nova_short_consent";

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        setShow(true);
      }
    } catch {
      setShow(true);
    }
  }, []);

  const saveConsent = async (payload: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, timestamp: new Date().toISOString() }));
      await fetch("/api/lgpd/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-50 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🍪</span>
            <h3 className="font-bold text-white text-base">Privacidade e Gestão de Cookies (LGPD)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Utilizamos cookies essenciais para o funcionamento seguro do encurtador. Você pode aceitar ou personalizar
            o uso de cookies opcionais de análise. Consulte nossa{" "}
            <Link href="/privacidade" className="text-emerald-400 underline">
              Política de Privacidade
            </Link>{" "}
            e{" "}
            <Link href="/cookies" className="text-emerald-400 underline">
              Política de Cookies
            </Link>.
          </p>
        </div>
      </div>

      {showCustom && (
        <div className="mb-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked disabled className="rounded accent-emerald-500" />
            <span><strong>Essenciais:</strong> Necessários para segurança e rotas (sempre ativos).</span>
          </label>
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span><strong>Analíticos:</strong> Coleta anônima de estatísticas de tráfego.</span>
          </label>
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span><strong>Comunicação:</strong> Novidades e atualizações sobre a plataforma.</span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition-colors border border-slate-700"
        >
          {showCustom ? "Fechar Opções" : "⚙️ Personalizar"}
        </button>
        <button
          type="button"
          onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors"
        >
          Apenas Necessários
        </button>
        <button
          type="button"
          onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-emerald-950/40"
        >
          Aceitar Todos
        </button>
      </div>
    </div>
  );
}
