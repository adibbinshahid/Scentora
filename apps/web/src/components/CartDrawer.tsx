"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Tag, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

type ConfirmState =
  | { type: "item"; variantId: string; name: string }
  | { type: "all" }
  | null;

function ConfirmDialog({
  state,
  onConfirm,
  onCancel,
}: {
  state: NonNullable<ConfirmState>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center px-6"
      style={{ background: "rgba(8,7,5,0.80)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.93, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-xs p-6 text-center"
        style={{
          background: "rgba(14,12,9,0.99)",
          border: "1px solid rgba(201,168,76,0.22)",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.60)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)" }}
        >
          <Trash2 size={16} className="text-red-400" />
        </div>
        <p className="text-text-primary font-display text-[17px] mb-1.5">
          {state.type === "all" ? "Clear entire cart?" : "Remove item?"}
        </p>
        <p className="text-text-muted text-[12px] leading-relaxed mb-5">
          {state.type === "all"
            ? "All items will be removed. This cannot be undone."
            : `"${state.name}" will be removed from your cart.`}
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-[10px] tracking-[0.18em] uppercase rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(200,185,155,0.75)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-[10px] tracking-[0.18em] uppercase rounded-lg transition-colors font-medium"
            style={{ background: "rgba(239,68,68,0.85)", color: "#fff" }}
          >
            {state.type === "all" ? "Clear All" : "Remove"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CartDrawer() {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const { items, coupon, removeItem, updateQuantity, applyCoupon, removeCoupon, clearCart, getTotals } =
    useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const totals = getTotals();

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);

    const res = await fetch(`/api/coupon?code=${encodeURIComponent(couponInput.trim())}`);
    const data = await res.json();
    setCouponLoading(false);

    if (!res.ok || !data.coupon) {
      toast.error(data.error ?? "Invalid coupon code.");
      return;
    }

    const result = applyCoupon(data.coupon);
    if (result.success) {
      toast.success("Coupon applied!");
      setCouponInput("");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40" style={{ top: "var(--banner-h)" }}
            onClick={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32 }}
            className="fixed right-0 bottom-0 w-full max-w-md glass-card-dark border-l border-border-primary z-50 flex flex-col" style={{ top: "var(--banner-h)" }}
          >
            {/* Confirm overlay */}
            <AnimatePresence>
              {confirm && (
                <ConfirmDialog
                  state={confirm}
                  onConfirm={() => {
                    if (confirm.type === "all") { clearCart(); toast.success("Cart cleared"); }
                    else { removeItem(confirm.variantId); toast.success("Item removed"); }
                    setConfirm(null);
                  }}
                  onCancel={() => setConfirm(null)}
                />
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-primary shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-gold-primary" />
                <span className="font-display text-lg tracking-widest uppercase text-text-primary">
                  Your Cart
                </span>
                {items.length > 0 && (
                  <span className="text-xs text-text-muted">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={() => setConfirm({ type: "all" })}
                    className="text-[9px] tracking-[0.18em] uppercase text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={11} />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <ShoppingBag size={40} strokeWidth={1} className="text-text-muted mb-4" />
                  <p className="font-display text-xl text-text-secondary mb-2">Empty cart</p>
                  <p className="text-sm text-text-muted mb-6">Add fragrances to get started.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-[11px] tracking-[0.2em] uppercase text-gold-primary hover:text-gold-light transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 py-4 border-b border-border-primary last:border-b-0"
                  >
                    {/* Placeholder image */}
                    <div className="w-16 h-20 bg-bg-tertiary shrink-0 border border-border-primary" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm text-text-primary font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">{item.size}</p>
                        </div>
                        <button
                          onClick={() => setConfirm({ type: "item", variantId: item.variantId, name: item.name })}
                          className="text-text-muted hover:text-red-400 transition-colors shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center border border-border-primary">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-8 text-center text-sm text-text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors disabled:opacity-30"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-sm text-text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="shrink-0 px-6 py-5 border-t border-border-primary space-y-4">
                {/* Coupon */}
                {coupon ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-green-400">
                      <Tag size={11} />
                      {coupon.code}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-text-muted hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 bg-bg-tertiary border border-border-primary text-text-primary text-xs px-3 py-2 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase border border-border-primary text-text-secondary hover:border-border-gold hover:text-text-primary transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>−{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between text-text-primary font-medium pt-2 border-t border-border-primary">
                    <span>Total</span>
                    <span>{formatPrice(totals.total)}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight size={13} />
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-[10px] tracking-[0.15em] uppercase text-text-muted hover:text-text-secondary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
