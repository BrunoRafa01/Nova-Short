import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "NOVA SHORT — Encurtador Inteligente & Downloader",
  description:
    "Plataforma minimalista e de alta performance da NOVA RUNTIME para encurtamento inteligente de URLs com telemetria e download de mídia com blindagem de segurança completa.",
  keywords: [
    "encurtador de link",
    "url shortener",
    "downloader",
    "youtube downloader",
    "tiktok downloader",
    "instagram downloader",
    "nova runtime",
    "pwa",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NovaShort",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_15%_10%,#1D382E_0%,#0E1F19_52%,#08120E_100%)] text-zinc-50 antialiased selection:bg-[#1F5B48] selection:text-white">
        <Suspense fallback={<div className="h-14 w-full border-b border-white/10" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-6 py-6">
          <div className="flex-1 flex flex-col rounded-[22px] bg-gradient-to-b from-[#E9EEEC] to-[#DFE7E4] text-[#111815] border border-white/50 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-5 sm:p-8">
            {children}
          </div>
        </main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
