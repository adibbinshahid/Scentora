import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.number().min(0),
  minOrderValue: z.number().nullable().optional(),
  maxUses: z.number().int().nullable().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().nullable().optional(),
});

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
  if (existing) return NextResponse.json({ error: "Coupon code already exists." }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });
  return NextResponse.json(coupon, { status: 201 });
}
