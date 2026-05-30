import { auth } from "@/lib/auth";
import { prisma } from "db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, Star } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-blue-400 bg-blue-400/10",
  SHIPPED: "text-purple-400 bg-purple-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  REFUNDED: "text-text-muted bg-bg-tertiary",
};

export default async function AccountOverviewPage() {
  const session = await auth();
  const userId = (session!.user as any).id as string;

  const [orders, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);

  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package },
    { label: "Total Spent", value: formatPrice(totalSpent), icon: ShoppingBag },
    { label: "Wishlist Items", value: wishlistCount, icon: Star },
  ];

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-panel p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-border-gold flex items-center justify-center shrink-0">
              <Icon size={16} className="text-gold-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-display text-text-primary">{value}</p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-text-muted mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-text-primary" style={{ letterSpacing: "0.05em" }}>
            Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="group flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-text-muted hover:text-gold-primary transition-colors"
            >
              View all
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="glass-panel p-10 text-center">
            <Package size={32} className="text-text-muted mx-auto mb-3" strokeWidth={1} />
            <p className="font-display text-lg text-text-secondary mb-1">No orders yet</p>
            <p className="text-sm text-text-muted mb-6">
              Your order history will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
            >
              Start Shopping
              <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-text-primary font-medium">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase rounded-sm ${
                      STATUS_STYLES[order.status] ?? "text-text-muted bg-bg-tertiary"
                    }`}
                  >
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                  <span className="text-sm text-text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/profile"
          className="group glass-panel p-5 flex items-center justify-between hover:border-border-gold transition-colors"
        >
          <div>
            <p className="text-sm text-text-primary mb-1">Profile Settings</p>
            <p className="text-xs text-text-muted">Update name and password</p>
          </div>
          <ArrowRight
            size={16}
            className="text-text-muted group-hover:text-gold-primary group-hover:translate-x-1 transition-all"
          />
        </Link>
        <Link
          href="/shop"
          className="group glass-panel p-5 flex items-center justify-between hover:border-border-gold transition-colors"
        >
          <div>
            <p className="text-sm text-text-primary mb-1">Continue Shopping</p>
            <p className="text-xs text-text-muted">Browse all fragrances</p>
          </div>
          <ArrowRight
            size={16}
            className="text-text-muted group-hover:text-gold-primary group-hover:translate-x-1 transition-all"
          />
        </Link>
      </div>
    </div>
  );
}
