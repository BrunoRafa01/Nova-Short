import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "NOVA SHORT — Encurtador de Links & Downloader | NOVA RUNTIME",
  description:
    "SaaS profissional da NOVA RUNTIME para encurtamento inteligente de URLs com telemetria avançada e download de mídia seguro de YouTube, TikTok e Instagram.",
  keywords: ["encurtador de link", "url shortener", "downloader", "youtube downloader", "tiktok downloader", "instagram downloader", "nova runtime"],
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
      <body className="min-h-screen flex flex-col bg-[#080C15] text-[#F8FAFC] antialiased selection:bg-[#3B82F6] selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
