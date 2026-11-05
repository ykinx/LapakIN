"use client";

import React from "react";
import { Calendar, Phone, Settings2, Store } from "lucide-react";
import { formatDateIndonesian } from "../utils/date";

interface HeaderProps {
  date: string;
  onDateChange: (newDate: string) => void;
  targetPhone: string;
  onOpenSettings: () => void;
  onOpenPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  date,
  onDateChange,
  targetPhone,
  onOpenSettings,
  onOpenPresets,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Pencatatan Distribusi Jualan
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Pencatatan penitipan jualan harian & kirim rekap ke WhatsApp
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Date Input with Indonesian Format Display */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 transition-colors">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                suppressHydrationWarning
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                title="Pilih tanggal distribusi"
              />
              <span
                suppressHydrationWarning
                className="hidden lg:inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
              >
                {formatDateIndonesian(date)}
              </span>
            </div>

            {/* Target Phone Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all"
              title="Atur nomor WhatsApp tujuan"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{targetPhone ? `WA: ${targetPhone}` : "Atur No. WA"}</span>
            </button>

            {/* Presets Button */}
            <button
              type="button"
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all"
              title="Kelola master lapak & jualan"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Master Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
