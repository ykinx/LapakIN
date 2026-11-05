import { StallDistribution, StallSummary } from "../types/distribution";
import { formatDateIndonesian } from "./date";
import { formatRupiah } from "./currency";

/**
 * Normalizes phone number into international WhatsApp format (e.g., 628123456789)
 */
export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("+62")) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Formats WhatsApp distribution report with item quantities, price (9.000 / 10.000),
 * and Rupiah totals:
 *
 * LAPORAN DISTRIBUSI JUALAN
 * Tanggal: 5 November 2026
 *
 * 1. LAPAK 1
 * - Risol Mayo: 10 (@10.000) = Rp 100.000
 * - Donat: 8 (@9.000) = Rp 72.000
 * Total: 18 pcs (Rp 172.000)
 *
 * TOTAL KESELURUHAN: 18 pcs (Rp 172.000)
 */
export function formatWhatsAppReport(
  dateStr: string,
  stalls: StallDistribution[],
  stallSummaries: StallSummary[],
  grandTotal: number,
  grandTotalRupiah: number = 0
): string {
  const formattedDate = formatDateIndonesian(dateStr);
  const lines: string[] = [];

  lines.push("LAPORAN DISTRIBUSI JUALAN");
  lines.push(`Tanggal: ${formattedDate}`);
  lines.push("");

  // Filter only stalls that have valid items with quantity > 0
  const activeStalls = stalls.filter((stall) => {
    const summary = stallSummaries.find((s) => s.stallId === stall.id);
    return summary && summary.total > 0;
  });

  activeStalls.forEach((stall, index) => {
    const stallIndex = index + 1;
    const stallName = stall.stallName.trim() || `LAPAK ${stallIndex}`;
    lines.push(`${stallIndex}. ${stallName.toUpperCase()}`);

    stall.items.forEach((item) => {
      const pName = item.productName.trim() || "Item";
      const qty = typeof item.quantity === "number" ? item.quantity : 0;
      if (qty > 0) {
        const price = item.price || 10000;
        const itemTotal = qty * price;
        const formattedPrice = formatRupiah(price);
        const formattedItemTotal = formatRupiah(itemTotal);
        lines.push(`- ${pName}: ${qty} (@${formattedPrice}) = ${formattedItemTotal}`);
      }
    });

    const summary = stallSummaries.find((s) => s.stallId === stall.id);
    const subtotalQty = summary ? summary.total : 0;
    const subtotalRp = summary ? formatRupiah(summary.totalRupiah) : "Rp 0";
    lines.push(`Total: ${subtotalQty} pcs (${subtotalRp})`);
    lines.push("");
  });

  const formattedGrandRp = formatRupiah(grandTotalRupiah);
  lines.push(`TOTAL KESELURUHAN: ${grandTotal} pcs (${formattedGrandRp})`);

  return lines.join("\n");
}

/**
 * Creates Click to Chat WhatsApp link
 */
export function generateWhatsAppUrl(phone: string, text: string): string {
  const cleaned = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  if (!cleaned) {
    return `https://wa.me/?text=${encodedText}`;
  }
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}
