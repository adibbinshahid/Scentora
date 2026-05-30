"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { type ProductCardData } from "./ProductCard";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

const CARD_W = 282;
const GAP    = 16;

export default function FeaturedSection({
  products,
  content = {},
}: {
  products: ProductCardData[];
  content?: ContentMap;
}) {
  const isCarousel = products.length > 4;
  const track      = isCarousel ? [...products, ...products] : products;
  const loopWidth  = products.length * (CARD_W + GAP);
  const duration   = products.length * 3.5;           // total loop seconds
  const autoSpeed  = loopWidth / (duration * 60);     // px per 60fps frame

  // ── RAF carousel refs ──
  const trackRef   = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const posRef     = useRef(0);       // current translateX (negative)
  const userVel    = useRef(0);       // user-injected velocity (friction-decayed)
  const hovered    = useRef(false);   // pause auto-scroll on hover
  const rafId      = useRef(0);

  // tickRef pattern: always fresh values, no stale closures
  const tickRef = useRef<() => void>(() => {});
  tickRef.current = () => {
    if (!hovered.current) posRef.current -= autoSpeed;
    posRef.current -= userVel.current;
    userVel.current *= 0.88;                          // friction

    // seamless loop
    if (posRef.current <= -loopWidth) posRef.current += loopWidth;
    if (posRef.current > 0)           posRef.current -= loopWidth;

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;
    }
    rafId.current = requestAnimationFrame(tickRef.current);
  };

  // start / stop RAF
  useEffect(() => {
    if (!isCarousel) return;
    rafId.current = requestAnimationFrame(tickRef.current);
    return () => cancelAnimationFrame(rafId.current);
  }, [isCarousel]);

  // wheel → velocity injection
  useEffect(() => {
    if (!isCarousel) return;
    const el = wrapRef.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      const ax = Math.abs(e.deltaX);
      const ay = Math.abs(e.deltaY);
      // Any horizontal component → block browser back/forward
      if (ax > 0) e.preventDefault();
      // Only drive carousel when horizontal dominates; pure vertical → page scrolls
      if (ax > ay) userVel.current += e.deltaX * 0.45;
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isCarousel]);

  return (
    <section className="py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="section-dark px-6 py-8 lg:px-10 lg:py-10">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className="h-px w-10 shrink-0"
                style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.50))" }}
              />
              <h2
                className="font-display font-light text-2xl sm:text-[28px] text-text-primary whitespace-nowrap"
                style={{ letterSpacing: "0.07em" }}
              >
                {c(content, "featured_title", "Featured Fragrances")}
              </h2>
              <div
                className="h-px w-10 shrink-0"
                style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.50))" }}
              />
            </div>

            <Link
              href="/shop"
              className="group hidden sm:flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-text-muted hover:text-gold-primary transition-colors whitespace-nowrap"
            >
              {c(content, "featured_view_all", "View All")}
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ── Products ── */}
          {isCarousel ? (
            <div
              ref={wrapRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onMouseEnter={() => { hovered.current = true; }}
              onMouseLeave={() => { hovered.current = false; }}
            >
              <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{ gap: GAP, width: track.length * (CARD_W + GAP) }}
              >
                {track.map((product, i) => (
                  <div key={`${product.id}-${i}`} style={{ width: CARD_W, flexShrink: 0 }}>
                    <ProductCard
                      product={product}
                      featured={false}
                      index={i % products.length}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.length > 0 ? (
                products.map((product, i) => (
                  <ProductCard key={product.id} product={product} featured={i === 0} index={i} />
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="aspect-[3/4]" style={{ background: "rgba(255,255,255,0.03)" }} />
                    <div className="p-4 space-y-2">
                      <div className="h-3 rounded" style={{ background: "rgba(255,255,255,0.05)", width: "70%" }} />
                      <div className="h-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", width: "45%" }} />
                      <div className="h-3 rounded mt-3" style={{ background: "rgba(255,255,255,0.04)", width: "35%" }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Indicator ── */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {isCarousel ? (
              <>
                <span className="text-[8px] tracking-[0.3em] uppercase text-text-muted/60 mr-1">
                  Scroll to explore
                </span>
                {products.slice(0, Math.min(products.length, 6)).map((_, i) => (
                  <div
                    key={i}
                    className="h-[3px] rounded-full"
                    style={{
                      width: i === 0 ? 20 : 6,
                      background: i === 0 ? "rgba(201,168,76,0.70)" : "rgba(255,255,255,0.14)",
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                <div className="h-[3px] w-6 rounded-full" style={{ background: "rgba(201,168,76,0.85)" }} />
                <div className="h-[3px] w-2 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
                <div className="h-[3px] w-2 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
              </>
            )}
          </div>

          {/* Mobile view all */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-text-muted hover:text-gold-primary transition-colors"
            >
              View All <ArrowRight size={10} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
