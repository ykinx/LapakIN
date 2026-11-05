export type ItemPrice = 10000 | 9000;

export interface SaleItem {
  id: string;
  productName: string;
  quantity: number | "";
  price: ItemPrice;
}

export interface StallDistribution {
  id: string;
  stallName: string;
  items: SaleItem[];
}

export interface ValidationError {
  type:
    | "empty_stall"
    | "duplicate_stall"
    | "empty_product"
    | "duplicate_product"
    | "invalid_qty";
  message: string;
  stallId?: string;
  itemId?: string;
}

export interface StallSummary {
  stallId: string;
  stallName: string;
  total: number;
  totalRupiah: number;
  itemCount: number;
}

export interface ProductSummary {
  productName: string;
  total: number;
}

export interface DistributionSummary {
  stallTotals: StallSummary[];
  productTotals: ProductSummary[];
  grandTotal: number;
  grandTotalRupiah: number;
  hasErrors: boolean;
  errors: ValidationError[];
}

export interface MasterPreset {
  stalls: string[];
  products: string[];
}
