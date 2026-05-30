"use client";

import { motion } from "framer-motion";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

const INGREDIENT_DEFAULTS = [
  {
    name:    "Laotian Oud",
    origin:  "Laos, Southeast Asia",
    desc:    "Harvested from centuries-old Aquilaria trees in the forests of Laos. Our oud is rich, animalic, and deeply resinous — the backbone of our most celebrated signatures.",
    symbol:  "◈",
  },
  {
    name:    "Bulgarian Rose Absolute",
    origin:  "Rose Valley, Bulgaria",
    desc:    "Distilled by hand during the brief May harvest window. A single kilogram requires five tonnes of petals — its honeyed depth is irreplaceable in fine perfumery.",
    symbol:  "◎",
  },
  {
    name:    "Mysore Sandalwood",
    origin:  "Karnataka, India",
    desc:    "The gold standard of sandalwood — soft, milky, and endlessly warm. Each source is certified sustainable, respecting both the tree and the communities that tend it.",
    symbol:  "✦",
  },
  {
    name:    "Tahitian Vanilla",
    origin:  "French Polynesia",
    desc:    "From the rare Vanilla tahitensis orchid, this extract carries floral, anise, and cherry nuances absent in any other vanilla — voluptuous and entirely its own.",
    symbol:  "❋",
  },
];

export default function AboutIngredients({ content = {} }: { content?: ContentMap }) {
  const bgImage = c(content, "about_ingredients_image", "");

  const ingredients = INGREDIENT_DEFAULTS.map((def, i) => ({
    name:   c(content, `about_ingredient${i + 1}_name`,   def.name),
    origin: c(content, `about_ingredient${i + 1}_origin`, def.origin),
    desc:   c(content, `about_ingredient${i + 1}_desc`,   def.desc),
    symbol: def.symbol,
  }));

  return (
    <section id="ingredients" className="relative py-24 overflow-hidden">
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 15% 60%, rgba(201,168,76,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16"
        >
          <span className="block text-[10px] tracking-[0.45em] uppercase text-gold-primary mb-4">
            {c(content, "about_ingredients_eyebrow", "The Source")}
          </span>
          <h2
            className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-5 max-w-xl leading-tight"
            style={{ letterSpacing: "0.04em" }}
          >
            {c(content, "about_ingredients_title", "Where Every Note Begins")}
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl">
            {c(
              content,
              "about_ingredients_body",
              "We travel the world for singular raw materials. Not compromises — the finest version of each ingredient, sourced with full traceability and respect for the hands that harvest them."
            )}
          </p>
        </motion.div>

        {/* Two-column: ingredient cards + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Ingredient cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ingredients.map(({ name, origin, desc, symbol }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.10, ease: [0.16, 1, 0.3, 1] as const }}
                className="glass-panel p-6"
              >
                <div
                  className="text-2xl mb-4 leading-none"
                  style={{ color: "rgba(201,168,76,0.60)" }}
                >
                  {symbol}
                </div>
                <h3
                  className="font-display text-[18px] text-text-primary mb-1 leading-snug"
                  style={{ letterSpacing: "0.03em" }}
                >
                  {name}
                </h3>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase text-gold-primary mb-3"
                >
                  {origin}
                </p>
                <p className="text-[12px] text-text-muted leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Image or decorative element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="sticky top-28"
          >
            {bgImage ? (
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <img
                  src={bgImage}
                  alt="Our Ingredients"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/5" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,9,7,0.60) 0%, transparent 50%)",
                  }}
                />
              </div>
            ) : (
              /* Decorative placeholder when no image set */
              <div
                className="relative overflow-hidden rounded-2xl flex items-center justify-center"
                style={{
                  aspectRatio: "4/5",
                  background:
                    "linear-gradient(145deg, rgba(201,168,76,0.08) 0%, rgba(10,9,7,0.90) 60%)",
                  border: "1px solid rgba(201,168,76,0.18)",
                }}
              >
                {/* Decorative concentric rings */}
                {[160, 220, 280, 340].map((size) => (
                  <div
                    key={size}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      border: "1px solid rgba(201,168,76,0.12)",
                    }}
                  />
                ))}
                <div className="relative z-10 text-center px-8">
                  <div
                    className="font-display text-6xl text-gold-primary/20 leading-none mb-4"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    SP
                  </div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted">
                    Rare Ingredients
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
