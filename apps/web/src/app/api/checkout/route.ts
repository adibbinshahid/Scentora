import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
});

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
});

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AN-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { email, name, shippingAddress, billingAddress, couponCode, items: cartItems } = parsed.data;

  // Fetch variants from DB to get authoritative prices
  const variantIds = cartItems.map((i) => i.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { select: { name: true, isActive: true } } },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json({ error: "One or more items are unavailable." }, { status: 400 });
  }

  // Check stock
  for (const item of cartItems) {
    const variant = variants.find((v) => v.id === item.variantId)!;
    if (!variant.product.isActive) {
      return NextResponse.json({ error: `${variant.product.name} is no longer available.` }, { status: 400 });
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${variant.product.name} (${variant.size}).` },
        { status: 400 }
      );
    }
  }

  // Compute subtotal with server-side prices
  const subtotal = cartItems.reduce((sum, item) => {
    const v = variants.find((v) => v.id === item.variantId)!;
    return sum + (v.salePrice ?? v.price) * item.quantity;
  }, 0);

  // Coupon validation
  let discountAmount = 0;
  let shippingCost = subtotal >= 200 ? 0 : 15;
  let validatedCouponCode: string | undefined;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
        validatedCouponCode = coupon.code;
        if (coupon.type === "PERCENTAGE") discountAmount = subtotal * (coupon.value / 100);
        else if (coupon.type === "FIXED_AMOUNT") discountAmount = Math.min(coupon.value, subtotal);
        else if (coupon.type === "FREE_SHIPPING") shippingCost = 0;
      }
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + shippingCost + tax;
  const totalCents = Math.round(total * 100);

  const isDemo = !process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY.includes("placeholder") ||
    process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder");

  const orderData = {
    orderNumber: generateOrderNumber(),
    userId: session?.user ? (session.user as any).id : undefined,
    guestEmail: session?.user ? undefined : email,
    subtotal,
    discountAmount,
    shippingCost,
    tax,
    total,
    couponCode: validatedCouponCode,
    shippingAddress: JSON.stringify(shippingAddress),
    billingAddress: JSON.stringify(billingAddress),
    items: {
      create: cartItems.map((item) => {
        const v = variants.find((v) => v.id === item.variantId)!;
        return {
          variantId: v.id,
          productName: v.product.name,
          variantSize: v.size,
          price: v.salePrice ?? v.price,
          quantity: item.quantity,
        };
      }),
    },
  };

  if (isDemo) {
    // Demo mode — skip Stripe, create order as PAID directly
    const order = await prisma.order.create({
      data: { ...orderData, status: "PAID" },
    });

    if (validatedCouponCode) {
      await prisma.coupon.update({
        where: { code: validatedCouponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ orderNumber: order.orderNumber, demo: true });
  }

  // Real Stripe flow
  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      receipt_email: email,
      metadata: { customerName: name, orderEmail: email },
    });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Payment service unavailable." }, { status: 502 });
  }

  const order = await prisma.order.create({
    data: { ...orderData, status: "PENDING", stripePaymentId: paymentIntent.id },
  });

  if (validatedCouponCode) {
    await prisma.coupon.update({
      where: { code: validatedCouponCode },
      data: { usedCount: { increment: 1 } },
    });
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderNumber: order.orderNumber,
  });
}
