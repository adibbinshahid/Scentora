"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useQuickAddStore } from "@/stores/quickAddStore";
import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  size: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
}

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  concentration: string;
  family: string;
  gender: string;
  images: string[];
  variants: Variant[];
  avgRating?: number;
  reviewCount?: number;
}

function MiniStars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={9}
          strokeWidth={1.5}
          className={i <= full ? "text-gold-primary fill-gold-primary" : "text-text-muted/40"}
        />
      ))}
    </div>
  );
}

const familyGradients: Record<string, string> = {
  "Oriental Woody":    "linear-gradient(145deg, #0D0800 0%, #2A1800 50%, #4A2C00 75%, #1A1000 100%)",
  "Floral Musk":       "linear-gradient(145deg, #0A0810 0%, #1E0D30 50%, #3D1860 75%, #100A1A 100%)",
  "Woody Spiced":      "linear-gradient(145deg, #0D0600 0%, #2A1000 50%, #5C2800 75%, #1A0A00 100%)",
  "Citrus Aromatic":   "linear-gradient(145deg, #040A04 0%, #0D2010 50%, #1A3A15 75%, #050D05 100%)",
  "Leather Oriental":  "linear-gradient(145deg, #0D0006 0%, #2A000F 50%, #5A0020 75%, #100005 100%)",
  "Floral Spiced":     "linear-gradient(145deg, #0D0408 0%, #2A0D1A 50%, #5C1A35 75%, #100408 100%)",
  "Woody Aromatic":    "linear-gradient(145deg, #04080A 0%, #0D1F2A 50%, #1A3A45 75%, #050A0D 100%)",
  "Amber Balsamic":    "linear-gradient(145deg, #0D0A00 0%, #2A2000 50%, #5C4500 75%, #100C00 100%)",
  "Woody Creamy":      "linear-gradient(145deg, #0D0B08 0%, #2A1E10 50%, #4A3018 75%, #100C08 100%)",
  "Smoky Balsamic":    "linear-gradient(145deg, #0A0A0A 0%, #1A1A18 50%, #2E2E28 75%, #0A0A0A 100%)",
  "Marine Aromatic":   "linear-gradient(145deg, #040A0D 0%, #0D2030 50%, #1A3E5C 75%, #050C10 100%)",
  "Solar Floral":      "linear-gradient(145deg, #0D0800 0%, #2A1C00 50%, #5C3800 75%, #100900 100%)",
};

function getGradient(family: string): string {
  return familyGradients[family] ?? "linear-gradient(145deg, #0D0D0D 0%, #1A1A1A 50%, #2A2A2A 75%, #0D0D0D 100%)";
}

export default function ProductCard({
  product,
  featured = false,
  index = 0,
}: {
  product: ProductCardData;
  featured?: boolean;
  index?: number;
}) {
  const { toggleItem, hasItem } = useWishlistStore();
  const openQuickAdd = useQuickAddStore((s) => s.open);
  const [mounted, setMounted] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [failedImgs, setFailedImgs] = useState<Set<number>>(new Set());
  useEffect(() => setMounted(true), []);
  const wishlisted = mounted && hasItem(product.id);

  function prevImg(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + product.images.length) % product.images.length);
  }
  function nextImg(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % product.images.length);
  }

  const cheapestVariant = product.variants[0];
  const displayPrice = cheapestVariant?.salePrice ?? cheapestVariant?.price ?? 0;
  const originalPrice = cheapestVariant?.salePrice ? cheapestVariant.price : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    openQuickAdd(product);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: cheapestVariant?.salePrice ?? cheapestVariant?.price ?? 0,
      image: product.images[0] ?? "",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: index * 0.10, ease: [0.16, 1, 0.3, 1] as const }}
      style={{ willChange: "transform" }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div
          className="relative rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-300"
          style={{
            background: "#0F0D0A",
            border: featured
              ? "1px solid rgba(201,168,76,0.35)"
              : "1px solid rgba(255,255,255,0.06)",
            boxShadow: featured
              ? "0 0 50px rgba(201,168,76,0.10), 0 8px 32px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* ── Image area ── */}
          <div
            className="relative aspect-[3/4] overflow-hidden"
            style={{ background: getGradient(product.family) }}
          >
            {/* Bestseller badge */}
            {featured && (
              <span
                className="absolute top-3 left-3 z-30 text-[7.5px] tracking-[0.16em] uppercase bg-gold-primary text-bg-primary px-2.5 py-1 rounded-full font-semibold"
                style={{ boxShadow: "0 2px 12px rgba(201,168,76,0.45)" }}
              >
                Bestseller
              </span>
            )}

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Heart
                size={12}
                strokeWidth={1.8}
                className={wishlisted ? "fill-gold-primary text-gold-primary" : "text-text-primary"}
              />
            </button>

            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 z-10"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
            />

            {/* Product image or SP placeholder */}
            {product.images[0] && !failedImgs.has(imgIdx) ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={imgIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[imgIdx]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      onError={() => setFailedImgs((prev) => new Set([...prev, imgIdx]))}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Inline carousel arrows — only when multiple images */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-200"
                      style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
                    >
                      <ChevronLeft size={13} className="text-white" />
                    </button>
                    <button
                      onClick={nextImg}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-200"
                      style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
                    >
                      <ChevronRight size={13} className="text-white" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-200">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i); }}
                          className="rounded-full transition-all duration-200"
                          style={{
                            width: i === imgIdx ? 14 : 5,
                            height: 5,
                            background: i === imgIdx ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.45)",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span
                  className="font-display pointer-events-none select-none"
                  style={{ fontSize: 70, color: "rgba(201,168,76,0.07)", letterSpacing: "0.05em", lineHeight: 1 }}
                >
                  SP
                </span>
                <span
                  className="text-[6px] tracking-[0.35em] uppercase pointer-events-none select-none"
                  style={{ color: "rgba(201,168,76,0.05)" }}
                >
                  Scentora
                </span>
              </div>
            )}

            {/* Hover gold glow overlay */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(201,168,76,0.07) 100%)" }}
            />
          </div>

          {/* ── Info bar ── */}
          <div className="px-4 pt-3 pb-4 flex flex-col gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-[15px] text-text-primary leading-tight mb-0.5 group-hover:text-gold-light transition-colors duration-300 truncate">
                  {product.name}
                </h3>
                <p className="text-[9.5px] tracking-[0.14em] uppercase text-text-muted">
                  {product.concentration}
                </p>
              </div>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-[13px] text-text-primary font-medium">{formatPrice(displayPrice)}</span>
                {originalPrice && (
                  <span className="text-[10px] text-text-muted line-through">{formatPrice(originalPrice)}</span>
                )}
              </div>
            </div>

            {/* Star rating */}
            {(product.reviewCount ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 -mt-1">
                <MiniStars rating={product.avgRating ?? 0} />
                <span className="text-[9.5px] text-text-muted">({product.reviewCount})</span>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={!cheapestVariant || cheapestVariant.stock === 0}
              aria-label="Add to cart"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] tracking-[0.18em] uppercase font-medium transition-[background,border-color,color] duration-300 disabled:opacity-35"
              style={{
                background: cartHovered ? "rgba(201,168,76,1)" : (featured ? "rgba(201,168,76,0.10)" : "rgba(255,255,255,0.04)"),
                border: `1px solid ${cartHovered ? "rgba(201,168,76,1)" : (featured ? "rgba(201,168,76,0.28)" : "rgba(255,255,255,0.09)")}`,
                color: cartHovered ? "#0F0D0A" : "rgba(200,185,155,0.85)",
              }}
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              {cheapestVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
