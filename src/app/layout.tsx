import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const viewport: Viewport = {
  themeColor: "#07080B",
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
      <body className="min-h-screen flex flex-col bg-[#09090B] text-zinc-50 antialiased selection:bg-zinc-800 selection:text-zinc-50">
        <Suspense fallback={<div className="h-14 w-full bg-[#09090B] border-b border-zinc-800" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
