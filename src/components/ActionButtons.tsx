"use client";

import React from "react";
import { Plus, Send, RotateCcw, AlertTriangle } from "lucide-react";
import { ValidationError } from "../types/distribution";

interface ActionButtonsProps {
  onAddStall: () => void;
  onSendReport: () => void;
  onResetClick: () => void;
  validationErrors: ValidationError[];
  isValid: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddStall,
  onSendReport,
  onResetClick,
  validationErrors,
  isValid,
}) => {
  const handleSendClick = () => {
    if (!isValid) {
      if (validationErrors.length > 0) {
        alert(
          `Belum dapat mengirim:\n${validationErrors
            .slice(0, 3)
            .map((e) => "• " + e.message)
            .join("\n")}`
        );
      } else {
        alert(
          "Belum ada data jualan. Silakan masukkan minimal 1 lapak dan 1 jenis jualan dengan jumlah lebih dari 0."
        );
      }
      return;
    }
    onSendReport();
  };

  return (
    <div className="space-y-4">
      {/* Validation Alert Banner if user attempts to see what's blocking */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Periksa Kembali Input Data:
            </h4>
            <ul className="list-disc list-inside text-xs text-amber-800 space-y-0.5">
              {validationErrors.slice(0, 3).map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))}
              {validationErrors.length > 3 && (
                <li>...dan {validationErrors.length - 3} catatan lainnya</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Main Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Add Stall */}
        <button
          type="button"
          onClick={onAddStall}
          className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl shadow-xs transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Tambah Lapak Baru</span>
        </button>

        {/* Right: Reset & Send */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl transition-all"
            title="Kosongkan seluruh data input"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>

          <button
            type="button"
            onClick={handleSendClick}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer ${
              isValid
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : "bg-slate-200 hover:bg-slate-300 text-slate-600 shadow-none border border-slate-300"
            }`}
            title={
              isValid
                ? "Siapkan dan buka laporan ke WhatsApp"
                : "Klik untuk melihat apa yang perlu dilengkapi"
            }
          >
            <Send className="w-4 h-4" />
            <span>Kirim Keseluruhan Jualan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
