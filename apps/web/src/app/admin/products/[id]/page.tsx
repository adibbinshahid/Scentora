import { prisma } from "db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import AdminReviewsPanel from "@/components/admin/AdminReviewsPanel";
import { parseJsonArray } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { price: "asc" } },
        reviews: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    story: product.story ?? "",
    concentration: product.concentration,
    gender: product.gender,
    family: product.family,
    topNotes: parseJsonArray(product.topNotes).join(", "),
    heartNotes: parseJsonArray(product.heartNotes).join(", "),
    baseNotes: parseJsonArray(product.baseNotes).join(", "),
    images: parseJsonArray(product.images),
    isFeatured: product.isFeatured,
    isBestseller: product.isBestseller,
    isActive: product.isActive,
    metaTitle: product.metaTitle ?? "",
    metaDesc: product.metaDesc ?? "",
    categoryId: product.categoryId ?? null,
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      sku: v.sku,
      price: v.price,
      salePrice: v.salePrice ?? null,
      stock: v.stock,
    })),
  };

  return (
    <>
      <ProductForm initial={initial} categories={categories} />
      <div className="max-w-4xl pb-12">
        <AdminReviewsPanel
          productId={product.id}
          productName={product.name}
          reviews={product.reviews}
        />
      </div>
    </>
  );
}
