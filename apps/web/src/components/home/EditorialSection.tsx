"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

const EDITORIAL_STYLE = [
  { accent: "rgba(201,168,76,0.12)", glow: "rgba(201,168,76,0.22)",    visual: "gift"   as const },
  { accent: "rgba(255,255,255,0.04)", glow: "rgba(220,200,180,0.18)",  visual: "flower" as const },
  { accent: "rgba(40,20,60,0.25)",    glow: "rgba(120,80,200,0.18)",   visual: "bottle" as const },
];

const EDITORIAL_DEFAULTS = [
  { label: "Luxury Gift Sets",    desc: "The perfect gift for unforgettable moments.",   cta: "Shop Now",      href: "/shop?category=gift-sets"   },
  { label: "Our Ingredients",     desc: "Responsibly sourced. Exquisitely crafted.",     cta: "Discover More", href: "/about#ingredients"          },
  { label: "Signature Collection",desc: "Timeless scents, exceptional craftsmanship.",   cta: "Explore",       href: "/shop?view=collections"      },
];

function GiftVisual() {
  return (
    <div className="relative flex items-center justify-center h-full pt-6">
      {/* Box base */}
      <div
        className="relative rounded-sm"
        style={{
          width: 96, height: 88,
          background: "linear-gradient(145deg, rgba(201,168,76,0.25) 0%, rgba(140,90,20,0.18) 100%)",
          border: "1px solid rgba(201,168,76,0.30)",
          boxShadow: "0 0 40px rgba(201,168,76,0.18), inset 0 0 20px rgba(201,168,76,0.06)",
        }}
      >
        {/* Ribbon vertical */}
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[3px]"
          style={{ background: "rgba(201,168,76,0.50)" }} />
        {/* Ribbon horizontal */}
        <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[3px]"
          style={{ background: "rgba(201,168,76,0.50)" }} />
        {/* Box lid */}
        <div
          className="absolute -top-6 -left-1 -right-1 rounded-sm"
          style={{
            height: 22,
            background: "linear-gradient(145deg, rgba(201,168,76,0.35), rgba(160,100,20,0.22))",
            border: "1px solid rgba(201,168,76,0.32)",
          }}
        />
        {/* Bow */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-end gap-1">
          <div className="w-7 h-5 rounded-full" style={{ background: "rgba(201,168,76,0.40)", transformOrigin: "right bottom", transform: "rotate(-20deg)" }} />
          <div className="w-7 h-5 rounded-full" style={{ background: "rgba(201,168,76,0.40)", transformOrigin: "left bottom", transform: "rotate(20deg)" }} />
        </div>
      </div>
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 160, height: 80,
          background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.25) 0%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

function FlowerVisual() {
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Central petal ring */}
      {[0, 51, 102, 153, 204, 255, 306].map((deg, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 22, height: 34,
            background: `radial-gradient(ellipse at 50% 30%, rgba(240,230,215,${0.5 - i * 0.03}) 0%, rgba(200,185,165,${0.2 - i * 0.01}) 100%)`,
            border: "1px solid rgba(255,255,255,0.20)",
            transform: `rotate(${deg}deg) translateY(-30px)`,
            transformOrigin: "50% 100%",
          }}
        />
      ))}
      {/* Center */}
      <div
        className="relative z-10 rounded-full"
        style={{
          width: 18, height: 18,
          background: "radial-gradient(circle, rgba(255,220,150,0.7) 0%, rgba(201,168,76,0.4) 100%)",
          boxShadow: "0 0 20px rgba(201,168,76,0.40)",
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(240,230,215,0.10) 0%, transparent 65%)",
          filter: "blur(24px)",
        }}
      />
    </div>
  );
}

function BottleVisual() {
  return (
    <div className="relative flex items-center justify-center h-full pt-4">
      {/* Bottle body */}
      <div
        className="relative rounded-2xl"
        style={{
          width: 68, height: 110,
          background: "linear-gradient(150deg, rgba(60,20,80,0.55) 0%, rgba(20,10,40,0.80) 60%, rgba(10,5,20,0.90) 100%)",
          border: "1px solid rgba(120,80,200,0.25)",
          boxShadow: "0 0 50px rgba(100,60,180,0.18), inset 0 0 20px rgba(120,80,200,0.06)",
        }}
      >
        {/* Glass highlight */}
        <div className="absolute top-3 left-3 w-[5px] h-14 rounded-full opacity-25"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }} />
        {/* SP mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-white/20 font-light" style={{ fontSize: 22, letterSpacing: "0.05em" }}>SP</span>
        </div>
        {/* Neck */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-5"
          style={{
            background: "rgba(60,20,80,0.70)",
            border: "1px solid rgba(120,80,200,0.20)",
            borderBottom: "none",
            borderRadius: "3px 3px 0 0",
          }}
        />
        {/* Cap */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-6"
          style={{
            background: "linear-gradient(145deg, rgba(80,40,120,0.80), rgba(40,20,60,0.90))",
            border: "1px solid rgba(120,80,200,0.28)",
            borderRadius: "2px 2px 0 0",
          }}
        />
      </div>
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 120, height: 60,
          background: "radial-gradient(ellipse at 50% 100%, rgba(120,80,200,0.22) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />
    </div>
  );
}

const VISUALS = { gift: GiftVisual, flower: FlowerVisual, bottle: BottleVisual };

export default function EditorialSection({ content = {} }: { content?: ContentMap }) {
  const items = EDITORIAL_DEFAULTS.map((def, i) => ({
    label: c(content, `editorial_block${i + 1}_title`, def.label),
    desc:  c(content, `editorial_block${i + 1}_desc`,  def.desc),
    cta:   c(content, `editorial_block${i + 1}_cta`,   def.cta),
    href:  c(content, `editorial_block${i + 1}_href`,  def.href),
    ...EDITORIAL_STYLE[i],
  }));

  return (
    <section className="py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(({ label, desc, cta, href, accent, glow, visual }, i) => {
            const Visual = VISUALS[visual];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: i * 0.10, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <Link href={href} className="group block h-full editorial-card">
                  <div
                    className="relative flex items-center justify-between p-7 h-[180px] overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${accent} 0%, transparent 60%)`,
                    }}
                  >
                    {/* Inner glow */}
                    <div
                      className="absolute inset-0 opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 80% 70% at 75% 80%, ${glow} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Text content */}
                    <div className="relative z-10 flex-1 pr-4">
                      <h3
                        className="font-display text-[20px] text-text-primary mb-2 leading-tight"
                        style={{ letterSpacing: "0.02em" }}
                      >
                        {label}
                      </h3>
                      <p className="text-[12px] text-text-muted leading-relaxed mb-4 max-w-[160px]">
                        {desc}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gold-primary group-hover:text-gold-light transition-colors">
                        {cta}
                        <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    {/* Visual */}
                    <div className="relative z-10 w-28 h-28 shrink-0">
                      <Visual />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
