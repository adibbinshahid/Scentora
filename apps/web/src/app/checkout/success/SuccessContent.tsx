"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Package, Info } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const isDemo = searchParams.get("demo") === "1";
  const { data: session } = useSession();

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold-primary/10 border border-border-gold flex items-center justify-center"
        >
          <CheckCircle size={36} className="text-gold-primary" strokeWidth={1.5} />
        </motion.div>

        <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-3">
          Order Confirmed
        </span>
        <h1 className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-4" style={{ letterSpacing: "0.06em" }}>
          Thank You
        </h1>
        <p className="text-text-secondary text-base leading-relaxed mb-3">
          Your order has been received and is being prepared with care.
        </p>

        {orderNumber && (
          <div className="glass-panel inline-flex items-center gap-3 px-6 py-3 mb-8">
            <Package size={14} className="text-gold-primary" />
            <span className="text-sm text-text-primary">
              Order <span className="text-gold-primary font-medium">{orderNumber}</span>
            </span>
          </div>
        )}

        <p className="text-sm text-text-muted mb-6">
          A confirmation email will be sent to you shortly.
          {session && (
            <> Track your order in{" "}
              <Link href="/account/orders" className="text-gold-primary hover:text-gold-light transition-colors">
                My Orders
              </Link>.
            </>
          )}
        </p>

        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-4 rounded-lg text-left space-y-1.5"
            style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Info size={13} className="text-gold-primary shrink-0" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold-primary font-semibold">Demo Website</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              This is an AI-powered demo site created by ADIB for demonstration purposes. No product will be shipped and no payment was charged.
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your order details have been saved to the admin panel, and in a real deployment a confirmation email would be dispatched automatically.
            </p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
          >
            Continue Shopping <ArrowRight size={13} />
          </Link>
          {session && (
            <Link
              href="/account/orders"
              className="flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase border border-border-primary text-text-secondary hover:border-border-gold hover:text-text-primary transition-colors"
            >
              View Orders
            </Link>
          )}
        </div>
      </motion.div>
    </main>
  );
}
