"use client";

import React from "react";
import { Calculator, CheckCircle2, PackageCheck, Store, Coins } from "lucide-react";
import { ProductSummary, StallSummary } from "../types/distribution";
import { formatRupiah } from "../utils/currency";

interface SummarySectionProps {
  stallSummaries: StallSummary[];
  productSummaries: ProductSummary[];
  grandTotal: number;
  grandTotalRupiah: number;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  stallSummaries,
  productSummaries,
  grandTotal,
  grandTotalRupiah,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold tracking-wide">
            Rekapitulasi Distribusi Jualan
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Otomatis Diperbarui</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stall Breakdown (Table format like requirement) */}
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-slate-400" />
            Rekap per Lapak
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Lapak</th>
                  <th className="py-2.5 px-4 text-center">Variasi</th>
                  <th className="py-2.5 px-4 text-right">Total Pcs & Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stallSummaries.map((s, idx) => (
                  <tr key={s.stallId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {s.stallName.trim() || `Lapak ${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-4 text-center text-xs text-slate-500">
                      {s.itemCount} jenis
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="font-extrabold text-slate-900">
                        {s.total}{" "}
                        <span className="text-xs font-medium text-slate-500">
                          pcs
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-700">
                        {formatRupiah(s.totalRupiah)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product Distribution Breakdown */}
          {productSummaries.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                <PackageCheck className="w-3.5 h-3.5" />
                Total Distribusi per Produk
              </h4>
              <div className="flex flex-wrap gap-2">
                {productSummaries.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span>{p.productName}</span>
                    <strong className="text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {p.total}
                    </strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grand Total Card */}
        <div className="md:col-span-5 flex flex-col justify-between p-6 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div>
            <span className="inline-block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Grand Total
            </span>
            <h3 className="text-sm font-semibold text-slate-600">
              Total Keseluruhan Jualan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Penjumlahan total seluruh jualan dan nilai omzet dari semua lapak
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-200/60 space-y-3">
            {/* Total Pcs */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Total Jualan:
              </span>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                  {grandTotal}
                </span>
                <span className="text-sm font-bold text-slate-500 ml-1.5">
                  pcs
                </span>
              </div>
            </div>

            {/* Total Rupiah */}
            <div className="flex items-baseline justify-between pt-2 border-t border-emerald-200/40">
              <span className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                Total Nilai:
              </span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                  {formatRupiah(grandTotalRupiah)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
