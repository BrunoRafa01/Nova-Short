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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0B0E14] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-0.5">QR Code Digital</h3>
        <p className="text-xs text-[#94A3B8] mb-5 font-mono">/s/{slug}</p>

        <div className="bg-white p-3.5 rounded-xl inline-block shadow-md mx-auto mb-6 border-2 border-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolvedUrl} alt={`QR Code para ${slug}`} className="w-44 h-44 mx-auto object-contain" />
        </div>

        <div className="flex space-x-2.5">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#1E2536] hover:bg-[#253046] border border-white/10 text-white py-2.5 px-4 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Imagem</span>
          </button>
          <button
            onClick={onClose}
            className="bg-[#07080B] hover:bg-white/5 text-[#94A3B8] hover:text-white border border-white/5 py-2.5 px-4 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
