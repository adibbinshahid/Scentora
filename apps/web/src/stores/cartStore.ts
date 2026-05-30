import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  sku: string;
}

export interface Coupon {
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minOrderValue?: number;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  shippingCost: number;
  taxRate: number;
  lastAdded: CartItem | null;
  clearLastAdded: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

const SHIPPING_THRESHOLD = 200; // Free shipping over $200
const FLAT_SHIPPING_COST = 15;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingCost: FLAT_SHIPPING_COST,
      taxRate: 0.08,
      lastAdded: null,

      clearLastAdded: () => set({ lastAdded: null }),

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((i) => i.variantId === newItem.variantId);
        const quantityToAdd = newItem.quantity ?? 1;

        if (existingItem) {
          const updatedQuantity = Math.min(
            existingItem.quantity + quantityToAdd,
            newItem.stock
          );
          set({
            items: items.map((i) =>
              i.variantId === newItem.variantId
                ? { ...i, quantity: updatedQuantity }
                : i
            ),
            lastAdded: { ...existingItem, quantity: updatedQuantity },
          });
        } else {
          const addedItem = { ...newItem, quantity: Math.min(quantityToAdd, newItem.stock) };
          set({
            items: [...items, addedItem],
            lastAdded: addedItem,
          });
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        });
      },

      updateQuantity: (variantId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.variantId === variantId);
        if (!item) return;

        const updatedQuantity = Math.max(1, Math.min(quantity, item.stock));
        set({
          items: items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: updatedQuantity } : i
          ),
        });
      },

      applyCoupon: (coupon) => {
        const subtotal = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return {
            success: false,
            message: `Minimum order value of $${coupon.minOrderValue} required for this coupon.`,
          };
        }

        set({ coupon });
        return { success: true, message: "Coupon applied successfully." };
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      getTotals: () => {
        const { items, coupon, taxRate } = get();
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        let discount = 0;
        let isFreeShipping = subtotal >= SHIPPING_THRESHOLD;

        if (coupon) {
          if (coupon.type === "PERCENTAGE") {
            discount = subtotal * (coupon.value / 100);
          } else if (coupon.type === "FIXED_AMOUNT") {
            discount = Math.min(coupon.value, subtotal);
          } else if (coupon.type === "FREE_SHIPPING") {
            isFreeShipping = true;
          }
        }

        const shipping = subtotal === 0 || isFreeShipping ? 0 : FLAT_SHIPPING_COST;
        const taxableAmount = Math.max(0, subtotal - discount);
        const tax = taxableAmount * taxRate;
        const total = taxableAmount + shipping + tax;

        return {
          subtotal,
          discount,
          shipping,
          tax,
          total,
        };
      },
    }),
    {
      name: "scentora-cart",
      skipHydration: false,
    }
  )
);
