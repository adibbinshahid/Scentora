"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400",
  CONFIRMED: "text-blue-400",
  PROCESSING: "text-purple-400",
  SHIPPED: "text-cyan-400",
  DELIVERED: "text-green-400",
  CANCELLED: "text-red-400",
  REFUNDED: "text-orange-400",
};

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  tax: number;
  couponCode: string | null;
  trackingNumber: string | null;
  notes: string | null;
  stripePaymentId: string | null;
  shippingAddress: string;
  createdAt: string;
  guestEmail: string | null;
  user: { name: string | null; email: string } | null;
  items: {
    id: string;
    productName: string;
    variantSize: string;
    price: number;
    quantity: number;
  }[];
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
        setTracking(data.trackingNumber ?? "");
        setNotes(data.notes ?? "");
      });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        trackingNumber: tracking || null,
        notes: notes || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Order updated.");
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Update failed.");
    }
  }

  if (!order) {
    return <div className="text-text-muted text-sm">Loading…</div>;
  }

  let shippingAddr: Record<string, string> = {};
  try { shippingAddr = JSON.parse(order.shippingAddress); } catch {}

  const input = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors";
  const select = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors";

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors"
      >
        <ArrowLeft size={12} /> Orders
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>
            {order.orderNumber}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2">Customer</h2>
          <p className="text-text-primary text-sm">{order.user?.name ?? "Guest"}</p>
          <p className="text-text-muted text-xs">{order.user?.email ?? order.guestEmail ?? "—"}</p>
        </div>

        {/* Shipping */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2">Shipping Address</h2>
          <div className="text-text-secondary text-sm space-y-0.5">
            <p>{shippingAddr.name}</p>
            <p>{shippingAddr.street}</p>
            <p>{shippingAddr.city}, {shippingAddr.state} {shippingAddr.zip}</p>
            <p>{shippingAddr.country}</p>
          </div>
        </div>

        {/* Totals */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2">Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-secondary">
              <span>Shipping</span><span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Tax</span><span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-text-primary font-medium border-t border-border-primary pt-1.5">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="glass-panel p-6">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
              <div>
                <p className="text-text-primary text-sm">{item.productName}</p>
                <p className="text-text-muted text-xs">{item.variantSize} × {item.quantity}</p>
              </div>
              <p className="text-text-primary text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manage */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2">Manage Order</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={select}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p className="mt-1 text-xs">
              Current: <span className={STATUS_COLORS[order.status] ?? "text-text-muted"}>{order.status}</span>
            </p>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Tracking Number</label>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
              className={input}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Internal Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={`${input} resize-none`}
            placeholder="Notes visible only to admins…"
          />
        </div>

        {order.stripePaymentId && (
          <p className="text-xs text-text-muted">Stripe ID: <span className="font-mono">{order.stripePaymentId}</span></p>
        )}
      </div>
    </div>
  );
}
