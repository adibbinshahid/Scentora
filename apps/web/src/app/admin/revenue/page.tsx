"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";

interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  months: { label: string; revenue: number; orders: number }[];
  statusCount: Record<string, number>;
  topProducts: { name: string; revenue: number; qty: number }[];
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="text-text-muted text-sm">Loading analytics…</div>;
  }

  const maxMonthlyRevenue = Math.max(...data.months.map((m) => m.revenue), 1);
  const statusEntries = Object.entries(data.statusCount).sort((a, b) => b[1] - a[1]);

  const STATUS_BG: Record<string, string> = {
    DELIVERED: "text-green-400 bg-green-400/10 border-green-400/20",
    SHIPPED: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    PROCESSING: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
    REFUNDED: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Revenue</h1>
        <p className="text-sm text-text-muted mt-1">Analytics overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp size={18} />} label="Total Revenue" value={formatPrice(data.totalRevenue)} sub="Confirmed + delivered" />
        <StatCard icon={<ShoppingBag size={18} />} label="Total Orders" value={String(data.totalOrders)} sub="All time" />
        <StatCard icon={<Package size={18} />} label="Avg Order" value={formatPrice(data.avgOrderValue)} sub="Per paid order" />
        <StatCard icon={<Users size={18} />} label="Customers" value={String(data.totalCustomers)} sub="Registered" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly chart */}
        <div className="glass-panel p-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2 mb-4">Monthly Revenue (Last 6 Months)</h2>
          <div className="space-y-3">
            {data.months.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">{m.label}</span>
                  <span className="text-text-primary">{formatPrice(m.revenue)}</span>
                </div>
                <div className="h-2 bg-bg-tertiary">
                  <div
                    className="h-full bg-gold-primary transition-all"
                    style={{ width: `${(m.revenue / maxMonthlyRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-[9px] text-text-muted mt-0.5">{m.orders} orders</p>
              </div>
            ))}
            {data.months.length === 0 && (
              <p className="text-text-muted text-sm">No data yet.</p>
            )}
          </div>
        </div>

        {/* Orders by status */}
        <div className="glass-panel p-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2 mb-4">Orders by Status</h2>
          <div className="space-y-2">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
                <span className={`text-[9px] px-2 py-0.5 border uppercase tracking-wider ${STATUS_BG[status] ?? "text-text-muted border-border-primary"}`}>
                  {status}
                </span>
                <span className="text-text-secondary text-sm">{count} orders</span>
              </div>
            ))}
            {statusEntries.length === 0 && (
              <p className="text-text-muted text-sm">No orders yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="glass-panel p-6">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2 mb-4">Top Products by Revenue</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-primary">
              {["#", "Product", "Units Sold", "Revenue"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-[10px] tracking-[0.15em] uppercase text-text-muted font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {data.topProducts.map((p, i) => (
              <tr key={p.name} className="hover:bg-white/[0.02]">
                <td className="px-3 py-3 text-text-muted text-xs">{i + 1}</td>
                <td className="px-3 py-3 text-text-primary">{p.name}</td>
                <td className="px-3 py-3 text-text-secondary">{p.qty}</td>
                <td className="px-3 py-3 text-text-primary">{formatPrice(p.revenue)}</td>
              </tr>
            ))}
            {data.topProducts.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-text-muted">No sales data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="glass-panel p-5 flex gap-4 items-start">
      <div className="text-gold-primary opacity-60 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-text-muted">{label}</p>
        <p className="font-display text-2xl text-text-primary mt-1" style={{ letterSpacing: "0.04em" }}>{value}</p>
        <p className="text-xs text-text-muted mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
