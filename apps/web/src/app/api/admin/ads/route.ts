import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

const adSchema = z.object({
  text: z.string().min(1),
  link: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const ads = await prisma.scrollAd.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(ads);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = adSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const ad = await prisma.scrollAd.create({ data: parsed.data });
  return NextResponse.json(ad, { status: 201 });
}
