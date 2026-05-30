import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "db";
import { parseJsonArray } from "@/lib/utils";
import type { Metadata } from "next";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import FragranceNotes from "@/components/product/FragranceNotes";
import ReviewsSection from "@/components/product/ReviewsSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import type { ProductCardData } from "@/components/home/ProductCard";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, metaTitle: true, metaDesc: true, concentration: true },
  });
  if (!product) return { title: "Not Found" };
  return {
    title: product.metaTitle ?? `${product.name} ${product.concentration}`,
    description: product.metaDesc ?? undefined,
  };
}

export const revalidate = 900; // ISR: product + reviews regenerate every 15 min

const getProductBySlug = (slug: string) =>
  unstable_cache(
    () =>
      prisma.product.findUnique({
        where: { slug, isActive: true },
        include: {
          variants: { orderBy: { price: "asc" } },
          reviews: { orderBy: { createdAt: "desc" } },
          category: true,
        },
      }),
    ["product", slug],
    { revalidate: 900, tags: ["products", `product-${slug}`] }
  )();

const getRelatedProducts = (family: string, excludeSlug: string) =>
  unstable_cache(
    async () => {
      const related = await prisma.product.findMany({
        where: { family, isActive: true, slug: { not: excludeSlug } },
        include: { variants: { orderBy: { price: "asc" } } },
        take: 4,
      });
      const ids = related.map((p) => p.id);
      const stats = await prisma.review.groupBy({
        by: ["productId"],
        where: { productId: { in: ids } },
        _avg: { rating: true },
        _count: { id: true },
      });
      return { related, statsMap: new Map(stats.map((s) => [s.productId, { avg: s._avg.rating ?? 0, count: s._count.id }])) };
    },
    ["related", family, excludeSlug],
    { revalidate: 1800, tags: ["products"] }
  )();

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const { related, statsMap: relatedStatsMap } = await getRelatedProducts(product.family, slug);

  const relatedCards: ProductCardData[] = related.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    concentration: p.concentration,
    family: p.family,
    gender: p.gender,
    images: parseJsonArray(p.images),
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      price: v.price,
      salePrice: v.salePrice,
      stock: v.stock,
      sku: v.sku,
    })),
    avgRating: relatedStatsMap.get(p.id)?.avg ?? 0,
    reviewCount: relatedStatsMap.get(p.id)?.count ?? 0,
  }));

  const variants = product.variants.map((v) => ({
    id: v.id,
    size: v.size,
    price: v.price,
    salePrice: v.salePrice,
    stock: v.stock,
    sku: v.sku,
  }));

  return (
    <>
      <NavbarServer />
      <main className="pt-20">
        {/* Hero: gallery + info */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery — sticky on desktop */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductGallery
                family={product.family}
                name={product.name}
                concentration={product.concentration}
                images={parseJsonArray(product.images)}
              />
            </div>

            {/* Info */}
            <div>
              <ProductInfo
                productId={product.id}
                slug={product.slug}
                name={product.name}
                description={product.description}
                concentration={product.concentration}
                gender={product.gender}
                family={product.family}
                variants={variants}
              />

              {/* Story */}
              {product.story && (
                <div className="mt-10 pt-8 border-t border-border-primary">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold-primary mb-3">
                    The Story
                  </p>
                  <p className="font-display italic text-lg text-text-secondary leading-relaxed">
                    &ldquo;{product.story}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <FragranceNotes
          topNotes={product.topNotes}
          heartNotes={product.heartNotes}
          baseNotes={product.baseNotes}
        />

        {/* Reviews */}
        <ReviewsSection reviews={product.reviews} productId={product.id} />

        {/* Related */}
        <RelatedProducts products={relatedCards} />
      </main>
      <FooterServer />
    </>
  );
}
