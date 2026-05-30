"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "For Her",
    sub: "Explore Now",
    href: "/shop?gender=FEMALE",
    gradient: "linear-gradient(145deg, #1A0814 0%, #3D1530 55%, #6B2248 80%, #1A0814 100%)",
    glow: "rgba(180,60,100,0.30)",
  },
  {
    label: "For Him",
    sub: "Explore Now",
    href: "/shop?gender=MALE",
    gradient: "linear-gradient(145deg, #080A14 0%, #101830 55%, #1E2E58 80%, #080A14 100%)",
    glow: "rgba(40,60,180,0.25)",
  },
  {
    label: "Unisex",
    sub: "Explore Now",
    href: "/shop?gender=UNISEX",
    gradient: "linear-gradient(145deg, #0D0A00 0%, #2A2000 55%, #5C4400 80%, #0D0A00 100%)",
    glow: "rgba(201,168,76,0.28)",
  },
  {
    label: "Discovery Sets",
    sub: "Explore Now",
    href: "/shop?category=discovery",
    gradient: "linear-gradient(145deg, #090D0A 0%, #142014 55%, #254025 80%, #090D0A 100%)",
    glow: "rgba(40,140,60,0.22)",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex items-center justify-between mb-10"
      >
        <h2 className="font-display font-light text-3xl sm:text-4xl text-text-primary" style={{ letterSpacing: "0.04em" }}>
          Shop by Category
        </h2>
        <Link href="/shop" className="group hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-gold-primary transition-colors">
          View All
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(({ label, sub, href, gradient, glow }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Link href={href} className="group block relative overflow-hidden aspect-[3/4] rounded-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0" style={{ background: gradient }} />

              {/* Inner glow */}
              <div
                className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${glow} 0%, transparent 70%)` }}
              />

              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(201,168,76,0.05) 100%)" }}
              />

              {/* Glass border */}
              <div className="absolute inset-0 rounded-2xl border border-white/[0.07] group-hover:border-gold-primary/20 transition-colors duration-300" />

              {/* Text */}
              <div className="absolute top-5 left-5 right-5">
                <h3 className="font-display text-xl sm:text-2xl text-text-primary mb-1" style={{ letterSpacing: "0.04em" }}>
                  {label}
                </h3>
                <p className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gold-primary group-hover:gap-2.5 transition-all duration-300">
                  {sub}
                  <ArrowRight size={10} />
                </p>
              </div>

              {/* Decorative SP monogram bottom-right */}
              <div
                className="absolute bottom-4 right-4 font-display pointer-events-none select-none"
                style={{ fontSize: 64, color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "0.05em" }}
              >
                SP
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
