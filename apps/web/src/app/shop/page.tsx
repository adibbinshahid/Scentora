export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { STATIC_PRODUCTS, STATIC_CATEGORIES } from "@/lib/static-catalog";
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

function getProducts(params: Awaited<SearchParams>): ProductCardData[] {
  const { category, concentration, gender, family, filter, sort, q } = params;

  let results = STATIC_PRODUCTS.filter((p) => {
    if (!p.isActive) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.slug.includes(q.toLowerCase())) return false;
    if (category && p.categorySlug !== category) return false;
    if (concentration && p.concentration !== concentration) return false;
    if (gender && p.gender !== gender) return false;
    if (family && p.family !== family) return false;
    if (filter === "bestseller" && !p.isBestseller) return false;
    if (filter === "featured" && !p.isFeatured) return false;
    return true;
  }) as ProductCardData[];

  if (sort === "price-asc") {
    results = [...results].sort(
      (a, b) =>
        (a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0) -
        (b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0)
    );
  } else if (sort === "price-desc") {
    results = [...results].sort(
      (a, b) =>
        (b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0) -
        (a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0)
    );
  } else if (sort === "bestseller") {
    results = [...results].sort((a, b) => {
      const aB = STATIC_PRODUCTS.find((p) => p.id === a.id)?.isBestseller ? 1 : 0;
      const bB = STATIC_PRODUCTS.find((p) => p.id === b.id)?.isBestseller ? 1 : 0;
      return bB - aB;
    });
  }

  return results;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [products, content] = await Promise.all([
    Promise.resolve(getProducts(params)),
    getSiteContent(),
  ]);

  const categories = STATIC_CATEGORIES;

  const hasFilters =
    params.category ||
    params.concentration ||
    params.gender ||
    params.family ||
    params.filter;

  const shopTitle    = content["shop_title"]       ?? "The Collection";
  const shopSubtitle = content["shop_subtitle"]    ?? "";
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
