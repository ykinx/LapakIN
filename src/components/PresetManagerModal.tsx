"use client";

import React, { useState } from "react";
import { Store, ShoppingBag, Plus, Trash2, X, Check, Edit2 } from "lucide-react";

interface PresetManagerModalProps {
  isOpen: boolean;
  stalls: string[];
  products: string[];
  onSaveStalls: (stalls: string[]) => void;
  onSaveProducts: (products: string[]) => void;
  onClose: () => void;
}

export const PresetManagerModal: React.FC<PresetManagerModalProps> = ({
  isOpen,
  stalls,
  products,
  onSaveStalls,
  onSaveProducts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"stalls" | "products">("products");
  const [stallList, setStallList] = useState<string[]>(stalls);
  const [productList, setProductList] = useState<string[]>(products);

  const [newStall, setNewStall] = useState("");
  const [newProduct, setNewProduct] = useState("");

  const [editingStallIndex, setEditingStallIndex] = useState<number | null>(null);
  const [editingStallText, setEditingStallText] = useState("");

  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [editingProductText, setEditingProductText] = useState("");

  if (!isOpen) return null;

  // Stalls actions
  const handleAddStall = () => {
    const trimmed = newStall.trim();
    if (trimmed && !stallList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...stallList, trimmed];
      setStallList(updated);
      onSaveStalls(updated);
      setNewStall("");
    }
  };

  const handleDeleteStall = (index: number) => {
    const updated = stallList.filter((_, i) => i !== index);
    setStallList(updated);
    onSaveStalls(updated);
  };

  const handleSaveEditStall = (index: number) => {
    const trimmed = editingStallText.trim();
    if (trimmed) {
      const updated = [...stallList];
      updated[index] = trimmed;
      setStallList(updated);
      onSaveStalls(updated);
    }
    setEditingStallIndex(null);
  };

  // Products actions
  const handleAddProduct = () => {
    const trimmed = newProduct.trim();
    if (trimmed && !productList.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...productList, trimmed];
      setProductList(updated);
      onSaveProducts(updated);
      setNewProduct("");
    }
  };

  const handleDeleteProduct = (index: number) => {
    const updated = productList.filter((_, i) => i !== index);
    setProductList(updated);
    onSaveProducts(updated);
  };

  const handleSaveEditProduct = (index: number) => {
    const trimmed = editingProductText.trim();
    if (trimmed) {
      const updated = [...productList];
      updated[index] = trimmed;
      setProductList(updated);
      onSaveProducts(updated);
    }
    setEditingProductIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Master Data Lapak & Jualan
            </h3>
            <p className="text-xs text-slate-500">
              Kelola daftar pilihan cepat untuk mempermudah penginputan form
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "products"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Jenis Jualan ({productList.length})
          </button>
          <button
            onClick={() => setActiveTab("stalls")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "stalls"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Store className="w-4 h-4" />
            Lapak Tujuan ({stallList.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "products" ? (
            <div className="space-y-4">
              {/* Add Product Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
                  placeholder="Tambah jenis jualan baru (misal: Pastel Ayam)..."
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!newProduct.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>

              {/* Product List */}
              <div className="space-y-2 mt-3">
                {productList.length === 0 ? (
                  <p className="text-sm text-center text-slate-400 py-6">
                    Belum ada jenis jualan tersimpan.
                  </p>
                ) : (
                  productList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    >
                      {editingProductIndex === index ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingProductText}
                            onChange={(e) => setEditingProductText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSaveEditProduct(index)
                            }
                            className="flex-1 px-2.5 py-1 text-sm bg-white border border-emerald-500 rounded-lg outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditProduct(index)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-700">
                          {item}
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        {editingProductIndex !== index && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProductIndex(index);
                              setEditingProductText(item);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add Stall Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStall}
                  onChange={(e) => setNewStall(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddStall()}
                  placeholder="Tambah nama lapak baru (misal: Lapak 4 atau Lapak Pasar)..."
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddStall}
                  disabled={!newStall.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>

              {/* Stall List */}
              <div className="space-y-2 mt-3">
                {stallList.length === 0 ? (
                  <p className="text-sm text-center text-slate-400 py-6">
                    Belum ada lapak tersimpan.
                  </p>
                ) : (
                  stallList.map((stall, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    >
                      {editingStallIndex === index ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingStallText}
                            onChange={(e) => setEditingStallText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSaveEditStall(index)
                            }
                            className="flex-1 px-2.5 py-1 text-sm bg-white border border-emerald-500 rounded-lg outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditStall(index)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-700">
                          {stall}
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        {editingStallIndex !== index && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStallIndex(index);
                              setEditingStallText(stall);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteStall(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
