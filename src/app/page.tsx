"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { StallCard } from "@/components/StallCard";
import { SummarySection } from "@/components/SummarySection";
import { ActionButtons } from "@/components/ActionButtons";
import { ConfirmModal } from "@/components/ConfirmModal";
import { WhatsAppPreviewModal } from "@/components/WhatsAppPreviewModal";
import { SettingsModal } from "@/components/SettingsModal";
import { PresetManagerModal } from "@/components/PresetManagerModal";
import {
  StallDistribution,
  ValidationError,
  StallSummary,
  ProductSummary,
  ItemPrice,
} from "@/types/distribution";
import { getTodayDateString } from "@/utils/date";
import { formatWhatsAppReport } from "@/utils/whatsapp";
import { Sparkles } from "lucide-react";

const INITIAL_PRESET_STALLS = [
  "Lapak Jajan Saepuluh Ribu",
  "Lapak Pestajajan",
  "Lapak Jajan Pagi",
  "Lapak Sarapan Berkah",
  "Lapak Serba Sepuluh Ribu",
];
const INITIAL_PRESET_PRODUCTS = [
  "Macaroni Mac n Cheese",
  "Spagetti Carbonara",
  "Manggo Sticky Rice",
  "Roasted Milk Tea",
];

let idCounter = 1;
const generateUniqueId = (prefix: string) => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

const createEmptyItem = (customId?: string, price: ItemPrice = 10000) => ({
  id: customId || generateUniqueId("item"),
  productName: "",
  quantity: "" as const,
  price,
});

const createEmptyStall = (
  stallName: string = "",
  customId?: string
): StallDistribution => ({
  id: customId || generateUniqueId("stall"),
  stallName,
  items: [createEmptyItem(customId ? `${customId}-item-1` : undefined)],
});

const INITIAL_STALLS: StallDistribution[] = [
  {
    id: "stall-1",
    stallName: "Lapak Jajansepuluh Ribu",
    items: [
      {
        id: "item-1-1",
        productName: "",
        quantity: "",
        price: 10000,
      },
    ],
  },
];

export default function DistributionPage() {
  // Pure React State (in-memory as specified)
  const [date, setDate] = useState<string>(getTodayDateString());
  const [targetPhone, setTargetPhone] = useState<string>("081234567890");

  const [presetStalls, setPresetStalls] = useState<string[]>(INITIAL_PRESET_STALLS);
  const [presetProducts, setPresetProducts] = useState<string[]>(INITIAL_PRESET_PRODUCTS);

  // Stalls distribution state - deterministic initial state prevents hydration mismatch
  const [stalls, setStalls] = useState<StallDistribution[]>(INITIAL_STALLS);

  // Modals state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteStallConfirmOpen, setIsDeleteStallConfirmOpen] = useState(false);
  const [stallToDeleteId, setStallToDeleteId] = useState<string | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // ----------------------------------------------------
  // CALCULATIONS & VALIDATIONS
  // ----------------------------------------------------
  const {
    stallSummaries,
    productSummaries,
    grandTotal,
    grandTotalRupiah,
    validationErrors,
    isValid,
  } = useMemo(() => {
    const errors: ValidationError[] = [];
    const stallSums: StallSummary[] = [];
    const productMap = new Map<string, number>();

    const stallNamesSeen = new Set<string>();

    if (stalls.length === 0) {
      errors.push({
        type: "empty_stall",
        message: "Setidaknya harus ada 1 lapak tujuan distribusi.",
      });
    }

    // Check which stalls have any input at all
    const stallsWithContent = stalls.filter((s) => {
      const hasName = s.stallName.trim() !== "";
      const hasItems = s.items.some(
        (i) => i.productName.trim() !== "" || (typeof i.quantity === "number" && i.quantity > 0)
      );
      return hasName || hasItems;
    });

    // If all stalls are completely empty, evaluate the first stall for gentle prompt
    const stallsToEvaluate = stallsWithContent.length > 0 ? stallsWithContent : stalls;

    stallsToEvaluate.forEach((stall, sIdx) => {
      const trimmedStallName = stall.stallName.trim();
      const stallLabel = trimmedStallName || `Lapak ${sIdx + 1}`;

      // 1. Stall Name Check
      if (!trimmedStallName) {
        errors.push({
          type: "empty_stall",
          stallId: stall.id,
          message: `Nama pada Lapak #${sIdx + 1} belum diisi.`,
        });
      } else {
        const lowerName = trimmedStallName.toLowerCase();
        if (stallNamesSeen.has(lowerName)) {
          errors.push({
            type: "duplicate_stall",
            stallId: stall.id,
            message: `Lapak "${trimmedStallName}" dimasukkan lebih dari sekali. Lapak tidak boleh duplikat.`,
          });
        }
        stallNamesSeen.add(lowerName);
      }

      // 2. Items Check
      // Filter out completely blank rows if there are other filled rows
      const filledItems = stall.items.filter(
        (i) => i.productName.trim() !== "" || (typeof i.quantity === "number" && i.quantity > 0)
      );
      const itemsToValidate = filledItems.length > 0 ? filledItems : stall.items;

      if (itemsToValidate.length === 0) {
        errors.push({
          type: "empty_product",
          stallId: stall.id,
          message: `${stallLabel} belum memiliki jenis jualan.`,
        });
      }

      const productsSeen = new Set<string>();
      let stallSubtotalQty = 0;
      let stallSubtotalRp = 0;
      let validItemCount = 0;

      itemsToValidate.forEach((item, iIdx) => {
        const trimmedProduct = item.productName.trim();

        // Product Name Check
        if (!trimmedProduct) {
          errors.push({
            type: "empty_product",
            stallId: stall.id,
            itemId: item.id,
            message: `Jenis jualan #${iIdx + 1} di ${stallLabel} wajib diisi.`,
          });
        } else {
          const lowerProduct = trimmedProduct.toLowerCase();
          if (productsSeen.has(lowerProduct)) {
            errors.push({
              type: "duplicate_product",
              stallId: stall.id,
              itemId: item.id,
              message: `Jenis jualan "${trimmedProduct}" duplikat di ${stallLabel}.`,
            });
          }
          productsSeen.add(lowerProduct);
        }

        // Quantity Check
        const qty = item.quantity;
        if (
          qty === "" ||
          typeof qty !== "number" ||
          isNaN(qty) ||
          qty <= 0 ||
          !Number.isInteger(qty)
        ) {
          errors.push({
            type: "invalid_qty",
            stallId: stall.id,
            itemId: item.id,
            message: `Jumlah untuk "${trimmedProduct || `Item #${iIdx + 1}`}" di ${stallLabel} harus berupa bilangan bulat positif (> 0).`,
          });
        } else {
          const price = item.price || 10000;
          stallSubtotalQty += qty;
          stallSubtotalRp += qty * price;
          validItemCount++;

          if (trimmedProduct) {
            const currentTotal = productMap.get(trimmedProduct) || 0;
            productMap.set(trimmedProduct, currentTotal + qty);
          }
        }
      });

      stallSums.push({
        stallId: stall.id,
        stallName: stall.stallName,
        total: stallSubtotalQty,
        totalRupiah: stallSubtotalRp,
        itemCount: validItemCount,
      });
    });

    const grand = stallSums.reduce((acc, curr) => acc + curr.total, 0);
    const grandRp = stallSums.reduce((acc, curr) => acc + curr.totalRupiah, 0);

    const prodSums: ProductSummary[] = Array.from(productMap.entries()).map(
      ([productName, total]) => ({ productName, total })
    );

    const valid = errors.length === 0 && grand > 0 && stalls.length > 0;

    return {
      stallSummaries: stallSums,
      productSummaries: prodSums,
      grandTotal: grand,
      grandTotalRupiah: grandRp,
      validationErrors: errors,
      isValid: valid,
    };
  }, [stalls]);

  // ----------------------------------------------------
  // STALL ACTIONS
  // ----------------------------------------------------
  const handleAddStall = () => {
    const nextStallNumber = stalls.length + 1;
    const suggestedName = `Lapak ${nextStallNumber}`;
    setStalls((prev) => [...prev, createEmptyStall(suggestedName)]);
  };

  const handleUpdateStallName = (stallId: string, name: string) => {
    setStalls((prev) =>
      prev.map((s) => (s.id === stallId ? { ...s, stallName: name } : s))
    );
  };

  const handlePromptDeleteStall = (stallId: string) => {
    const target = stalls.find((s) => s.id === stallId);
    if (!target) return;

    // If stall has meaningful data, ask confirm; otherwise delete immediately
    const hasData =
      target.stallName.trim() !== "" ||
      target.items.some(
        (i) => i.productName.trim() !== "" || (typeof i.quantity === "number" && i.quantity > 0)
      );

    if (hasData) {
      setStallToDeleteId(stallId);
      setIsDeleteStallConfirmOpen(true);
    } else {
      executeDeleteStall(stallId);
    }
  };

  const executeDeleteStall = (stallId: string) => {
    setStalls((prev) => prev.filter((s) => s.id !== stallId));
    setIsDeleteStallConfirmOpen(false);
    setStallToDeleteId(null);
  };

  // ----------------------------------------------------
  // ITEM ACTIONS
  // ----------------------------------------------------
  const handleAddItem = (stallId: string) => {
    setStalls((prev) =>
      prev.map((s) =>
        s.id === stallId ? { ...s, items: [...s.items, createEmptyItem()] } : s
      )
    );
  };

  const handleUpdateItem = (
    stallId: string,
    itemId: string,
    field: "productName" | "quantity" | "price",
    value: any
  ) => {
    setStalls((prev) =>
      prev.map((s) => {
        if (s.id !== stallId) return s;
        return {
          ...s,
          items: s.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        };
      })
    );
  };

  const handleDeleteItem = (stallId: string, itemId: string) => {
    setStalls((prev) =>
      prev.map((s) => {
        if (s.id !== stallId) return s;
        return {
          ...s,
          items: s.items.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  // ----------------------------------------------------
  // RESET ACTIONS
  // ----------------------------------------------------
  const handleResetForm = () => {
    setStalls([
      {
        id: generateUniqueId("stall"),
        stallName: presetStalls[0] || "Lapak 1",
        items: [
          {
            id: generateUniqueId("item"),
            productName: "",
            quantity: "",
            price: 10000,
          },
        ],
      },
    ]);
    setIsResetConfirmOpen(false);
  };

  // ----------------------------------------------------
  // LOAD EXAMPLE DATA (For Instant Testing / Demo)
  // ----------------------------------------------------
  const handleLoadExampleData = () => {
    setDate("2026-11-05");
    setStalls([
      {
        id: "stall-1",
        stallName: "Lapak Jajansepuluh Ribu",
        items: [
          { id: "item-1-1", productName: "Macaroni macc n cheese", quantity: 10, price: 10000 },
          { id: "item-1-2", productName: "Spagetti carbonara", quantity: 5, price: 10000 },
          { id: "item-1-3", productName: "roasted milk tea", quantity: 8, price: 9000 },
        ],
      },
      {
        id: "stall-2",
        stallName: "Lapak Pestajajan",
        items: [
          { id: "item-2-1", productName: "Manggo sticky rice", quantity: 15, price: 10000 },
          { id: "item-2-2", productName: "roasted milk tea", quantity: 10, price: 9000 },
        ],
      },
    ]);
  };

  // ----------------------------------------------------
  // WHATSAPP REPORT GENERATION
  // ----------------------------------------------------
  const reportText = useMemo(() => {
    return formatWhatsAppReport(
      date,
      stalls,
      stallSummaries,
      grandTotal,
      grandTotalRupiah
    );
  }, [date, stalls, stallSummaries, grandTotal, grandTotalRupiah]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 pb-16">
      {/* Header */}
      <Header
        date={date}
        onDateChange={setDate}
        targetPhone={targetPhone}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 space-y-6 flex-1">
        {/* Banner with Fast-fill Example Helper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Form Pencatatan Distribusi Harian
            </h2>
            <p className="text-xs text-slate-500">
              Masukkan lapak tujuan, jenis jualan, pilihan harga (10.000 / 9.000), dan jumlah.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadExampleData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
            title="Muat contoh data distribusi cepat"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Isi Contoh Data Demo</span>
          </button>
        </div>

        {/* Stalls Cards List */}
        <div className="space-y-4">
          {stalls.map((stall, index) => {
            const summary = stallSummaries.find((s) => s.stallId === stall.id);
            return (
              <StallCard
                key={stall.id}
                index={index}
                stall={stall}
                allStalls={stalls}
                presetStalls={presetStalls}
                presetProducts={presetProducts}
                subtotal={summary ? summary.total : 0}
                subtotalRupiah={summary ? summary.totalRupiah : 0}
                onUpdateStallName={(name) =>
                  handleUpdateStallName(stall.id, name)
                }
                onAddItem={() => handleAddItem(stall.id)}
                onUpdateItem={(itemId, field, val) =>
                  handleUpdateItem(stall.id, itemId, field, val)
                }
                onDeleteItem={(itemId) =>
                  handleDeleteItem(stall.id, itemId)
                }
                onDeleteStall={() => handlePromptDeleteStall(stall.id)}
              />
            );
          })}
        </div>

        {/* Real-time Summary Section */}
        <SummarySection
          stallSummaries={stallSummaries}
          productSummaries={productSummaries}
          grandTotal={grandTotal}
          grandTotalRupiah={grandTotalRupiah}
        />

        {/* Action Buttons Section */}
        <ActionButtons
          onAddStall={handleAddStall}
          onSendReport={() => setIsWhatsAppModalOpen(true)}
          onResetClick={() => setIsResetConfirmOpen(true)}
          validationErrors={validationErrors}
          isValid={isValid}
        />
      </main>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Kosongkan Seluruh Formulir?"
        message="Semua nama lapak, jenis jualan, dan jumlah yang telah dimasukkan akan dihapus dan kembali ke keadaan awal. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Kosongkan Form"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleResetForm}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Delete Stall Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteStallConfirmOpen}
        title="Hapus Lapak Ini?"
        message="Lapak ini dan seluruh daftar jualan di dalamnya akan dihapus dari laporan distribusi hari ini."
        confirmText="Hapus Lapak"
        cancelText="Batal"
        variant="danger"
        onConfirm={() =>
          stallToDeleteId && executeDeleteStall(stallToDeleteId)
        }
        onCancel={() => {
          setIsDeleteStallConfirmOpen(false);
          setStallToDeleteId(null);
        }}
      />

      {/* WhatsApp Report & Click to Chat Modal */}
      <WhatsAppPreviewModal
        isOpen={isWhatsAppModalOpen}
        dateStr={date}
        reportText={reportText}
        targetPhone={targetPhone}
        onUpdatePhone={setTargetPhone}
        onClose={() => setIsWhatsAppModalOpen(false)}
        onResetForm={handleResetForm}
      />

      {/* Target Phone Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentPhone={targetPhone}
        onSave={setTargetPhone}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Master Data Presets Modal */}
      <PresetManagerModal
        isOpen={isPresetsOpen}
        stalls={presetStalls}
        products={presetProducts}
        onSaveStalls={setPresetStalls}
        onSaveProducts={setPresetProducts}
        onClose={() => setIsPresetsOpen(false)}
      />
    </div>
  );
}
