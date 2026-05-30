import Link from "next/link";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";

export default function Footer({ content = {} }: { content?: ContentMap }) {
  const copyright = c(
    content,
    "footer_copyright",
    `© ${new Date().getFullYear()} Scentora Perfumes. All rights reserved.`,
  );

  return (
    <footer
      className="border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(10,9,7,0.70)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left: copyright */}
          <p className="text-[10px] text-text-muted">
            {copyright}
          </p>

          {/* Center: SP monogram + optional brand desc */}
          <div className="flex flex-col items-center gap-1 order-first sm:order-none">
            <span
              className="font-display text-gold-primary/40 font-light"
              style={{ fontSize: 32, letterSpacing: "0.08em", lineHeight: 1 }}
            >
              SP
            </span>
            {c(content, "footer_brand_desc", "") && (
              <p className="text-[9px] text-text-muted text-center max-w-[220px] leading-relaxed italic">
                {c(content, "footer_brand_desc", "")}
              </p>
            )}
          </div>

          {/* Right: legal links */}
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
