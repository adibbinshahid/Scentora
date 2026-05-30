"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

export default function BrandStory({ content = {} }: { content?: ContentMap }) {
  const pillars = [
    {
      number: c(content, "story_pillar1_number", "01"),
      title: c(content, "story_pillar1_title", "Rare Ingredients"),
      description: c(content, "story_pillar1_desc", "We source the finest raw materials — Laotian oud, Bulgarian rose absolute, Mysore sandalwood — from trusted harvesters who share our reverence for nature."),
    },
    {
      number: c(content, "story_pillar2_number", "02"),
      title: c(content, "story_pillar2_title", "Master Perfumers"),
      description: c(content, "story_pillar2_desc", "Each Scentora creation is a collaboration between our in-house perfumers and legendary noses from Grasse, refined over months of meticulous iteration."),
    },
    {
      number: c(content, "story_pillar3_number", "03"),
      title: c(content, "story_pillar3_title", "Enduring Luxury"),
      description: c(content, "story_pillar3_desc", "From the hand-lacquered flacons to the bespoke atomizers, every object we create is designed to be inherited, not discarded."),
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-bg-secondary border-y border-border-primary">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}>
            {/* Brand story image — shown when set in admin */}
            {c(content, "story_image", "") && (
              <div
                className="mb-8 overflow-hidden rounded-2xl"
                style={{ border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <img
                  src={c(content, "story_image", "")}
                  alt="Brand Story"
                  className="w-full object-cover"
                  style={{ maxHeight: 280 }}
                />
              </div>
            )}
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-4">
              {c(content, "story_eyebrow", "The Maison")}
            </span>
            <h2 className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-6 leading-tight" style={{ letterSpacing: "0.04em" }}>
              {c(content, "story_title", "Born in the space between darkness and gold.")}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-6 max-w-md">
              {c(content, "story_body1", "Scentora was founded on a singular obsession: the belief that scent is the most intimate art form. Not seen, not heard — felt. A fragrance should alter the room the moment you enter it.")}
            </p>
            <p className="text-text-muted text-sm leading-relaxed mb-10 max-w-md">
              {c(content, "story_body2", "From our atelier in Paris, every blend begins with a single emotion and is refined until it can communicate that emotion to a stranger without a single word.")}
            </p>
            <Link href={c(content, "story_cta_href", "/about")} className="group inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-gold-primary hover:text-gold-light transition-colors">
              {c(content, "story_cta", "Discover our story")}
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="space-y-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
                className="flex gap-6 glass-panel p-6"
              >
                <span className="font-display text-3xl text-gold-muted shrink-0 leading-none mt-1" style={{ letterSpacing: "0.05em" }}>
                  {pillar.number}
                </span>
                <div>
                  <h3 className="font-display text-lg text-text-primary mb-2">{pillar.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
