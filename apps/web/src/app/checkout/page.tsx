"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/stores/cartStore";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_placeholder")
  ? null
  : loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

// ─── Address form fields ─────────────────────────────────────────────────────

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const EMPTY_ADDRESS: Address = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  phone: "",
};

function AddressFields({
  prefix,
  value,
  onChange,
}: {
  prefix: string;
  value: Address;
  onChange: (v: Address) => void;
}) {
  const f = (field: keyof Address) => (
    <input
      value={value[field]}
      onChange={(e) => onChange({ ...value, [field]: e.target.value })}
      className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
    />
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="field-label">Street Address</label>
        {f("street")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">City</label>
          {f("city")}
        </div>
        <div>
          <label className="field-label">State / Province</label>
          {f("state")}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">ZIP / Postal Code</label>
          {f("zipCode")}
        </div>
        <div>
          <label className="field-label">Country</label>
          {f("country")}
        </div>
      </div>
      <div>
        <label className="field-label">Phone (optional)</label>
        {f("phone")}
      </div>
    </div>
  );
}

// ─── Payment form (inside Elements) ─────────────────────────────────────────

function PaymentForm({
  orderNumber,
  onSuccess,
}: {
  orderNumber: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setProcessing(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed.");
      setProcessing(false);
      return;
    }

    clearCart();
    router.push(`/checkout/success?order=${orderNumber}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        <Lock size={13} />
        {processing ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
}

// ─── Main checkout page ──────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, coupon, getTotals, clearCart } = useCartStore();
  const totals = getTotals();

  const [step, setStep] = useState<"details" | "payment">("details");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [name, setName] = useState(session?.user?.name ?? "");
  const [shipping, setShipping] = useState<Address>(EMPTY_ADDRESS);
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState<Address>(EMPTY_ADDRESS);

  const [clientSecret, setClientSecret] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items.length, router]);

  if (items.length === 0) return null;

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutError("");
    setSubmitting(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        shippingAddress: shipping,
        billingAddress: billingSame ? shipping : billing,
        couponCode: coupon?.code,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      setCheckoutError(data.error ?? "Checkout failed.");
      return;
    }

    setOrderNumber(data.orderNumber);
    if (data.demo) {
      setIsDemo(true);
    } else {
      setClientSecret(data.clientSecret);
    }
    setStep("payment");
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#C9A84C",
        colorBackground: "#1A1A1A",
        colorText: "#F9F7F2",
        colorDanger: "#F87171",
        fontFamily: "Inter, sans-serif",
        borderRadius: "0px",
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors mb-6"
            >
              <ArrowLeft size={12} />
              Back to shop
            </Link>
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-2">
              {step === "details" ? "Step 1 of 2" : "Step 2 of 2"}
            </span>
            <h1
              className="font-display font-light text-4xl text-text-primary"
              style={{ letterSpacing: "0.06em" }}
            >
              {step === "details" ? "Your Details" : "Payment"}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            {/* Left: form */}
            <div>
              {step === "details" ? (
                <form onSubmit={handleDetailsSubmit} className="space-y-8">
                  {/* Contact */}
                  <section>
                    <SectionHeader>Contact</SectionHeader>
                    <div className="space-y-3">
                      <div>
                        <label className="field-label">Full Name</label>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
                        />
                      </div>
                      <div>
                        <label className="field-label">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Shipping */}
                  <section>
                    <SectionHeader>Shipping Address</SectionHeader>
                    <AddressFields prefix="ship" value={shipping} onChange={setShipping} />
                  </section>

                  {/* Billing */}
                  <section>
                    <SectionHeader>Billing Address</SectionHeader>
                    <label className="flex items-center gap-2 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingSame}
                        onChange={(e) => setBillingSame(e.target.checked)}
                        className="accent-gold-primary"
                      />
                      <span className="text-sm text-text-secondary">
                        Same as shipping address
                      </span>
                    </label>
                    {!billingSame && (
                      <AddressFields prefix="bill" value={billing} onChange={setBilling} />
                    )}
                  </section>

                  {checkoutError && (
                    <p className="text-red-400 text-sm">{checkoutError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Please wait…" : "Continue to Payment"}
                    {!submitting && <ArrowRight size={13} />}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={() => setStep("details")}
                    className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <ArrowLeft size={12} />
                    Edit details
                  </button>

                  {isDemo ? (
                    <DemoPaymentStep orderNumber={orderNumber} onConfirm={() => {
                      clearCart();
                      router.push(`/checkout/success?order=${orderNumber}&demo=1`);
                    }} />
                  ) : stripePromise && clientSecret ? (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <PaymentForm orderNumber={orderNumber} onSuccess={() => {}} />
                    </Elements>
                  ) : (
                    <div className="glass-panel p-8 text-center">
                      <p className="text-text-muted text-sm">
                        Stripe not configured. Add real keys to{" "}
                        <code className="text-gold-primary">.env</code> to process payments.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: order summary */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-0">
              <div className="glass-panel overflow-hidden">
                <div className="px-5 py-4 border-b border-border-primary">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold-primary">
                    Order Summary
                  </p>
                </div>

                {/* Items */}
                <div className="divide-y divide-border-primary">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex items-center justify-between px-5 py-3.5 gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm text-text-primary shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-5 py-4 border-t border-border-primary space-y-2.5 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({coupon?.code})</span>
                      <span>−{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between text-text-primary font-medium text-base pt-2 border-t border-border-primary">
                    <span>Total</span>
                    <span>{formatPrice(totals.total)}</span>
                  </div>
                </div>

                <div className="px-5 pb-4 flex items-center gap-1.5 text-[10px] text-text-muted">
                  <Lock size={10} />
                  Secured by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DemoPaymentStep({ orderNumber, onConfirm }: { orderNumber: string; onConfirm: () => void }) {
  return (
    <div className="space-y-6">
      {/* Demo notice */}
      <div
        className="p-5 rounded-lg space-y-2"
        style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}
      >
        <p className="text-[10px] tracking-[0.25em] uppercase text-gold-primary font-semibold">
          Demo Website Notice
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          This is an AI-powered demonstration website by ADIB. No real payment will be charged and no product will be shipped.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your order <span className="text-gold-primary font-medium">{orderNumber}</span> has been saved to the admin panel and a confirmation email notification would be sent in a real deployment.
        </p>
      </div>

      {/* Fake card UI for realism */}
      <div
        className="p-5 rounded-lg space-y-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-text-muted">Card Details (Demo)</p>
        <div className="space-y-3">
          <input
            readOnly
            defaultValue="4242 4242 4242 4242"
            className="w-full bg-bg-tertiary border border-border-primary text-text-muted text-sm px-4 py-3 outline-none cursor-not-allowed"
          />
          <div className="grid grid-cols-2 gap-3">
            <input readOnly defaultValue="12/99" className="w-full bg-bg-tertiary border border-border-primary text-text-muted text-sm px-4 py-3 outline-none cursor-not-allowed" />
            <input readOnly defaultValue="999" className="w-full bg-bg-tertiary border border-border-primary text-text-muted text-sm px-4 py-3 outline-none cursor-not-allowed" />
          </div>
        </div>
        <p className="text-[10px] text-text-muted/60">Test card — no real transaction occurs</p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
      >
        <Lock size={13} />
        Complete Demo Order
      </button>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] uppercase text-gold-primary mb-4 pb-2 border-b border-border-primary">
      {children}
    </p>
  );
}
