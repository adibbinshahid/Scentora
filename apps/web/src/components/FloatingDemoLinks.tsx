"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingDemoLinks() {
  const [bottomOffset, setBottomOffset] = useState(24);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBottomOffset(entry.intersectionRect.height + 16);
        } else {
          setBottomOffset(24);
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const pill: React.CSSProperties = {
    background: "rgba(238,232,218,0.92)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.80)",
    borderRadius: 999,
    boxShadow: "0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.90) inset",
  };

  return (
    <div
      className="fixed left-4 sm:left-6 z-[9985] flex flex-col gap-2.5"
      style={{ bottom: bottomOffset }}
    >
      {/* Admin Panel */}
      <a
        href="https://scentora-beryl.vercel.app/login?callbackUrl=/admin"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 pl-2 pr-4 py-2 transition-all duration-250 hover:scale-[1.03] hover:shadow-lg"
        style={pill}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: "rgba(201,168,76,0.90)",
            boxShadow: "0 2px 8px rgba(201,168,76,0.45)",
          }}
        >
          <ShieldCheck size={17} strokeWidth={1.7} style={{ color: "#fff" }} />
        </div>
        <div className="min-w-0">
          <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)", lineHeight: 1.2, fontWeight: 700 }}>
            Experience the
          </p>
          <p style={{ fontSize: 13, fontWeight: 800, color: "rgba(0,0,0,0.88)", lineHeight: 1.3, letterSpacing: "0.01em" }}>
            Admin Panel
          </p>
        </div>
        <ArrowRight
          size={13}
          strokeWidth={2}
          className="ml-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform duration-200"
          style={{ color: "rgba(0,0,0,0.40)" }}
        />
      </a>
    </div>
  );
}
