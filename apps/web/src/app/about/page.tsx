import { getSiteContent } from "@/lib/content";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import AboutHero from "@/components/about/AboutHero";
import AboutIngredients from "@/components/about/AboutIngredients";
import AboutPerfumers from "@/components/about/AboutPerfumers";
import AboutAtelier from "@/components/about/AboutAtelier";
import BrandStory from "@/components/home/BrandStory";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "About Us",
    description:
      content["about_hero_subtitle"] ??
      "The story, the ingredients, and the people behind Scentora Perfumes.",
  };
}

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <NavbarServer />
      <main>
        {/* 1 — Cinematic hero */}
        <AboutHero content={content} />

        {/* 2 — Brand story & pillars */}
        <BrandStory content={content} />

        {/* 3 — Rare ingredients */}
        <AboutIngredients content={content} />

        {/* 4 — Perfumers */}
        <AboutPerfumers content={content} />

        {/* 5 — Atelier / Visit */}
        <AboutAtelier content={content} />
      </main>
      <FooterServer />
    </>
  );
}
