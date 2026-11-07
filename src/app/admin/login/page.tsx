"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha na autenticação.");
      }

      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 w-full">
      <div className="w-full max-w-sm bg-[#0B0E14] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0E121B] border border-white/10 flex items-center justify-center text-[#F8FAFC] mx-auto mb-3 shadow-sm">
            <Shield className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h1 className="text-base font-bold text-[#F8FAFC]">Painel Administrativo</h1>
          <p className="text-xs text-[#64748B] mt-1">Acesso restrito para gestão e métricas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@novaruntime.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#07080B] border border-white/10 rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Senha de Segurança
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#07080B] border border-white/10 rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-6 rounded-xl bg-[#1E2536] hover:bg-[#253046] border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Autenticando...</span>
              </span>
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
