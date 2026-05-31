import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  salePrice: z.number().nullable().optional(),
  stock: z.number().int().min(0),
});

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  description: z.string().min(1),
  story: z.string().optional(),
  concentration: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"]),
  family: z.string().min(1),
  topNotes: z.string(),
  heartNotes: z.string(),
  baseNotes: z.string(),
  images: z.array(z.string()),
  categoryId: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  variants: z.array(variantSchema).min(1),
});

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const products = await prisma.product.findMany({
    include: {
      variants: { orderBy: { price: "asc" } },
      category: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { variants, images, topNotes, heartNotes, baseNotes, ...data } = parsed.data;

  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already in use." }, { status: 409 });

  const product = await prisma.product.create({
    data: {
      ...data,
      story: data.story ?? null,
      categoryId: data.categoryId ?? null,
      metaTitle: data.metaTitle ?? null,
      metaDesc: data.metaDesc ?? null,
      images: JSON.stringify(images),
      topNotes: JSON.stringify(topNotes.split(",").map((s) => s.trim()).filter(Boolean)),
      heartNotes: JSON.stringify(heartNotes.split(",").map((s) => s.trim()).filter(Boolean)),
      baseNotes: JSON.stringify(baseNotes.split(",").map((s) => s.trim()).filter(Boolean)),
      variants: {
        create: variants.map((v) => ({
          size: v.size,
          sku: v.sku,
          price: v.price,
          salePrice: v.salePrice ?? null,
          stock: v.stock,
        })),
      },
    },
  });

  revalidateTag("products");
  revalidatePath("/", "page");
  revalidatePath("/shop", "page");

  return NextResponse.json(product, { status: 201 });
}
