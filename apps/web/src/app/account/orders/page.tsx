import { auth } from "@/lib/auth";
import { prisma } from "db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-blue-400 bg-blue-400/10",
  SHIPPED: "text-purple-400 bg-purple-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  REFUNDED: "text-text-muted bg-bg-tertiary",
};

export default async function OrdersPage() {
  const session = await auth();
  const userId = (session!.user as any).id as string;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="glass-panel p-14 text-center">
        <Package size={40} className="text-text-muted mx-auto mb-4" strokeWidth={1} />
        <p className="font-display text-2xl text-text-secondary mb-2">No orders yet</p>
        <p className="text-sm text-text-muted mb-8">
          Your complete order history will appear here.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
        >
          Explore Collection
          <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted mb-6">
        {orders.length} {orders.length === 1 ? "order" : "orders"} total
      </p>

      {orders.map((order) => {
        const shippingAddr = (() => {
          try {
            return JSON.parse(order.shippingAddress);
          } catch {
            return null;
          }
        })();

        return (
          <div key={order.id} className="glass-panel overflow-hidden">
            {/* Order header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border-primary">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span className="text-sm text-text-primary font-medium">
                  #{order.orderNumber}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] tracking-[0.15em] uppercase rounded-sm ${
                    STATUS_STYLES[order.status] ?? "text-text-muted bg-bg-tertiary"
                  }`}
                >
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </div>
              <span className="text-sm text-text-primary font-medium">
                {formatPrice(order.total)}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-border-primary">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm text-text-primary">{item.productName}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {item.variantSize} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-bg-secondary/50">
              <div className="text-xs text-text-muted">
                {shippingAddr && (
                  <>
                    Ships to {shippingAddr.city}, {shippingAddr.country}
                  </>
                )}
                {order.trackingNumber && (
                  <span className="ml-3 text-gold-primary">
                    Tracking: {order.trackingNumber}
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-xs text-text-muted">
                <span>Subtotal {formatPrice(order.subtotal)}</span>
                {order.discountAmount > 0 && (
                  <span className="text-green-400">−{formatPrice(order.discountAmount)}</span>
                )}
                <span>Shipping {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
