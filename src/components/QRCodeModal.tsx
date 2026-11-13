"use client";

import { X, Download } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl?: string;
  qrCodeDataUrl?: string;
  slug: string;
}

export function QRCodeModal({ isOpen, onClose, qrCodeUrl, qrCodeDataUrl, slug }: QRCodeModalProps) {
  if (!isOpen) return null;

  const resolvedUrl = qrCodeUrl || qrCodeDataUrl || "";

  const handleDownload = () => {
    if (!resolvedUrl) return;
    const a = document.createElement("a");
    a.href = resolvedUrl;
    a.download = `qrcode-${slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[#111113] border border-zinc-800 rounded-lg max-w-sm w-full p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-semibold text-zinc-50 mb-0.5">QR Code Digital</h3>
        <p className="text-xs text-zinc-400 mb-5 font-mono">/s/{slug}</p>

        <div className="bg-white p-3.5 rounded-md inline-block mx-auto mb-6 border border-zinc-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolvedUrl} alt={`QR Code para ${slug}`} className="w-44 h-44 mx-auto object-contain" />
        </div>

        <div className="flex space-x-2.5">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 py-2.5 px-4 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Imagem</span>
          </button>
          <button
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-50 border border-zinc-800 py-2.5 px-4 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
