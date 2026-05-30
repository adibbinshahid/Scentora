"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Package, User, LogOut, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/profile", label: "Profile", icon: User, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-full lg:w-52 shrink-0">
      {/* User info */}
      <div className="mb-8 pb-6 border-b border-border-primary">
        <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border-gold flex items-center justify-center mb-3">
          <span className="font-display text-lg text-gold-primary">
            {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
          </span>
        </div>
        <p className="text-sm text-text-primary font-medium truncate">
          {session?.user?.name ?? "Guest"}
        </p>
        <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
      </div>

      {/* Nav */}
      <nav className="space-y-1 mb-8">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors",
              isActive(href, exact)
                ? "text-gold-primary bg-gold-primary/5 border-l-2 border-gold-primary"
                : "text-text-muted hover:text-text-secondary border-l-2 border-transparent"
            )}
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase text-text-muted hover:text-red-400 transition-colors w-full border-t border-border-primary pt-4"
      >
        <LogOut size={14} strokeWidth={1.5} />
        Sign Out
      </button>
    </aside>
  );
}
