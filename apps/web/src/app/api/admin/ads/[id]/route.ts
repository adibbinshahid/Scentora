import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const patchSchema = z.object({
  text: z.string().min(1).optional(),
  link: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const ad = await prisma.scrollAd.update({ where: { id }, data: parsed.data });
  return NextResponse.json(ad);
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await prisma.scrollAd.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
