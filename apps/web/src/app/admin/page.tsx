export const dynamic = "force-dynamic";
import { prisma } from "db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, ArrowRight, Clock } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-blue-400 bg-blue-400/10",
  SHIPPED: "text-purple-400 bg-purple-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  REFUNDED: "text-text-muted bg-bg-tertiary",
};

export default async function AdminDashboard() {
  const [orders, products, customers, recentOrders, lowStock] = await Promise.all([
    prisma.order.findMany({ select: { status: true, total: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.variant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);

  const paid = orders.filter((o) => !["CANCELLED", "REFUNDED", "PENDING"].includes(o.status));
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-gold-primary" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-blue-400" },
    { label: "Active Products", value: products, icon: Package, color: "text-purple-400" },
    { label: "Customers", value: customers, icon: Users, color: "text-green-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1" style={{ letterSpacing: "0.05em" }}>
          Dashboard
        </h1>
        <p className="text-sm text-text-muted">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel p-5">
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} strokeWidth={1.5} className={color} />
            </div>
            <p className="text-2xl font-display text-text-primary mb-1">{value}</p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 glass-panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
            <h2 className="text-sm font-medium text-text-primary tracking-wider uppercase">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-[10px] tracking-widest uppercase text-gold-primary hover:text-gold-light transition-colors">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {pending > 0 && (
            <div className="px-5 py-2 bg-yellow-400/5 border-b border-yellow-400/20">
              <span className="text-xs text-yellow-400 flex items-center gap-1.5">
                <Clock size={11} /> {pending} pending {pending === 1 ? "order" : "orders"} awaiting action
              </span>
            </div>
          )}
          <div className="divide-y divide-border-primary">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm text-text-primary">#{order.orderNumber}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 tracking-wider uppercase rounded-sm ${STATUS_STYLE[order.status] ?? ""}`}>
                    {order.status.toLowerCase()}
                  </span>
                  <span className="text-sm text-text-primary">{formatPrice(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="glass-panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
            <h2 className="text-sm font-medium text-text-primary tracking-wider uppercase">Low Stock</h2>
            <Link href="/admin/stock" className="flex items-center gap-1 text-[10px] tracking-widest uppercase text-gold-primary hover:text-gold-light transition-colors">
              Manage <ArrowRight size={11} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-5 py-6 text-sm text-text-muted">All stock levels healthy.</p>
          ) : (
            <div className="divide-y divide-border-primary">
              {lowStock.map((v) => (
                <Link
                  key={v.id}
                  href={`/admin/products/${v.productId}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div>
                    <p className="text-sm text-text-primary truncate max-w-[140px]">{v.product.name}</p>
                    <p className="text-xs text-text-muted">{v.size}</p>
                  </div>
                  <span className={`text-sm font-medium ${v.stock === 0 ? "text-red-400" : "text-amber-400"}`}>
                    {v.stock === 0 ? "Out" : `${v.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/products/new", label: "Add Product" },
          { href: "/admin/coupons", label: "New Coupon" },
          { href: "/admin/ads", label: "Manage Ads" },
          { href: "/admin/content", label: "Edit Content" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="glass-panel px-4 py-3 text-xs tracking-[0.15em] uppercase text-text-secondary hover:text-gold-primary hover:border-border-gold transition-all text-center"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
