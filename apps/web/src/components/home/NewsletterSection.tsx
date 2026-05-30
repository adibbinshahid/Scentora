"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Instagram, Facebook, X } from "lucide-react";
import toast from "react-hot-toast";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

/* Minimal Pinterest & TikTok SVG icons (lucide doesn't include them) */
function PinterestIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.135-1.867 3.135-4.562 0-2.387-1.715-4.054-4.163-4.054-2.834 0-4.497 2.126-4.497 4.322 0 .856.33 1.772.741 2.273a.3.3 0 0 1 .069.286c-.076.31-.244.995-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
    </svg>
  );
}

export default function NewsletterSection({ content = {} }: { content?: ContentMap }) {
  const SOCIAL = [
    { label: "Instagram", Icon: Instagram,     href: c(content, "footer_social_instagram", "#") },
    { label: "Facebook",  Icon: Facebook,      href: c(content, "footer_social_facebook",  "#") },
    { label: "Pinterest", Icon: PinterestIcon, href: c(content, "footer_social_pinterest", "#") },
    { label: "TikTok",    Icon: TikTokIcon,    href: c(content, "footer_social_tiktok",    "#") },
  ];
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [socialModal, setSocialModal] = useState(false);

  function handleSocialClick(e: React.MouseEvent) {
    e.preventDefault();
    setSocialModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="py-6 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel px-8 py-8 lg:px-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            {/* Left: heading + desc */}
            <div>
              <h2
                className="font-display font-light text-2xl sm:text-3xl text-text-primary mb-2.5"
                style={{ letterSpacing: "0.04em" }}
              >
                {c(content, "newsletter_title", "Stay Inspired")}
              </h2>
              <p className="text-[12px] text-text-muted leading-relaxed max-w-[240px]">
                {c(content, "newsletter_body", "Join our exclusive list for early access, new arrivals, and special offers.")}
              </p>
            </div>

            {/* Center: email form */}
            <div className="flex justify-center">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-1.5"
                >
                  <p className="text-[11px] tracking-[0.18em] uppercase text-gold-primary">Demo Website</p>
                  <p className="text-[12px] text-text-muted leading-relaxed max-w-xs">
                    No data has been recorded. This is a demonstration website — subscriptions are disabled.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full max-w-sm"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={c(content, "newsletter_placeholder", "Enter your email")}
                    className="flex-1 px-5 py-3 bg-bg-tertiary border border-border-primary text-text-primary text-[12px] placeholder:text-text-muted outline-none focus:border-border-gold transition-colors rounded-l-full"
                  />
                  <button
                    type="submit"
                    className="btn-gold-pill rounded-l-none rounded-r-full px-6 py-3 text-[10px]"
                    style={{ borderRadius: "0 100px 100px 0" }}
                  >
                    {c(content, "newsletter_cta", "Subscribe")}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Follow Us + social icons */}
            <div className="flex flex-col items-start lg:items-end gap-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-text-muted">Follow Us</span>
              <div className="flex items-center gap-3">
                {SOCIAL.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={handleSocialClick}
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-gold-primary transition-all duration-300 hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Social disabled modal */}
      <AnimatePresence>
        {socialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[99998] flex items-center justify-center px-6"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
            onClick={() => setSocialModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative max-w-sm w-full p-8 text-center"
              style={{
                background: "rgba(14,12,9,0.97)",
                border: "1px solid rgba(201,168,76,0.25)",
                borderRadius: 16,
                boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSocialModal(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X size={16} strokeWidth={1.8} />
              </button>

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.28)" }}
              >
                <Instagram size={16} className="text-gold-primary" />
              </div>

              <p className="text-text-primary font-display text-lg mb-3" style={{ letterSpacing: "0.03em" }}>
                Social Media Disabled
              </p>
              <p className="text-text-muted text-[13px] leading-relaxed">
                This is a demonstration website. Social media redirection is currently disabled but can be integrated.
              </p>

              <button
                onClick={() => setSocialModal(false)}
                className="mt-6 px-6 py-2.5 text-[10px] tracking-[0.22em] uppercase font-medium transition-colors"
                style={{
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.30)",
                  color: "rgba(201,168,76,0.9)",
                  borderRadius: 8,
                }}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
