"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CartConfirmModal() {
  const lastAdded = useCartStore((s) => s.lastAdded);
  const clearLastAdded = useCartStore((s) => s.clearLastAdded);

  // Auto-dismiss after 5s
  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(clearLastAdded, 5000);
    return () => clearTimeout(t);
  }, [lastAdded, clearLastAdded]);

  const unitPrice = lastAdded?.price ?? 0;
  const qty = lastAdded?.quantity ?? 1;
  const total = unitPrice * qty;

  return (
    <AnimatePresence>
      {lastAdded && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99990]"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={clearLastAdded}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed z-[99991] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
            style={{ maxWidth: 380 }}
          >
            <div
              className="mx-4 p-6"
              style={{
                background: "rgba(14,12,9,0.98)",
                border: "1px solid rgba(201,168,76,0.28)",
                borderRadius: 16,
                boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.30)" }}
                  >
                    <ShoppingBag size={13} className="text-gold-primary" />
                  </div>
                  <span className="text-[11px] tracking-[0.22em] uppercase text-gold-primary font-medium">
                    Added to Cart
                  </span>
                </div>
                <button
                  onClick={clearLastAdded}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close"
                >
                  <X size={15} strokeWidth={1.8} />
                </button>
              </div>

              {/* Product row */}
              <div
                className="flex gap-4 p-4 mb-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                }}
              >
                {/* Thumbnail */}
                <div
                  className="relative shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 64, height: 64, background: "rgba(255,255,255,0.05)" }}
                >
                  {lastAdded.image ? (
                    <Image
                      src={lastAdded.image}
                      alt={lastAdded.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-gold-primary/30 text-lg">SP</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[15px] text-text-primary leading-tight mb-0.5 truncate">
                    {lastAdded.name}
                  </p>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-text-muted mb-3">
                    {lastAdded.size}
                  </p>

                  {/* Price breakdown */}
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {[
                      { label: "Qty", value: String(qty) },
                      { label: "Unit", value: formatPrice(unitPrice) },
                      { label: "Total", value: formatPrice(total) },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="py-1.5 px-1"
                        style={{
                          background: "rgba(201,168,76,0.06)",
                          border: "1px solid rgba(201,168,76,0.14)",
                          borderRadius: 6,
                        }}
                      >
                        <p className="text-[8px] tracking-[0.18em] uppercase text-text-muted mb-0.5">{label}</p>
                        <p className="text-[12px] font-medium text-text-primary">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={clearLastAdded}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.18em] uppercase transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 8,
                    color: "rgba(200,185,155,0.75)",
                  }}
                >
                  Continue Shopping
                </button>
                <Link
                  href="/cart"
                  onClick={clearLastAdded}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-[0.18em] uppercase font-medium transition-colors"
                  style={{
                    background: "rgba(201,168,76,1)",
                    border: "1px solid rgba(201,168,76,1)",
                    borderRadius: 8,
                    color: "#0F0D0A",
                  }}
                >
                  View Cart
                  <ArrowRight size={11} />
                </Link>
              </div>

              {/* Progress bar auto-dismiss */}
              <motion.div
                className="mt-4 h-px rounded-full"
                style={{ background: "rgba(201,168,76,0.25)" }}
                initial={{ scaleX: 1, originX: 0 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
