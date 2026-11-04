"use client";

import { X, Download } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  slug: string;
}

export function QRCodeModal({ isOpen, onClose, qrCodeUrl, slug }: QRCodeModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qrcode-${slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101622] border border-[#1E293B] rounded-2xl max-w-sm w-full p-6 text-center shadow-nova-glow relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">QR Code do Link</h3>
        <p className="text-xs text-[#94A3B8] mb-6 font-mono">/s/{slug}</p>

        <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCodeUrl} alt={`QR Code para ${slug}`} className="w-48 h-48 mx-auto" />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Imagem</span>
          </button>
          <button
            onClick={onClose}
            className="bg-[#161F30] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white py-2 px-4 rounded-xl text-sm transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
