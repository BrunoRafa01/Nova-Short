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
      <div className="w-full max-w-sm bg-[#111113] border border-zinc-800 rounded-lg p-6 sm:p-7">
        <div className="text-center mb-6">
          <div className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 mx-auto mb-3">
            <Shield className="w-4 h-4 text-zinc-200" />
          </div>
          <h1 className="text-base font-semibold text-zinc-50">Painel Administrativo</h1>
          <p className="text-xs text-zinc-500 mt-1">Acesso restrito para gestão e métricas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@novaruntime.com"
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Senha de Segurança
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 px-5 rounded-md bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin" />
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
