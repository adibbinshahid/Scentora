export const dynamic = "force-dynamic";
import { prisma } from "db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  PROCESSING: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  SHIPPED: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  DELIVERED: "text-green-400 bg-green-400/10 border-green-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
  REFUNDED: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

type SearchParams = Promise<{ status?: string; page?: string }>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status, page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const limit = 20;

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Orders</h1>
        <p className="text-sm text-text-muted mt-1">{total} total</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors ${
            !status ? "border-border-gold text-gold-primary" : "border-border-primary text-text-muted hover:border-border-gold hover:text-gold-primary"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors ${
              status === s ? "border-border-gold text-gold-primary" : "border-border-primary text-text-muted hover:border-border-gold hover:text-gold-primary"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-primary">
              {["Order", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-text-muted font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <p className="text-text-primary font-mono text-xs">{order.orderNumber}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-text-primary text-sm">{order.user?.name ?? order.guestEmail ?? "Guest"}</p>
                  <p className="text-xs text-text-muted">{order.user?.email ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-text-secondary">{order.items.length}</td>
                <td className="px-4 py-3 text-text-primary">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] px-2 py-0.5 border uppercase tracking-wider ${STATUS_COLORS[order.status] ?? "text-text-muted"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-[10px] tracking-[0.15em] uppercase text-text-muted hover:text-gold-primary transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted text-sm">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex gap-2 justify-end">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?${status ? `status=${status}&` : ""}page=${p}`}
              className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors ${
                p === page ? "border-border-gold text-gold-primary" : "border-border-primary text-text-muted hover:border-border-gold"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
