"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 shrink-0" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.50))" }} />
            <h1 className="font-display font-light text-3xl text-text-primary" style={{ letterSpacing: "0.07em" }}>
              My Wishlist
            </h1>
            <div className="h-px w-10 shrink-0" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.50))" }} />
          </div>
          {items.length > 0 && (
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-muted text-center">
              {items.length} {items.length === 1 ? "fragrance" : "fragrances"} saved
            </p>
          )}
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-center py-24"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
            }}
          >
            <Heart size={48} className="mx-auto mb-5 text-text-muted" strokeWidth={1} />
            <p className="font-display text-2xl text-text-secondary mb-3">Your wishlist is empty</p>
            <p className="text-sm text-text-muted mb-10 max-w-xs mx-auto leading-relaxed">
              Save fragrances you love and revisit them anytime.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors rounded-sm"
            >
              Explore Collection
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl p-5 flex gap-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="shrink-0">
                    <div
                      className="w-20 h-24 rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)" }}
                    >
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={80} height={96} className="object-contain p-2" />
                      ) : (
                        <span className="font-display text-gold-primary/20 text-2xl">SP</span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="block font-display text-[16px] text-text-primary hover:text-gold-light transition-colors truncate mb-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[13px] text-gold-primary font-medium mb-4">
                      {formatPrice(item.price)}
                    </p>
                    <button
                      onClick={() => {
                        addItem({
                          productId: item.id,
                          variantId: item.id,
                          name: item.name,
                          size: "",
                          price: item.price,
                          image: item.image,
                          stock: 99,
                          sku: "",
                        });
                        toast.success(`${item.name} added to cart`);
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-text-muted hover:text-gold-primary transition-colors"
                    >
                      <ShoppingBag size={11} strokeWidth={1.5} />
                      Add to Cart
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => toggleItem(item)}
                    aria-label="Remove from wishlist"
                    className="absolute top-4 right-4 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-text-muted hover:text-gold-primary transition-colors"
            >
              Continue Shopping
              <ArrowRight size={10} />
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
