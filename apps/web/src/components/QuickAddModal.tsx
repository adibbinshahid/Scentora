"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useQuickAddStore } from "@/stores/quickAddStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function QuickAddModal() {
  const { product, close } = useQuickAddStore();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [qty, setQty] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? "");
      setQty(1);
    }
  }, [product]);

  // Lock scroll
  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const variant = product?.variants.find((v) => v.id === selectedVariantId);
  const unitPrice = variant?.salePrice ?? variant?.price ?? 0;
  const originalPrice = variant?.salePrice ? variant.price : null;
  const total = unitPrice * qty;
  const maxQty = variant?.stock ?? 1;

  function handleAdd() {
    if (!product || !variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      price: unitPrice,
      image: product.images[0] ?? "",
      stock: variant.stock,
      sku: variant.sku,
      quantity: qty,
    });
    toast.success(`${product.name} added to cart`);
    close();
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qa-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99990]"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            key="qa-modal"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed z-[99991] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4"
            style={{ maxWidth: 420 }}
          >
            <div
              style={{
                background: "rgba(13,11,8,0.99)",
                border: "1px solid rgba(201,168,76,0.22)",
                borderRadius: 18,
                boxShadow: "0 40px 100px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Product hero strip */}
              <div className="relative flex items-center gap-4 px-5 pt-5 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Thumbnail */}
                <div
                  className="relative shrink-0 rounded-xl overflow-hidden"
                  style={{ width: 72, height: 90, background: "rgba(255,255,255,0.04)" }}
                >
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-gold-primary/25 text-xl">SP</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-gold-primary mb-1">
                    {product.concentration}
                  </p>
                  <h3 className="font-display text-[18px] text-text-primary leading-tight mb-0.5 truncate">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-[0.12em]">
                    {product.family}
                  </p>
                </div>

                <button
                  onClick={close}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>

              <div className="px-5 py-5 space-y-5">
                {/* Size / variant selection */}
                <div>
                  <p className="text-[9px] tracking-[0.28em] uppercase text-text-muted mb-2.5">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const vPrice = v.salePrice ?? v.price;
                      const selected = v.id === selectedVariantId;
                      const outOfStock = v.stock === 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => { if (!outOfStock) { setSelectedVariantId(v.id); setQty(1); } }}
                          disabled={outOfStock}
                          className="flex flex-col items-center px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
                          style={{
                            background: selected ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${selected ? "rgba(201,168,76,0.55)" : "rgba(255,255,255,0.09)"}`,
                            minWidth: 72,
                          }}
                        >
                          <span className={`text-[13px] font-medium ${selected ? "text-gold-primary" : "text-text-secondary"}`}>
                            {v.size}
                          </span>
                          <span className={`text-[10px] mt-0.5 ${selected ? "text-gold-primary/70" : "text-text-muted"}`}>
                            {formatPrice(vPrice)}
                          </span>
                          {outOfStock && (
                            <span className="text-[8px] text-red-400/70 mt-0.5 tracking-wide">Out of stock</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between">
                  <p className="text-[9px] tracking-[0.28em] uppercase text-text-muted">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                    >
                      <Minus size={12} className="text-text-primary" />
                    </button>
                    <span className="text-[15px] font-medium text-text-primary w-6 text-center">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                      disabled={qty >= maxQty}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                    >
                      <Plus size={12} className="text-text-primary" />
                    </button>
                  </div>
                </div>

                {/* Price breakdown */}
                <div
                  className="grid grid-cols-3 gap-2 p-3 rounded-xl"
                  style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}
                >
                  {[
                    { label: "Unit Price", value: formatPrice(unitPrice), sub: originalPrice ? formatPrice(originalPrice) : null },
                    { label: "Quantity", value: String(qty) },
                    { label: "Total", value: formatPrice(total), highlight: true },
                  ].map(({ label, value, sub, highlight }) => (
                    <div key={label} className="text-center">
                      <p className="text-[8px] tracking-[0.18em] uppercase text-text-muted mb-1">{label}</p>
                      <p className={`text-[13px] font-medium ${highlight ? "text-gold-primary" : "text-text-primary"}`}>
                        {value}
                      </p>
                      {sub && <p className="text-[9px] text-text-muted line-through mt-0.5">{sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 pt-1">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={close}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 text-[9.5px] tracking-[0.18em] uppercase transition-colors rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(200,185,155,0.75)",
                      flexShrink: 0,
                    }}
                  >
                    Details
                    <ArrowRight size={10} />
                  </Link>

                  <button
                    onClick={handleAdd}
                    disabled={!variant || variant.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.20em] uppercase font-medium transition-all rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(201,168,76,1)",
                      color: "#0F0D0A",
                    }}
                  >
                    <ShoppingBag size={13} strokeWidth={1.5} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
