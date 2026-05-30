import { Suspense } from "react";
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

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["shop_title"] ?? "The Collection",
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

async function getProducts(params: Awaited<SearchParams>): Promise<ProductCardData[]> {
  const { category, concentration, gender, family, filter, sort, q } = params;

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
    include: {
      variants: { orderBy: { price: "asc" } },
    },
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
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

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

  const shopTitle    = content["shop_title"]    ?? "The Collection";
  const shopSubtitle = content["shop_subtitle"] ?? "";
  const bannerImage  = content["shop_banner_image"] ?? "";
  const categoryLabel = categories.find((c) => c.slug === params.category)?.name;
  const heading = categoryLabel ?? shopTitle;

  return (
    <>
      <NavbarServer />
      <main className="pt-20 min-h-screen">
        {/* Page header */}
        <div
          className="relative border-b border-border-primary overflow-hidden"
          style={
            bannerImage
              ? { backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {bannerImage && (
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(10,9,7,0.90) 0%, rgba(10,9,7,0.60) 100%)" }}
            />
          )}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-2">
              {hasFilters ? "Filtered Results" : "Explore"}
            </span>
            <h1
              className="font-display font-light text-4xl sm:text-5xl text-text-primary"
              style={{ letterSpacing: "0.06em" }}
            >
              {heading}
            </h1>
            {shopSubtitle && !hasFilters && (
              <p className="text-text-muted text-sm mt-2 max-w-lg leading-relaxed">
                {shopSubtitle}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
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
            {/* Sidebar */}
            <div className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-24">
                <Suspense><FilterSidebar categories={categories} /></Suspense>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-display text-2xl text-text-secondary mb-3">
                    No fragrances found
                  </p>
                  <p className="text-sm text-text-muted">
                    Try adjusting your filters.
                  </p>
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
