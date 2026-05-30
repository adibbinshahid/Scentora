import { STATIC_PRODUCTS } from "@/lib/static-catalog";
import { getSiteContent } from "@/lib/content";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import EditorialSection from "@/components/home/EditorialSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import type { ProductCardData } from "@/components/home/ProductCard";

function getFeaturedProducts(): ProductCardData[] {
  return STATIC_PRODUCTS.filter((p) => p.isFeatured && p.isActive) as ProductCardData[];
}

export default async function HomePage() {
  const [featuredProducts, content] = await Promise.all([
    Promise.resolve(getFeaturedProducts()),
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
