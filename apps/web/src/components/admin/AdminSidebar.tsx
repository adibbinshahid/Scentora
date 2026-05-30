"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Layers,
  BarChart2, FileText, Megaphone, TrendingUp, LogOut, ChevronRight, X, Menu, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/admin/stock", label: "Stock", icon: Layers, exact: false },
  { href: "/admin/coupons", label: "Coupons & Discounts", icon: Tag, exact: false },
  { href: "/admin/ads", label: "Scroll Ads", icon: Megaphone, exact: false },
  { href: "/admin/content", label: "Content", icon: FileText, exact: false },
  { href: "/admin/revenue", label: "Revenue", icon: TrendingUp, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border-primary flex items-center justify-between">
        <div>
          <Image
            src="/logo.png"
            alt="Scentora"
            width={100}
            height={50}
            className="object-contain"
            style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 4px rgba(201,168,76,0.25))" }}
          />
          <span className="text-[9px] tracking-[0.25em] uppercase text-text-muted block mt-2">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-text-muted hover:text-text-primary"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs tracking-[0.1em] uppercase transition-all group",
                active
                  ? "bg-gold-primary/10 text-gold-primary border-l-2 border-gold-primary"
                  : "text-text-muted hover:text-text-secondary hover:bg-white/[0.02] border-l-2 border-transparent"
              )}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={12} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border-primary">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.1em] uppercase text-text-muted hover:text-text-secondary transition-colors mb-1"
        >
          <BarChart2 size={14} strokeWidth={1.5} />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.1em] uppercase text-text-muted hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed left-4 z-50 w-9 h-9 flex items-center justify-center bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary transition-colors" style={{ top: "calc(var(--banner-h) + 6px)" }}
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40" style={{ top: "var(--banner-h)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed left-0 bottom-0 w-60 bg-bg-secondary border-r border-border-primary z-50 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ top: "var(--banner-h)" }}
      >
        {content}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 fixed left-0 bottom-0 bg-bg-secondary border-r border-border-primary z-30" style={{ top: "var(--banner-h)" }}>
        {content}
      </div>
    </>
  );
}
