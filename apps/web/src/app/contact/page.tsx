"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "demo@demo.com",
    href: "mailto:demo@demo.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "221 Lake Street, Demo, Demo.",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat, 10 am – 7 pm CET",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-14 text-center"
          >
            <p className="text-[9px] tracking-[0.35em] uppercase text-gold-primary mb-4">Get in Touch</p>
            <h1 className="font-display font-light text-4xl text-text-primary mb-4" style={{ letterSpacing: "0.06em" }}>
              Contact Us
            </h1>
            <p className="text-[13px] text-text-muted max-w-sm mx-auto leading-relaxed">
              We'd love to hear from you. Reach out with questions, wholesale enquiries, or just to talk about fragrance.
            </p>
            <div className="mt-8 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)" }} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              {INFO.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(201,168,76,0.10)", border: "1px solid rgba(201,168,76,0.20)" }}
                  >
                    <Icon size={14} strokeWidth={1.5} className="text-gold-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.18em] uppercase text-text-muted mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-[13px] text-text-secondary hover:text-gold-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[13px] text-text-secondary">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:col-span-3"
            >
              <div
                className="p-7 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.28)" }}
                    >
                      <Send size={20} className="text-gold-primary" strokeWidth={1.4} />
                    </div>
                    <p className="font-display text-xl text-text-primary">Demo Website</p>
                    <p className="text-[12px] text-text-muted max-w-xs leading-relaxed"
                      style={{ border: "1px solid rgba(201,168,76,0.18)", borderRadius: 10, padding: "12px 16px", background: "rgba(201,168,76,0.05)" }}
                    >
                      No data has been recorded. This is a demonstration website — form submissions are disabled.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-2 text-[10px] tracking-[0.18em] uppercase text-gold-primary hover:text-gold-light transition-colors"
                    >
                      Back to form
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[9px] tracking-[0.18em] uppercase text-text-muted mb-2">Name</label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full bg-transparent text-text-primary text-[12px] outline-none placeholder:text-text-muted px-4 py-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-[0.18em] uppercase text-text-muted mb-2">Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full bg-transparent text-text-primary text-[12px] outline-none placeholder:text-text-muted px-4 py-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] tracking-[0.18em] uppercase text-text-muted mb-2">Subject</label>
                      <input
                        required
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="What's this about?"
                        className="w-full bg-transparent text-text-primary text-[12px] outline-none placeholder:text-text-muted px-4 py-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] tracking-[0.18em] uppercase text-text-muted mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us more…"
                        className="w-full bg-transparent text-text-primary text-[12px] outline-none placeholder:text-text-muted px-4 py-3 rounded-xl resize-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.22em] uppercase font-medium rounded-xl transition-all duration-300 disabled:opacity-60"
                      style={{ background: "rgba(201,168,76,1)", color: "#0F0D0A" }}
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <Send size={12} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
    </main>
  );
}
