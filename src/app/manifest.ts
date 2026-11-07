import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOVA SHORT — Encurtador Inteligente & Downloader",
    short_name: "NovaShort",
    description: "Plataforma de alta performance para encurtamento inteligente de URLs e download seguro de mídias.",
    start_url: "/",
    display: "standalone",
    background_color: "#07080B",
    theme_color: "#07080B",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
