"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Link2, Download, History, BarChart3, Shield, Menu, X, ArrowUpRight } from "lucide-react";
import { PWAInstallModal } from "./PWAInstallModal";

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

  const navLinks = isAdmin
    ? [...baseLinks, { href: "/admin", label: "Admin", icon: Shield }]
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
    <header className="sticky top-0 z-50 w-full bg-[#0E1F19]/90 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:bg-white/15 transition-colors">
            <span className="text-xs font-bold tracking-tight font-mono">N</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            Nova Short
          </span>
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
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-emerald-100/70 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action: PWA Install & Mobile Menu */}
        <div className="flex items-center space-x-2.5">
          <PWAInstallModal />

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0E121B] text-[#F8FAFC] border border-white/10 hover:border-white/20 transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#09090B] px-4 py-4 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-zinc-50 border border-zinc-800"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B]" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
