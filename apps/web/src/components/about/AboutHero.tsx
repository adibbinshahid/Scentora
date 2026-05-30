"use client";

import { motion } from "framer-motion";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

export default function AboutHero({ content = {} }: { content?: ContentMap }) {
  const bgImage = c(content, "about_hero_bg_image", "");

  return (
    <section
      className="relative flex items-end min-h-[72vh] overflow-hidden pt-24"
      style={{
        background: bgImage
          ? `url(${bgImage}) center/cover no-repeat`
          : "transparent",
      }}
    >
      {/* Dark cinematic overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: bgImage
            ? "linear-gradient(to top, rgba(10,9,7,0.96) 0%, rgba(10,9,7,0.55) 50%, rgba(10,9,7,0.30) 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(201,168,76,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Ambient top glow (same trick as hero) */}
      <div
        className="absolute inset-x-0 top-0 h-[160px] pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(201,168,76,0.06) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="h-px w-10"
              style={{ background: "rgba(201,168,76,0.55)" }}
            />
            <span className="text-[10px] tracking-[0.45em] uppercase text-gold-primary">
              {c(content, "about_hero_eyebrow", "The Maison")}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-light text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-[1.05] mb-6"
            style={{ letterSpacing: "0.04em" }}
          >
            {c(content, "about_hero_title", "A story told\nin scent")}
          </h1>

          {/* Subtitle */}
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
            {c(
              content,
              "about_hero_subtitle",
              "Born from a singular obsession — that fragrance is the only art form that speaks without language. Every bottle holds a conversation your words never could."
            )}
          </p>
        </motion.div>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-10 origin-left"
        >
          <div className="rule-gold" />
        </motion.div>
      </div>
    </section>
  );
}
