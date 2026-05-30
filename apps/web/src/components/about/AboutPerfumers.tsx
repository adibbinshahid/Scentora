"use client";

import { motion } from "framer-motion";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

const PERFUMER_DEFAULTS = [
  {
    name:  "Jean-Michel Dubois",
    role:  "Master Perfumer, Grasse",
    bio:   "With three decades crafting for the world's most storied houses, Jean-Michel brings an obsessive precision to Scentora's oud-forward compositions. He once spent seven months reworking a single base note.",
    initials: "JD",
  },
  {
    name:  "Sophia Karim",
    role:  "Head of Olfactive Creation",
    bio:   "A graduate of ISIPCA Versailles and a former nose at Givaudan, Sophia brings a modern sensibility to ancient materials. Her florals are architectural — never sweet, always inevitable.",
    initials: "SK",
  },
];

export default function AboutPerfumers({ content = {} }: { content?: ContentMap }) {
  const perfumers = PERFUMER_DEFAULTS.map((def, i) => ({
    name:     c(content, `about_perfumer${i + 1}_name`,  def.name),
    role:     c(content, `about_perfumer${i + 1}_role`,  def.role),
    bio:      c(content, `about_perfumer${i + 1}_bio`,   def.bio),
    image:    c(content, `about_perfumer${i + 1}_image`, ""),
    initials: def.initials,
  }));

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background: "rgba(13,11,8,0.85)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-16"
        >
          <span className="block text-[10px] tracking-[0.45em] uppercase text-gold-primary mb-4">
            {c(content, "about_perfumers_eyebrow", "The Noses")}
          </span>
          <h2
            className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-5 leading-tight"
            style={{ letterSpacing: "0.04em" }}
          >
            {c(content, "about_perfumers_title", "Masters of Their Craft")}
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-xl mx-auto">
            {c(
              content,
              "about_perfumers_body",
              "Our perfumers are not alchemists of trend — they are composers of permanence. Each Scentora creation is refined across hundreds of iterations until it says precisely what it was meant to say."
            )}
          </p>
        </motion.div>

        {/* Perfumer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {perfumers.map(({ name, role, bio, image, initials }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="glass-panel-gold p-8 flex flex-col items-center text-center"
            >
              {/* Portrait */}
              {image ? (
                <div
                  className="w-24 h-24 rounded-full overflow-hidden mb-6 shrink-0"
                  style={{ border: "2px solid rgba(201,168,76,0.35)" }}
                >
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(140,90,20,0.12) 100%)",
                    border: "2px solid rgba(201,168,76,0.30)",
                  }}
                >
                  <span
                    className="font-display text-xl text-gold-primary/70"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {initials}
                  </span>
                </div>
              )}

              {/* Info */}
              <h3
                className="font-display text-2xl text-text-primary mb-1"
                style={{ letterSpacing: "0.03em" }}
              >
                {name}
              </h3>
              <p className="text-[9px] tracking-[0.28em] uppercase text-gold-primary mb-5">
                {role}
              </p>
              <p className="text-[13px] text-text-muted leading-relaxed">
                {bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
