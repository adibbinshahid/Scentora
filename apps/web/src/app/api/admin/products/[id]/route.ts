import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  story: z.string().nullable().optional(),
  concentration: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"]).optional(),
  family: z.string().optional(),
  topNotes: z.string().optional(),
  heartNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        size: z.string(),
        sku: z.string(),
        price: z.number().positive(),
        salePrice: z.number().nullable().optional(),
        stock: z.number().int().min(0),
      })
    )
    .optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdminRead();
  if (error) return error;
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { price: "asc" } }, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { variants, images, topNotes, heartNotes, baseNotes, ...fields } = parsed.data;

  const updateData: Record<string, unknown> = { ...fields };
  if (images !== undefined) updateData.images = JSON.stringify(images);
  if (topNotes !== undefined)
    updateData.topNotes = JSON.stringify(topNotes.split(",").map((s) => s.trim()).filter(Boolean));
  if (heartNotes !== undefined)
    updateData.heartNotes = JSON.stringify(heartNotes.split(",").map((s) => s.trim()).filter(Boolean));
  if (baseNotes !== undefined)
    updateData.baseNotes = JSON.stringify(baseNotes.split(",").map((s) => s.trim()).filter(Boolean));

  await prisma.product.update({ where: { id }, data: updateData });

  if (variants) {
    const incomingIds = variants.filter((v) => v.id).map((v) => v.id!);
    await prisma.variant.deleteMany({
      where: { productId: id, id: { notIn: incomingIds } },
    });
    for (const v of variants) {
      if (v.id) {
        await prisma.variant.update({
          where: { id: v.id },
          data: { size: v.size, sku: v.sku, price: v.price, salePrice: v.salePrice ?? null, stock: v.stock },
        });
      } else {
        await prisma.variant.create({
          data: { productId: id, size: v.size, sku: v.sku, price: v.price, salePrice: v.salePrice ?? null, stock: v.stock },
        });
      }
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { price: "asc" } } },
  });

  revalidatePath("/shop");
  revalidatePath("/products/[slug]", "page");

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "Cannot delete — product has associated orders. Archive it by setting it to inactive instead." },
      { status: 409 }
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return NextResponse.json({ success: true });
}
