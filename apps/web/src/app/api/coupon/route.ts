import { NextRequest, NextResponse } from "next/server";
import { prisma } from "db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided." }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid or expired coupon." }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 410 });
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 410 });
  }

  return NextResponse.json({
    coupon: {
      code: coupon.code,
      type: coupon.type as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
      value: coupon.value,
      minOrderValue: coupon.minOrderValue ?? undefined,
    },
  });
}
