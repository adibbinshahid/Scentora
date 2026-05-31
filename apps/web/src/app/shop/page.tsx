export const dynamic = "force-dynamic"; // required: reads searchParams
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "db";
import { parseJsonArray } from "@/lib/utils";
import { getSiteContent } from "@/lib/content";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import FilterSidebar from "@/components/shop/FilterSidebar";
import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import SortSelect from "@/components/shop/SortSelect";
import ActiveFilters from "@/components/shop/ActiveFilters";
import ProductCard, { type ProductCardData } from "@/components/home/ProductCard";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["shop_title"] ?? "Collections",
    description: content["shop_subtitle"] ?? "Explore the full Scentora collection. Rare ingredients, timeless luxury.",
  };
}

type SearchParams = Promise<{
  category?: string;
  concentration?: string;
  gender?: string;
  family?: string;
  filter?: string;
  sort?: string;
  q?: string;
}>;

// Cache per unique filter combination — 30 min revalidation
async function getProducts(params: Awaited<SearchParams>): Promise<ProductCardData[]> {
  const { category, concentration, gender, family, filter, sort, q } = params;

  const fetcher = unstable_cache(
    async () => {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          ...(q && { name: { contains: q } }),
          ...(category && { category: { slug: category } }),
          ...(concentration && { concentration }),
          ...(gender && { gender }),
          ...(family && { family }),
          ...(filter === "bestseller" && { isBestseller: true }),
          ...(filter === "featured" && { isFeatured: true }),
        },
        include: { variants: { orderBy: { price: "asc" } } },
        orderBy:
          sort === "bestseller"
            ? [{ isBestseller: "desc" }, { createdAt: "desc" }]
            : { createdAt: "desc" },
      });

      const ids = products.map((p) => p.id);
      const reviewStats = await prisma.review.groupBy({
        by: ["productId"],
        where: { productId: { in: ids } },
        _avg: { rating: true },
        _count: { id: true },
      });
      const statsMap = new Map(reviewStats.map((s) => [s.productId, { avg: s._avg.rating ?? 0, count: s._count.id }]));

      const mapped: ProductCardData[] = products.map((p) => ({
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
        avgRating: statsMap.get(p.id)?.avg ?? 0,
        reviewCount: statsMap.get(p.id)?.count ?? 0,
      }));

      if (sort === "price-asc") {
        return mapped.sort(
          (a, b) =>
            (a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0) -
            (b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0)
        );
      }
      if (sort === "price-desc") {
        return mapped.sort(
          (a, b) =>
            (b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0) -
            (a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0)
        );
      }
      return mapped;
    },
    ["shop-products", JSON.stringify(params)],
    { revalidate: 1800, tags: ["products"] }
  );

  return fetcher();
}

const getCategories = unstable_cache(
  async () => prisma.category.findMany({ orderBy: { name: "asc" } }),
  ["categories"],
  { revalidate: 86400, tags: ["categories"] }
);

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [products, categories, content] = await Promise.all([
    getProducts(params),
    getCategories(),
    getSiteContent(),
  ]);

  const hasFilters =
    params.category ||
    params.concentration ||
    params.gender ||
    params.family ||
    params.filter;

  const shopTitle    = content["shop_title"]       ?? "Collections";
  const shopSubtitle = content["shop_subtitle"]    ?? "";
  const bannerImage  = content["shop_banner_image"] ?? "";
  const categoryLabel = categories.find((c) => c.slug === params.category)?.name;
  const heading = categoryLabel ?? shopTitle;

  return (
    <>
      <NavbarServer />
      <main className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <Suspense><MobileFilterDrawer categories={categories} /></Suspense>
              <span className="text-sm text-text-muted">
                {products.length} {products.length === 1 ? "fragrance" : "fragrances"}
              </span>
            </div>
            <Suspense><SortSelect /></Suspense>
          </div>

          <Suspense><ActiveFilters /></Suspense>

          <div className="flex gap-10">
            <div className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-24">
                <Suspense><FilterSidebar categories={categories} /></Suspense>
              </div>
            </div>

            <div className="flex-1">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-display text-2xl text-text-secondary mb-3">No fragrances found</p>
                  <p className="text-sm text-text-muted">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <FooterServer />
    </>
  );
}
