"use client";

import React, { useState } from "react";
import { MessageSquare, ExternalLink, X, Copy, Check, RotateCcw } from "lucide-react";
import { generateWhatsAppUrl } from "../utils/whatsapp";

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  dateStr: string;
  reportText: string;
  targetPhone: string;
  onUpdatePhone: (phone: string) => void;
  onClose: () => void;
  onResetForm: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  isOpen,
  dateStr,
  reportText,
  targetPhone,
  onUpdatePhone,
  onClose,
  onResetForm,
}) => {
  const [copied, setCopied] = useState(false);
  const [phoneInput, setPhoneInput] = useState(targetPhone);
  const [hasSent, setHasSent] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToWhatsApp = () => {
    const finalPhone = phoneInput.trim();
    if (finalPhone !== targetPhone) {
      onUpdatePhone(finalPhone);
    }
    const url = generateWhatsAppUrl(finalPhone, reportText);
    window.open(url, "_blank", "noopener,noreferrer");
    setHasSent(true);
  };

  const handleResetAndClose = () => {
    onResetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Siapkan Laporan WhatsApp</h3>
              <p className="text-xs text-emerald-100">
                Laporan siap dikirimkan melalui WhatsApp Click to Chat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Target Phone Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Nomor WhatsApp Tujuan:
            </label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Contoh: 08123456789 atau 628123456789"
              className="w-full px-3.5 py-2 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Report Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Pratinjau Format Pesan:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Teks
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-60 border border-slate-800">
              {reportText}
            </div>
          </div>

          {/* Post-send prompt */}
          {hasSent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
              <div className="text-xs text-emerald-800">
                <p className="font-bold">Laporan sudah dibuka di WhatsApp!</p>
                <p className="text-emerald-600">
                  Ingin mengosongkan formulir untuk pencatatan berikutnya?
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Kosongkan Form
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleSendToWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka WhatsApp & Kirim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
