"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Timer, Landmark, Leaf } from "lucide-react";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

interface HeroSectionProps {
  content?: ContentMap;
}


const PARTICLES = [
  // original ring — boosted opacity
  { left: "7%",  top: "18%", size: 2.5, delay: 0,    dur: 8.5,  opacity: 0.80 },
  { left: "15%", top: "55%", size: 2,   delay: 2.1,  dur: 11,   opacity: 0.65 },
  { left: "22%", top: "32%", size: 3.5, delay: 0.7,  dur: 9,    opacity: 0.75 },
  { left: "28%", top: "75%", size: 2,   delay: 3.5,  dur: 7.5,  opacity: 0.60 },
  { left: "35%", top: "12%", size: 2.5, delay: 1.2,  dur: 10,   opacity: 0.70 },
  { left: "42%", top: "62%", size: 3,   delay: 4.0,  dur: 8,    opacity: 0.75 },
  { left: "48%", top: "28%", size: 2,   delay: 0.4,  dur: 12,   opacity: 0.60 },
  { left: "55%", top: "82%", size: 2.5, delay: 2.8,  dur: 9.5,  opacity: 0.65 },
  { left: "61%", top: "20%", size: 3.5, delay: 1.6,  dur: 7.8,  opacity: 0.80 },
  { left: "67%", top: "48%", size: 2,   delay: 0.9,  dur: 11.5, opacity: 0.62 },
  { left: "73%", top: "70%", size: 2.5, delay: 3.2,  dur: 8.8,  opacity: 0.70 },
  { left: "79%", top: "15%", size: 3,   delay: 1.8,  dur: 9,    opacity: 0.75 },
  { left: "85%", top: "40%", size: 4,   delay: 0.5,  dur: 7.5,  opacity: 0.85 },
  { left: "91%", top: "65%", size: 2.5, delay: 2.4,  dur: 10.5, opacity: 0.68 },
  { left: "96%", top: "30%", size: 2,   delay: 4.5,  dur: 8.2,  opacity: 0.62 },
  { left: "4%",  top: "42%", size: 2.5, delay: 1.1,  dur: 9.8,  opacity: 0.70 },
  { left: "52%", top: "50%", size: 2,   delay: 5.0,  dur: 13,   opacity: 0.55 },
  { left: "38%", top: "88%", size: 2.5, delay: 3.8,  dur: 8.5,  opacity: 0.62 },
  // second ring — interleaved positions
  { left: "11%", top: "8%",  size: 1.5, delay: 1.4,  dur: 9.2,  opacity: 0.72 },
  { left: "19%", top: "44%", size: 2.5, delay: 0.6,  dur: 10.8, opacity: 0.60 },
  { left: "25%", top: "68%", size: 2,   delay: 2.9,  dur: 8.3,  opacity: 0.68 },
  { left: "31%", top: "24%", size: 3,   delay: 4.2,  dur: 7.2,  opacity: 0.75 },
  { left: "44%", top: "90%", size: 1.5, delay: 1.7,  dur: 11.2, opacity: 0.55 },
  { left: "50%", top: "14%", size: 2.5, delay: 0.3,  dur: 8.9,  opacity: 0.70 },
  { left: "57%", top: "38%", size: 3,   delay: 3.1,  dur: 10.2, opacity: 0.78 },
  { left: "63%", top: "72%", size: 2,   delay: 1.9,  dur: 7.6,  opacity: 0.63 },
  { left: "69%", top: "22%", size: 2.5, delay: 0.8,  dur: 9.4,  opacity: 0.72 },
  { left: "75%", top: "58%", size: 3.5, delay: 4.4,  dur: 8.1,  opacity: 0.80 },
  { left: "82%", top: "82%", size: 2,   delay: 2.2,  dur: 11.8, opacity: 0.60 },
  { left: "88%", top: "28%", size: 3,   delay: 1.0,  dur: 8.6,  opacity: 0.75 },
  { left: "93%", top: "52%", size: 2,   delay: 3.6,  dur: 9.7,  opacity: 0.65 },
  { left: "2%",  top: "62%", size: 2.5, delay: 0.2,  dur: 10.4, opacity: 0.70 },
  { left: "9%",  top: "88%", size: 1.5, delay: 5.2,  dur: 7.9,  opacity: 0.55 },
  { left: "46%", top: "44%", size: 2,   delay: 2.5,  dur: 12.5, opacity: 0.58 },
  { left: "16%", top: "26%", size: 3,   delay: 1.3,  dur: 8.7,  opacity: 0.73 },
  // third ring — dense fill
  { left: "3%",  top: "30%", size: 2,   delay: 3.3,  dur: 9.1,  opacity: 0.68 },
  { left: "13%", top: "72%", size: 2.5, delay: 0.9,  dur: 10.6, opacity: 0.62 },
  { left: "20%", top: "15%", size: 1.5, delay: 4.6,  dur: 8.4,  opacity: 0.72 },
  { left: "33%", top: "48%", size: 3,   delay: 1.5,  dur: 9.3,  opacity: 0.78 },
  { left: "40%", top: "78%", size: 2,   delay: 2.7,  dur: 7.4,  opacity: 0.60 },
  { left: "54%", top: "94%", size: 1.5, delay: 0.1,  dur: 11.4, opacity: 0.55 },
  { left: "60%", top: "10%", size: 3,   delay: 3.9,  dur: 8.0,  opacity: 0.80 },
  { left: "66%", top: "36%", size: 2.5, delay: 1.2,  dur: 10.0, opacity: 0.70 },
  { left: "71%", top: "84%", size: 2,   delay: 2.0,  dur: 9.6,  opacity: 0.63 },
  { left: "77%", top: "46%", size: 3.5, delay: 4.8,  dur: 7.7,  opacity: 0.82 },
  { left: "83%", top: "18%", size: 2.5, delay: 0.7,  dur: 11.0, opacity: 0.72 },
  { left: "89%", top: "74%", size: 2,   delay: 3.0,  dur: 8.5,  opacity: 0.65 },
  { left: "94%", top: "42%", size: 3,   delay: 1.6,  dur: 9.9,  opacity: 0.76 },
  { left: "98%", top: "18%", size: 1.5, delay: 5.5,  dur: 8.8,  opacity: 0.58 },
  { left: "6%",  top: "56%", size: 2.5, delay: 2.3,  dur: 10.3, opacity: 0.68 },
  { left: "26%", top: "92%", size: 2,   delay: 4.1,  dur: 7.3,  opacity: 0.62 },
  { left: "36%", top: "36%", size: 3,   delay: 0.5,  dur: 9.8,  opacity: 0.76 },
  { left: "58%", top: "62%", size: 2,   delay: 3.4,  dur: 8.2,  opacity: 0.65 },
  { left: "80%", top: "92%", size: 2.5, delay: 1.8,  dur: 10.7, opacity: 0.60 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function HeroSection({ content = {} }: HeroSectionProps) {
  const bgImage       = c(content, "hero_bg_image", "");
  const bgImageMobile = c(content, "hero_bg_image_mobile", "") || bgImage;
  const eyebrow   = c(content, "hero_eyebrow", "A New Signature Of");
  const line1     = c(content, "hero_title_line1", "Luxury in");
  const line2     = c(content, "hero_title_line2", "Every Note");
  const tagline   = c(content, "hero_tagline", "Discover rare ingredients, masterful blends, and timeless elegance.");
  const ctaLabel  = c(content, "hero_cta", "Explore Collection");
  const ctaHref   = c(content, "hero_cta_href", "/shop");

  const FEATURES = [
    { Icon: Sparkles, key: "feature1_label", def: "Premium Ingredients" },
    { Icon: Timer,    key: "feature2_label", def: "Long Lasting"        },
    { Icon: Landmark, key: "feature3_label", def: "Made in France"      },
    { Icon: Leaf,     key: "feature4_label", def: "Cruelty Free"        },
  ];

  return (
    <section className="overflow-hidden">

      {/* ══════════════════════════════════════════
          MOBILE  (hidden sm+)
          Layout: text → bottle image → features
      ══════════════════════════════════════════ */}
      <div className="sm:hidden relative flex flex-col">

        {/* Background base */}
        <div className="absolute inset-0 z-0" style={{ background: "var(--background)" }} />

        {/* Ambient gold scatter */}
        <div className="absolute pointer-events-none z-0"
          style={{ width: 500, height: 300, top: 0, left: "-10%",
            background: "radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.08) 0%, transparent 70%)",
            filter: "blur(50px)" }} />

        {/* Particles — first 18 only (performance) */}
        <motion.div className="absolute inset-0 pointer-events-none z-[2]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}>
          {PARTICLES.slice(0, 18).map((p, i) => (
            <motion.div key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size,
                background: "rgba(201,168,76,1)",
                boxShadow: `0 0 ${p.size * 5}px ${p.size * 2}px rgba(201,168,76,0.90), 0 0 ${p.size * 12}px rgba(201,168,76,0.40)` }}
              animate={{ y: [0, -32, 6, -20, 0], x: [0, 6, -5, 3, 0],
                opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.55, p.opacity, p.opacity * 0.4],
                scale: [1, 1.4, 0.85, 1.2, 1] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </motion.div>

        {/* 1 ── Text: centered at top */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pb-2"
          style={{ paddingTop: "calc(var(--banner-h) + 80px)" }}>

          <motion.span {...fadeUp(0.1)}
            className="block text-[9px] tracking-[0.48em] uppercase text-gold-primary/80 mb-3 font-medium">
            {eyebrow}
          </motion.span>

          <motion.h1 {...fadeUp(0.22)}
            className="font-display font-light mb-4" style={{ lineHeight: 1.04 }}>
            <span className="block text-text-primary"
              style={{ fontSize: "clamp(38px, 10.5vw, 56px)", letterSpacing: "0.015em" }}>
              {line1}
            </span>
            <span className="block font-display italic text-gold-shimmer"
              style={{ fontSize: "clamp(38px, 10.5vw, 56px)", letterSpacing: "0.015em" }}>
              {line2}
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.36)}
            className="text-text-secondary text-[12.5px] leading-relaxed mb-6 max-w-[260px]">
            {tagline}
          </motion.p>

          <motion.div {...fadeUp(0.50)}>
            <Link href={ctaHref} className="btn-gold-pill">
              {ctaLabel} <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* 2 ── Bottle image */}
        {bgImageMobile ? (
          <div className="relative z-0 w-full overflow-hidden" style={{ height: "48vw", minHeight: 170, maxHeight: 230 }}>
            <Image src={bgImageMobile} alt="" fill priority quality={85} sizes="100vw"
              className="object-cover object-center" />
            {/* Fade into background top */}
            <div className="absolute inset-x-0 top-0 h-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, var(--background) 0%, transparent 100%)" }} />
            {/* Fade into background bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to top, var(--background) 0%, transparent 100%)" }} />
          </div>
        ) : (
          /* No image: just a spacer with ambient glow */
          <div className="relative z-0 w-full" style={{ height: 280 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ width: 200, height: 200,
                background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
                filter: "blur(40px)" }} />
            </div>
          </div>
        )}

        {/* 3 ── Brand feature strip: 2×2 grid */}
        <div className="relative z-10 px-5 pt-3 pb-6">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}>
            <div className="grid grid-cols-2 gap-y-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(10,9,7,0.55)", backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)", border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              {FEATURES.map(({ Icon, key, def }) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(201,168,76,0.30)" }}>
                    <Icon size={12} strokeWidth={1.4} className="text-gold-primary" />
                  </div>
                  <span className="text-[11px] font-medium tracking-[0.04em] text-text-primary leading-none">
                    {c(content, key, def)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* ══════════════════════════════════════════
          DESKTOP  (hidden on mobile)
          Full-screen background image + overlay
      ══════════════════════════════════════════ */}
      <div className="hidden sm:flex flex-col relative min-h-screen overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 z-0" style={{ background: "var(--background)" }} />

        {/* Hero image */}
        {bgImage && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image src={bgImage} alt="" fill priority quality={90} sizes="100vw"
              className="object-cover object-center" />
            <div className="absolute inset-0" style={{
              background: [
                "radial-gradient(ellipse 75% 85% at 58% 50%, transparent 30%, rgba(10,9,7,0.72) 100%)",
                "linear-gradient(to bottom, rgba(10,9,7,0.55) 0%, transparent 18%, transparent 72%, rgba(10,9,7,0.80) 100%)",
                "linear-gradient(to right, rgba(10,9,7,0.50) 0%, transparent 55%)",
              ].join(", "),
            }} />
          </div>
        )}

        {/* Glow blobs */}
        <div className="absolute pointer-events-none z-0"
          style={{ width: 900, height: 900, top: "50%", right: "-4%", transform: "translateY(-50%)",
            background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(160,100,20,0.06) 38%, rgba(80,40,5,0.02) 65%, transparent 80%)",
            filter: "blur(90px)" }} />
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
          style={{ height: 180, background: "linear-gradient(to bottom, rgba(201,168,76,0.10) 0%, rgba(180,120,30,0.05) 40%, transparent 100%)" }} />
        <div className="absolute pointer-events-none z-0"
          style={{ width: 700, height: 400, top: "-10%", left: "-5%",
            background: "radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.08) 0%, rgba(160,100,20,0.04) 50%, transparent 80%)",
            filter: "blur(60px)" }} />
        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 130% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 z-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(10,9,7,0.6))" }} />

        {/* All particles — fade in as a group */}
        <motion.div className="absolute inset-0 pointer-events-none z-[2]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}>
          {PARTICLES.map((p, i) => (
            <motion.div key={i} className="absolute rounded-full pointer-events-none"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size,
                background: "rgba(201,168,76,1)",
                boxShadow: `0 0 ${p.size * 5}px ${p.size * 2}px rgba(201,168,76,0.90), 0 0 ${p.size * 12}px rgba(201,168,76,0.40)` }}
              animate={{ y: [0, -32, 6, -20, 0], x: [0, 6, -5, 3, 0],
                opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.55, p.opacity, p.opacity * 0.4],
                scale: [1, 1.4, 0.85, 1.2, 1] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center max-w-[1440px] mx-auto w-full px-8 lg:px-16 pt-28 pb-20">
          <div className="w-full max-w-2xl">
            <div className="relative z-10">
              <motion.span {...fadeUp(0.1)}
                className="block text-[9px] tracking-[0.48em] uppercase text-gold-primary/80 mb-5 font-medium">
                {eyebrow}
              </motion.span>

              <motion.h1 {...fadeUp(0.22)}
                className="font-display font-light mb-6" style={{ lineHeight: 1.04 }}>
                <span className="block text-text-primary"
                  style={{ fontSize: "clamp(50px, 6.2vw, 88px)", letterSpacing: "0.015em" }}>
                  {line1}
                </span>
                <span className="block font-display italic text-gold-shimmer"
                  style={{ fontSize: "clamp(50px, 6.2vw, 88px)", letterSpacing: "0.015em" }}>
                  {line2}
                </span>
              </motion.h1>

              <motion.p {...fadeUp(0.36)}
                className="text-text-secondary text-[13.5px] leading-relaxed mb-9 max-w-[300px]">
                {tagline}
              </motion.p>

              <motion.div {...fadeUp(0.50)}
                className="flex flex-row flex-wrap items-center gap-5">
                <Link href={ctaHref} className="btn-gold-pill">
                  {ctaLabel} <ArrowRight size={13} />
                </Link>
              </motion.div>

              {/* Feature strip — single-row pill */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.66, ease: [0.16, 1, 0.3, 1] as const }}
                className="mt-8" style={{ willChange: "transform, opacity" }}>
                <div className="inline-flex items-center px-5 py-3 rounded-full"
                  style={{ background: "rgba(10,9,7,0.55)", backdropFilter: "blur(20px) saturate(160%)",
                    WebkitBackdropFilter: "blur(20px) saturate(160%)", border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                    transform: "translateZ(0)" }}>
                  {FEATURES.map(({ Icon, key, def }, i) => (
                    <div key={key} className="flex items-center">
                      {i > 0 && <div className="w-px h-4 mx-4 shrink-0"
                        style={{ background: "rgba(255,255,255,0.14)" }} />}
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(201,168,76,0.30)" }}>
                          <Icon size={12} strokeWidth={1.4} className="text-gold-primary" />
                        </div>
                        <span className="text-[11px] font-medium tracking-[0.04em] text-text-primary leading-none whitespace-nowrap">
                          {c(content, key, def)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
          <span className="text-[7.5px] tracking-[0.45em] uppercase text-text-muted/70">
            {c(content, "hero_scroll_hint", "Scroll")}
          </span>
          <motion.div className="w-px h-8 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.65), transparent)" }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>

      </div>

    </section>
  );
}
