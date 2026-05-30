import { create } from "zustand";
import type { ProductCardData } from "@/components/home/ProductCard";

interface QuickAddState {
  product: ProductCardData | null;
  open: (product: ProductCardData) => void;
  close: () => void;
}

export const useQuickAddStore = create<QuickAddState>((set) => ({
  product: null,
  open: (product) => set({ product }),
  close: () => set({ product: null }),
}));
