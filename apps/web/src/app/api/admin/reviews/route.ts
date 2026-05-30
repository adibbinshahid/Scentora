import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "db";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { productId, customerName, rating, comment, isVerified } = body;

  if (!productId || !customerName?.trim() || !comment?.trim() || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      customerName: String(customerName).trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: String(comment).trim(),
      isVerified: Boolean(isVerified),
    },
  });

  revalidatePath("/products/[slug]", "page");
  return NextResponse.json(review);
}
