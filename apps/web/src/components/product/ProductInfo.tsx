"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Variant {
  id: string;
  size: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
}

interface Props {
  productId: string;
  slug: string;
  name: string;
  description: string;
  concentration: string;
  gender: string;
  family: string;
  variants: Variant[];
}

const GENDER_LABEL: Record<string, string> = {
  UNISEX: "Unisex",
  FEMALE: "For Her",
  MALE: "For Him",
};

export default function ProductInfo({
  productId,
  slug,
  name,
  description,
  concentration,
  gender,
  family,
  variants,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const { toggleItem, hasItem } = useWishlistStore();
  const wishlisted = hasItem(productId);

  const displayPrice = selectedVariant.salePrice ?? selectedVariant.price;
  const originalPrice = selectedVariant.salePrice ? selectedVariant.price : null;
  const outOfStock = selectedVariant.stock === 0;

  function handleAddToCart() {
    if (outOfStock) return;
    addItem({
      productId,
      variantId: selectedVariant.id,
      name,
      size: selectedVariant.size,
      price: displayPrice,
      image: "",
      stock: selectedVariant.stock,
      sku: selectedVariant.sku,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast.success(`${name} (${selectedVariant.size}) added to cart`);
    setCartOpen(true);
  }

  function handleWishlist() {
    toggleItem({
      id: productId,
      name,
      slug,
      price: displayPrice,
      image: "",
    });
  }

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-gold-primary border border-border-gold px-2.5 py-1">
          {concentration}
        </span>
        <span className="text-[9px] tracking-[0.3em] uppercase text-text-muted border border-border-primary px-2.5 py-1">
          {GENDER_LABEL[gender] ?? gender}
        </span>
        <span className="text-[9px] tracking-[0.3em] uppercase text-text-muted border border-border-primary px-2.5 py-1">
          {family}
        </span>
      </div>

      {/* Name + price */}
      <div>
        <h1
          className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-3"
          style={{ letterSpacing: "0.06em" }}
        >
          {name}
        </h1>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl text-text-primary">{formatPrice(displayPrice)}</span>
          {originalPrice && (
            <span className="text-lg text-text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed max-w-md">{description}</p>

      {/* Size selector */}
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-text-secondary mb-3">
          Select Size
        </p>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => {
            const active = v.id === selectedVariant.id;
            const oos = v.stock === 0;
            return (
              <button
                key={v.id}
                onClick={() => !oos && setSelectedVariant(v)}
                disabled={oos}
                className={`relative px-5 py-3 min-h-[44px] text-sm border transition-all ${
                  active
                    ? "border-gold-primary text-gold-primary bg-gold-primary/5"
                    : oos
                    ? "border-border-primary text-text-muted opacity-40 cursor-not-allowed line-through"
                    : "border-border-primary text-text-secondary hover:border-border-gold hover:text-text-primary"
                }`}
              >
                {v.size}
                <span className="block text-[10px] text-text-muted mt-0.5">
                  {oos ? "Sold out" : formatPrice(v.salePrice ?? v.price)}
                </span>
              </button>
            );
          })}
        </div>
        {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
          <p className="text-xs text-amber-400 mt-2">
            Only {selectedVariant.stock} left in stock
          </p>
        )}
      </div>

      {/* CTA row */}
      <div className="flex gap-3 pt-2 min-h-[56px]">
        <motion.button
          onClick={handleAddToCart}
          disabled={outOfStock}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {added ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </motion.button>

        <button
          onClick={handleWishlist}
          className={`w-14 flex items-center justify-center border transition-colors ${
            wishlisted
              ? "border-gold-primary bg-gold-primary/5 text-gold-primary"
              : "border-border-primary text-text-muted hover:border-border-gold hover:text-text-primary"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} strokeWidth={1.5} className={wishlisted ? "fill-gold-primary" : ""} />
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-border-primary">
        {[
          "Complimentary shipping over $200",
          "Authentic guarantee",
          "30-day returns",
        ].map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <Check size={10} className="text-gold-primary" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
