import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

const KEYS = ["store_tax_rate", "store_shipping_fee", "store_free_shipping_threshold"] as const;

const DEFAULTS = {
  store_tax_rate: "8",
  store_shipping_fee: "15",
  store_free_shipping_threshold: "200",
};

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const rows = await prisma.siteContent.findMany({ where: { key: { in: [...KEYS] } } });
  const map: Record<string, string> = { ...DEFAULTS };
  for (const r of rows) map[r.key] = r.value;

  return NextResponse.json(map);
}

const schema = z.object({
  store_tax_rate: z.string().regex(/^\d+(\.\d+)?$/, "Must be a number"),
  store_shipping_fee: z.string().regex(/^\d+(\.\d+)?$/, "Must be a number"),
  store_free_shipping_threshold: z.string().regex(/^\d+(\.\d+)?$/, "Must be a number"),
});

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  for (const key of KEYS) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value: parsed.data[key] },
      create: { key, value: parsed.data[key] },
    });
  }

  return NextResponse.json({ success: true });
}
