import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "db";
import { revalidatePath } from "next/cache";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const body = await req.json();
  const { customerName, rating, comment, isVerified } = body;

  const updated = await prisma.review.update({
    where: { id },
    data: {
      ...(customerName !== undefined && { customerName: String(customerName).trim() }),
      ...(rating !== undefined && { rating: Math.min(5, Math.max(1, Number(rating))) }),
      ...(comment !== undefined && { comment: String(comment).trim() }),
      ...(isVerified !== undefined && { isVerified: Boolean(isVerified) }),
    },
  });

  revalidatePath("/products/[slug]", "page");
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await prisma.review.delete({ where: { id } });
  revalidatePath("/products/[slug]", "page");
  return NextResponse.json({ success: true });
}
