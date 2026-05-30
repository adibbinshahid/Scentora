import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

const bulkSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    stock: z.number().int().min(0),
  })),
});

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const variants = await prisma.variant.findMany({
    include: { product: { select: { name: true, isActive: true } } },
    orderBy: [{ product: { name: "asc" } }, { price: "asc" }],
  });
  return NextResponse.json(variants);
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  await Promise.all(
    parsed.data.updates.map((u) =>
      prisma.variant.update({ where: { id: u.id }, data: { stock: u.stock } })
    )
  );

  return NextResponse.json({ success: true });
}
