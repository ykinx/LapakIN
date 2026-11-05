"use client";

import React from "react";
import { Plus, Trash2, AlertCircle, Store, Minus } from "lucide-react";
import { ItemPrice, SaleItem, StallDistribution } from "../types/distribution";
import { formatRupiah } from "../utils/currency";

interface StallCardProps {
  index: number;
  stall: StallDistribution;
  allStalls: StallDistribution[];
  presetStalls: string[];
  presetProducts: string[];
  subtotal: number;
  subtotalRupiah: number;
  onUpdateStallName: (name: string) => void;
  onAddItem: () => void;
  onUpdateItem: (
    itemId: string,
    field: "productName" | "quantity" | "price",
    value: any
  ) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteStall: () => void;
}

export const StallCard: React.FC<StallCardProps> = ({
  index,
  stall,
  allStalls,
  presetStalls,
  presetProducts,
  subtotal,
  subtotalRupiah,
  onUpdateStallName,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDeleteStall,
}) => {
  // Check if stall name is duplicate
  const isDuplicateStall =
    stall.stallName.trim() !== "" &&
    allStalls.filter(
      (s) =>
        s.id !== stall.id &&
        s.stallName.trim().toLowerCase() === stall.stallName.trim().toLowerCase()
    ).length > 0;

  // Check product name duplicates inside this stall
  const productCounts = stall.items.reduce<Record<string, number>>((acc, item) => {
    const p = item.productName.trim().toLowerCase();
    if (p) acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const handleQtyChange = (itemId: string, rawVal: string) => {
    if (rawVal === "") {
      onUpdateItem(itemId, "quantity", "");
      return;
    }
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      onUpdateItem(itemId, "quantity", Math.max(0, parsed));
    }
  };

  const handleStepQty = (item: SaleItem, delta: number) => {
    const current = typeof item.quantity === "number" ? item.quantity : 0;
    const nextVal = Math.max(1, current + delta);
    onUpdateItem(item.id, "quantity", nextVal);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header Lapak */}
      <div className="bg-gradient-to-r from-slate-50 to-emerald-50/40 px-4 sm:px-6 py-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Lapak Identifier & Name Input */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                {index + 1}
              </span>
              <label
                htmlFor={`stall-name-${stall.id}`}
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Tujuan Penitipan (Lapak)
              </label>
            </div>

            <div className="relative">
              <div className="relative flex items-center">
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id={`stall-name-${stall.id}`}
                  list={`preset-stalls-${stall.id}`}
                  type="text"
                  value={stall.stallName}
                  onChange={(e) => onUpdateStallName(e.target.value)}
                  placeholder={`Nama Lapak (misal: Lapak ${index + 1})...`}
                  className={`w-full pl-10 pr-4 py-2 text-base font-bold rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                    isDuplicateStall
                      ? "border-rose-300 text-rose-900 focus:ring-rose-500 bg-rose-50/30"
                      : !stall.stallName.trim()
                      ? "border-slate-300 text-slate-800 focus:ring-emerald-500"
                      : "border-emerald-300 text-slate-900 focus:ring-emerald-500"
                  }`}
                />
              </div>

              {/* Datalist for preset stalls */}
              <datalist id={`preset-stalls-${stall.id}`}>
                {presetStalls.map((s, i) => (
                  <option key={i} value={s} />
                ))}
              </datalist>

              {isDuplicateStall && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Nama lapak ini sudah ada di laporan. Lapak yang sama tidak
                    boleh dimasukkan 2 kali.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Subtotal & Delete Stall Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <div className="text-right">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Subtotal Lapak
              </span>
              <div className="text-base sm:text-lg font-extrabold text-emerald-700 flex items-baseline justify-end gap-1.5">
                <span>{subtotal} pcs</span>
                <span className="text-xs font-bold text-slate-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {formatRupiah(subtotalRupiah)}
                </span>
              </div>
            </div>

            {allStalls.length > 1 && (
              <button
                type="button"
                onClick={onDeleteStall}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                title="Hapus lapak ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="p-4 sm:p-6 space-y-3">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-5">Jenis Jualan</div>
          <div className="col-span-3 text-center">Harga Jual</div>
          <div className="col-span-3 text-center">Jumlah & Subtotal</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {stall.items.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 mb-2">
              Belum ada jenis jualan yang dititipkan di lapak ini.
            </p>
            <button
              type="button"
              onClick={onAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Jualan
            </button>
          </div>
        ) : (
          stall.items.map((item, itemIdx) => {
            const trimmedName = item.productName.trim().toLowerCase();
            const isDuplicateProduct =
              trimmedName !== "" && (productCounts[trimmedName] || 0) > 1;
            const isInvalidQty =
              item.quantity !== "" &&
              (typeof item.quantity !== "number" || item.quantity <= 0);

            const itemQty = typeof item.quantity === "number" ? item.quantity : 0;
            const itemPrice: ItemPrice = item.price || 10000;
            const itemSubtotal = itemQty * itemPrice;

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-2.5 rounded-xl border transition-all ${
                  isDuplicateProduct || isInvalidQty
                    ? "bg-rose-50/20 border-rose-200"
                    : "bg-slate-50/60 hover:bg-slate-50 border-slate-200"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                  {/* Product Name Input */}
                  <div className="sm:col-span-5">
                    <label className="block sm:hidden text-xs font-semibold text-slate-500 mb-1">
                      Jenis Jualan #{itemIdx + 1}
                    </label>
                    <input
                      list={`preset-products-${stall.id}`}
                      type="text"
                      value={item.productName}
                      onChange={(e) =>
                        onUpdateItem(item.id, "productName", e.target.value)
                      }
                      placeholder="Pilih atau ketik jualan (misal: Risol Mayo)..."
                      className={`w-full px-3 py-2 text-sm font-semibold rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all ${
                        isDuplicateProduct
                          ? "border-rose-300 text-rose-900 focus:ring-rose-500"
                          : !item.productName.trim()
                          ? "border-slate-300 text-slate-800 focus:ring-emerald-500"
                          : "border-slate-300 text-slate-900 focus:ring-emerald-500"
                      }`}
                    />
                    <datalist id={`preset-products-${stall.id}`}>
                      {presetProducts.map((p, i) => (
                        <option key={i} value={p} />
                      ))}
                    </datalist>

                    {isDuplicateProduct && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        Jenis jualan ini sudah ada di lapak ini.
                      </span>
                    )}
                  </div>

                  {/* Price Selector (10.000 vs 9.000) */}
                  <div className="sm:col-span-3">
                    <label className="block sm:hidden text-xs font-semibold text-slate-500 mb-1">
                      Harga Satuan
                    </label>
                    <div className="flex items-center justify-center p-1 bg-white border border-slate-300 rounded-lg shadow-2xs gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.id, "price", 10000)}
                        className={`flex-1 py-1.5 px-2 text-xs font-extrabold rounded-md transition-all ${
                          itemPrice === 10000
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Harga Rp 10.000"
                      >
                        10.000
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.id, "price", 9000)}
                        className={`flex-1 py-1.5 px-2 text-xs font-extrabold rounded-md transition-all ${
                          itemPrice === 9000
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Harga Rp 9.000"
                      >
                        9.000
                      </button>
                    </div>
                  </div>

                  {/* Quantity Stepper & Item Subtotal */}
                  <div className="sm:col-span-3 flex flex-col items-center">
                    <label className="block sm:hidden text-xs font-semibold text-slate-500 mb-1">
                      Jumlah
                    </label>
                    <div className="flex items-center justify-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs w-full">
                      <button
                        type="button"
                        onClick={() => handleStepQty(item, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Kurangi 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQtyChange(item.id, e.target.value)
                        }
                        placeholder="0"
                        className="w-14 sm:w-16 text-center text-sm font-bold text-slate-900 outline-none bg-transparent py-1"
                      />

                      <button
                        type="button"
                        onClick={() => handleStepQty(item, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Tambah 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Calculated Rupiah for this item */}
                    {itemQty > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 mt-1">
                        = {formatRupiah(itemSubtotal)}
                      </span>
                    )}

                    {isInvalidQty && (
                      <span className="block text-center text-[11px] text-rose-600 font-medium mt-1">
                        Harus lebih dari 0
                      </span>
                    )}
                  </div>

                  {/* Delete Item Button */}
                  <div className="sm:col-span-1 flex justify-end sm:justify-center">
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus jualan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Add Item Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jenis Jualan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
