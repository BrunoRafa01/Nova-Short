"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Link2, Download, History, BarChart3, Shield, Sparkles, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "shortener";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [pathname]);

  const baseLinks = [
    { href: "/?tab=shortener", label: "Encurtador", icon: Link2 },
    { href: "/?tab=downloader", label: "Downloader", icon: Download },
    { href: "/historico", label: "Histórico", icon: History },
    { href: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
  ];

  // A aba Admin só existe e só é exibida se o administrador estiver autenticado com sessão válida
  const navLinks = isAdmin
    ? [...baseLinks, { href: "/admin", label: "Gestão Admin", icon: Shield }]
    : baseLinks;

  const isItemActive = (href: string) => {
    if (pathname === "/") {
      if (href === "/?tab=shortener") return currentTab === "shortener";
      if (href === "/?tab=downloader") return currentTab === "downloader";
      return false;
    }
    return href !== "/?tab=shortener" && href !== "/?tab=downloader" && pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#080C15]/85 border-b border-[#1E2C48]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center shadow-nova-glow group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-[#F8FAFC]">
              NOVA<span className="text-[#3B82F6]">SHORT</span>
            </span>
            <span className="text-[10px] tracking-widest text-[#94A3B8] -mt-1 font-mono uppercase">
              Nova Runtime
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#101828] text-[#60A5FA] border border-[#3B82F6]/50 shadow-sm"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101828]/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#101828] text-[#F8FAFC] border border-[#1E2C48] hover:border-[#3B82F6]/50 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1322] border-b border-[#1E2C48] px-4 pt-2 pb-4 space-y-1 animate-fade-in shadow-2xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#101828] text-[#60A5FA] border border-[#3B82F6]/50 shadow-sm"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101828]/50"
                }`}
              >
                <Icon className="w-4 h-4 text-[#3B82F6]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
