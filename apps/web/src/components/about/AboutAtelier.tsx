"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

export default function AboutAtelier({ content = {} }: { content?: ContentMap }) {
  const bgImage = c(content, "about_atelier_image", "");

  const contactItems = [
    {
      icon: <MapPin size={14} className="text-gold-primary shrink-0 mt-0.5" />,
      label: "Address",
      lines: [
        c(content, "about_atelier_address", "12 Rue du Faubourg Saint-Honoré"),
        c(content, "about_atelier_city",    "75008 Paris, France"),
      ],
    },
    {
      icon: <Clock size={14} className="text-gold-primary shrink-0 mt-0.5" />,
      label: "Hours",
      lines: [c(content, "about_atelier_hours", "Monday–Saturday: 10h–19h")],
    },
    {
      icon: <Mail size={14} className="text-gold-primary shrink-0 mt-0.5" />,
      label: "Email",
      lines: [c(content, "about_atelier_email", "demo@demo.com")],
    },
    {
      icon: <Phone size={14} className="text-gold-primary shrink-0 mt-0.5" />,
      label: "Phone",
      lines: [c(content, "about_atelier_phone", "+33 1 42 00 00 00")],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 90% 80%, rgba(201,168,76,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <span className="block text-[10px] tracking-[0.45em] uppercase text-gold-primary mb-4">
              {c(content, "about_atelier_eyebrow", "Visit Us")}
            </span>
            <h2
              className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-6 leading-tight"
              style={{ letterSpacing: "0.04em" }}
            >
              {c(content, "about_atelier_title", "Our Atelier")}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-md">
              {c(
                content,
                "about_atelier_body",
                "Step into our Paris atelier for an immersive private consultation. Our specialists will guide you through the collection, help you discover your signature, or compose a bespoke blend created entirely around you."
              )}
            </p>

            {/* Contact grid */}
            <div className="space-y-5">
              {contactItems.map(({ icon, label, lines }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 px-5 py-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {icon}
                  <div>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-text-muted mb-1">
                      {label}
                    </p>
                    {lines.map((line) => (
                      <p key={line} className="text-[13px] text-text-primary leading-snug">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {bgImage ? (
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <img
                  src={bgImage}
                  alt="Scentora Atelier"
                  className="w-full object-cover"
                  style={{ aspectRatio: "3/2" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,9,7,0.50) 0%, transparent 55%)",
                  }}
                />
              </div>
            ) : (
              <div
                className="relative overflow-hidden rounded-2xl flex items-center justify-center"
                style={{
                  aspectRatio: "3/2",
                  background:
                    "linear-gradient(145deg, rgba(20,15,10,0.95) 0%, rgba(10,9,7,1) 100%)",
                  border: "1px solid rgba(201,168,76,0.18)",
                }}
              >
                {/* Decorative floor plan pattern */}
                <div
                  className="absolute inset-8 rounded-xl"
                  style={{ border: "1px solid rgba(201,168,76,0.10)" }}
                />
                <div
                  className="absolute inset-16 rounded-lg"
                  style={{ border: "1px solid rgba(201,168,76,0.07)" }}
                />
                <div className="relative z-10 text-center">
                  <div
                    className="font-display text-5xl text-gold-primary/15 mb-3"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    SP
                  </div>
                  <p className="text-[9px] tracking-[0.35em] uppercase text-text-muted">
                    Paris Atelier
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
