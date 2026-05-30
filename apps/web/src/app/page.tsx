export const dynamic = "force-dynamic";
import { prisma } from "db";
import { parseJsonArray } from "@/lib/utils";
import { getSiteContent } from "@/lib/content";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import EditorialSection from "@/components/home/EditorialSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import type { ProductCardData } from "@/components/home/ProductCard";

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { variants: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const ids = products.map((p) => p.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: ids } },
    _avg: { rating: true },
    _count: { id: true },
  });
  const statsMap = new Map(reviewStats.map((s) => [s.productId, { avg: s._avg.rating ?? 0, count: s._count.id }]));

  return products.map((p) => ({
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
}

export default async function HomePage() {
  const [featuredProducts, content] = await Promise.all([
    getFeaturedProducts(),
    getSiteContent(),
  ]);

  return (
    <>
      <NavbarServer />
      <main>
        <HeroSection content={content} />
        <FeaturedSection products={featuredProducts} content={content} />
        <EditorialSection content={content} />
        <NewsletterSection content={content} />
      </main>
      <FooterServer />
    </>
  );
}
