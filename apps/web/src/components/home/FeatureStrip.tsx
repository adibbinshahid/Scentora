"use client";

import { motion } from "framer-motion";
import { Sparkles, Timer, Landmark, Leaf } from "lucide-react";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

const FEATURE_ICONS = [Sparkles, Timer, Landmark, Leaf];
const FEATURE_KEYS  = ["feature1_label", "feature2_label", "feature3_label", "feature4_label"];
const FEATURE_DEFS  = ["Premium Ingredients", "Long Lasting", "Made in France", "Cruelty Free"];

export default function FeatureStrip({ content = {} }: { content?: ContentMap }) {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
        className="flex items-center justify-around px-4 py-5 rounded-2xl"
        style={{
          background: "rgba(10,9,7,0.82)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {FEATURE_ICONS.map((Icon, i) => (
          <div key={i} className="flex items-center">
            {/* Vertical divider — between items, hidden on mobile */}
            {i > 0 && (
              <div
                className="hidden sm:block self-stretch w-px mx-6 lg:mx-10"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
            )}

            {/* Feature item */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex items-center gap-3.5"
            >
              {/* Icon circle */}
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(201,168,76,0.28)",
                  boxShadow: "0 0 20px rgba(201,168,76,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <Icon size={18} strokeWidth={1.4} className="text-gold-primary" />
              </div>

              {/* Label */}
              <span
                className="text-[12px] font-medium text-text-primary leading-snug max-w-[72px] sm:max-w-none"
              >
                {c(content, FEATURE_KEYS[i], FEATURE_DEFS[i])}
              </span>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
