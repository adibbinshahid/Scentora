"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Heart, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="glass-panel p-14 text-center">
        <Heart size={40} className="text-text-muted mx-auto mb-4" strokeWidth={1} />
        <p className="font-display text-2xl text-text-secondary mb-2">Your wishlist is empty</p>
        <p className="text-sm text-text-muted mb-8">
          Save fragrances you love and revisit them anytime.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
        >
          Explore Collection
          <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-muted mb-6">
        {items.length} {items.length === 1 ? "fragrance" : "fragrances"} saved
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="glass-panel p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="block font-display text-lg text-text-primary hover:text-gold-light transition-colors truncate"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-text-muted mt-1">
                  {formatPrice(item.price)}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-[11px] tracking-[0.15em] uppercase text-gold-primary hover:text-gold-light transition-colors"
                >
                  View
                  <ArrowRight size={11} />
                </Link>
              </div>
              <button
                onClick={() => toggleItem(item)}
                className="text-text-muted hover:text-red-400 transition-colors shrink-0 mt-0.5"
                aria-label="Remove from wishlist"
              >
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
