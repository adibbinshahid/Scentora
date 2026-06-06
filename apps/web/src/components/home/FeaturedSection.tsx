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
  const duration   = products.length * 5;              // total loop seconds
  const autoSpeed  = loopWidth / (duration * 60);     // px per 60fps frame

  // ── RAF carousel refs ──
  const trackRef    = useRef<HTMLDivElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const posRef      = useRef(0);
  const userVel     = useRef(0);
  const hovered     = useRef(false);
  const rafId       = useRef(0);
  // mouse/touch drag
  const dragActive  = useRef(false);
  const dragStartX  = useRef(0);
  const dragLastX   = useRef(0);
  const wasDragged  = useRef(false);  // true if pointer moved > 5px → suppress link click

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

  // mouse drag → velocity injection
  useEffect(() => {
    if (!isCarousel) return;
    const el = wrapRef.current;
    if (!el) return;

    function onMouseDown(e: MouseEvent) {
      e.preventDefault(); // suppress native link/image drag so mousemove stays ours
      dragActive.current = true;
      wasDragged.current = false;
      dragStartX.current = e.clientX;
      dragLastX.current  = e.clientX;
      hovered.current    = true;
    }
    function onMouseMove(e: MouseEvent) {
      if (!dragActive.current) return;
      const dx = e.clientX - dragLastX.current;
      dragLastX.current = e.clientX;
      userVel.current -= dx * 0.3;
      if (Math.abs(e.clientX - dragStartX.current) > 5) wasDragged.current = true;
    }
    function onMouseUp() {
      dragActive.current = false;
      // keep hovered=true briefly so auto-scroll doesn't snap back immediately
      setTimeout(() => { hovered.current = false; }, 60);
    }
    function onMouseLeaveDoc() { dragActive.current = false; hovered.current = false; }

    // touch
    function onTouchStart(e: TouchEvent) {
      dragActive.current = true;
      wasDragged.current = false;
      dragStartX.current = e.touches[0].clientX;
      dragLastX.current  = e.touches[0].clientX;
      hovered.current    = true;
    }
    function onTouchMove(e: TouchEvent) {
      if (!dragActive.current) return;
      const dx = e.touches[0].clientX - dragLastX.current;
      dragLastX.current = e.touches[0].clientX;
      userVel.current -= dx * 0.3;
      if (Math.abs(e.touches[0].clientX - dragStartX.current) > 5) wasDragged.current = true;
    }
    function onTouchEnd() { dragActive.current = false; hovered.current = false; }

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeaveDoc);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: true });
    el.addEventListener("touchend",   onTouchEnd);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeaveDoc);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
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
              onMouseEnter={() => { if (!dragActive.current) hovered.current = true; }}
              onMouseLeave={() => { if (!dragActive.current) hovered.current = false; }}
            >
              <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{ gap: GAP, width: track.length * (CARD_W + GAP) }}
              >
                {track.map((product, i) => (
                  <div
                    key={`${product.id}-${i}`}
                    style={{ width: CARD_W, flexShrink: 0 }}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onClickCapture={(e) => { if (wasDragged.current) { e.preventDefault(); e.stopPropagation(); } }}
                  >
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
