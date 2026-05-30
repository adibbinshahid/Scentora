"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Search, Menu, X, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";
import { useSession } from "next-auth/react";
import type { ContentMap } from "@/lib/content-helpers";
import { c } from "@/lib/content-helpers";
import { useState } from "react";

export default function Navbar({ content = {} }: { content?: ContentMap }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileMenuOpen, setMobileMenuOpen, setCartOpen } = useUIStore();
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const { data: session } = useSession();
  const brandName = c(content, "global_brand_name", "Scentora");

  const NAV_LINKS = [
    { href: c(content, "nav_link1_href", "/"),      label: c(content, "nav_link1_label", "Home")     },
    { href: c(content, "nav_link2_href", "/shop"),  label: c(content, "nav_link2_label", "Collections") },
    { href: c(content, "nav_link3_href", "/about"), label: c(content, "nav_link3_label", "About Us") },
  ];
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchSubmit() {
    if (!searchQuery.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function isActive(href: string) {
    if (href.includes("?")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  return (
    /*
     * backdrop-filter MUST live on the position:fixed element itself.
     * Putting it on a child of a fixed element causes compositing against
     * the stacking context, not the page scroll layer — blur won't show.
     */
    <header
      className="fixed left-0 right-0 z-50"
      style={{
        top:                    "var(--banner-h)",
        backdropFilter:         "blur(20px) saturate(180%) brightness(1.04)",
        WebkitBackdropFilter:   "blur(20px) saturate(180%) brightness(1.04)",
        background:             "rgba(10,9,7,0.38)",
        borderBottom:           "1px solid rgba(255,255,255,0.08)",
        boxShadow:              "0 1px 0 rgba(201,168,76,0.10), 0 4px 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* Inner pill — layout only, no backdrop-filter */}
      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0 mr-2 py-2">
          <Image
            src="/logo.png"
            alt={brandName}
            width={190}
            height={95}
            className="object-contain w-[140px] sm:w-[190px]"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.6) saturate(1.2) drop-shadow(0 0 10px rgba(201,168,76,0.55))",
            }}
            priority
          />
        </Link>

        {/* Nav links — center */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`nav-link${isActive(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: search + icons */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden sm:flex items-center">
            {searchOpen ? (
              <form
                onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}
                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(201,168,76,0.30)",
                }}
              >
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery.trim()) setSearchOpen(false); }}
                  placeholder="Search perfumes…"
                  className="bg-transparent text-text-primary text-[11px] outline-none placeholder:text-text-muted w-36"
                />
                <button type="submit" aria-label="Submit search">
                  <Search size={13} strokeWidth={1.5} className="text-text-muted shrink-0 hover:text-gold-primary transition-colors" />
                </button>
              </form>
            ) : (
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <Search size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <Link
            href={session ? "/account" : "/login"}
            aria-label="Account"
            className="hidden sm:block text-text-secondary hover:text-text-primary transition-colors"
          >
            <User size={16} strokeWidth={1.5} />
          </Link>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hidden sm:block text-text-secondary hover:text-text-primary transition-colors"
          >
            <Heart size={16} strokeWidth={1.5} />
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="relative text-text-secondary hover:text-text-primary transition-colors"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-[17px] h-[17px] bg-gold-primary text-bg-primary text-[8px] font-semibold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden py-5 px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2.5 mb-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Search size={13} strokeWidth={1.5} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search perfumes…"
              className="bg-transparent text-text-primary text-[12px] outline-none placeholder:text-text-muted flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  router.push(`/shop?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
                  setMobileMenuOpen(false);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            {[
              ...NAV_LINKS,
              { href: "/wishlist",                     label: "Wishlist"                      },
              { href: session ? "/account" : "/login", label: session ? "Account" : "Sign In" },
            ].map(({ href, label }) => (
              <Link
                key={href + label}
                href={href}
                className="text-sm tracking-[0.18em] uppercase text-text-secondary hover:text-gold-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
