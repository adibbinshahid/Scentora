import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";
import { z } from "zod";

const DEFAULT_CONTENT = [
  // ── Global ─────────────────────────────────────────────────────────────
  { key: "global_brand_name",          value: "Scentora",                                         type: "text",     label: "Brand Name" },
  { key: "global_brand_tagline",       value: "Luxury Fragrance Maison",                          type: "text",     label: "Brand Tagline" },
  { key: "global_meta_title_suffix",   value: "Scentora — Luxury Fragrance Maison",               type: "text",     label: "Default Meta Title" },

  // ── Navigation ─────────────────────────────────────────────────────────
  { key: "nav_link1_label",            value: "Home",                                             type: "text",     label: "Nav Link 1 Label" },
  { key: "nav_link1_href",             value: "/",                                                type: "text",     label: "Nav Link 1 URL" },
  { key: "nav_link2_label",            value: "Shop",                                             type: "text",     label: "Nav Link 2 Label" },
  { key: "nav_link2_href",             value: "/shop",                                            type: "text",     label: "Nav Link 2 URL" },
  { key: "nav_link3_label",            value: "About Us",                                         type: "text",     label: "Nav Link 3 Label" },
  { key: "nav_link3_href",             value: "/about",                                           type: "text",     label: "Nav Link 3 URL" },

  // ── Hero Section ───────────────────────────────────────────────────────
  { key: "hero_eyebrow",               value: "A New Signature Of",                               type: "text",     label: "Hero Eyebrow (small caps above headline)" },
  { key: "hero_title_line1",           value: "Luxury in",                                        type: "text",     label: "Hero Headline Line 1 (white text)" },
  { key: "hero_title_line2",           value: "Every Note",                                       type: "text",     label: "Hero Headline Line 2 (italic gold shimmer)" },
  { key: "hero_tagline",               value: "Discover rare ingredients, masterful blends, and timeless elegance.", type: "text", label: "Hero Tagline (below headline)" },
  { key: "hero_cta",                   value: "Explore Collection",                               type: "text",     label: "Hero Primary Button Text" },
  { key: "hero_cta_href",              value: "/shop",                                            type: "text",     label: "Hero Primary Button URL" },
  { key: "hero_cta_secondary",         value: "Watch Film",                                       type: "text",     label: "Hero Secondary Button Text" },
  { key: "hero_cta_secondary_href",    value: "#",                                                type: "text",     label: "Hero Secondary Button URL" },
  { key: "hero_scroll_hint",           value: "Scroll",                                           type: "text",     label: "Hero Scroll Hint Text" },
  { key: "hero_card_eyebrow",          value: "New Arrival",                                      type: "text",     label: "Hero Card — Eyebrow Label" },
  { key: "hero_card_desc",             value: "A radiant blend of amber & rare floral notes.",    type: "text",     label: "Hero Card — Product Description" },
  { key: "hero_card_cta",              value: "Discover",                                         type: "text",     label: "Hero Card — CTA Link Text" },
  { key: "hero_bg_image",              value: "",                                                 type: "image",    label: "Hero Background Image — Desktop (1920×1080 px, 16:9)" },
  { key: "hero_bg_image_mobile",      value: "",                                                 type: "image",    label: "Hero Background Image — Mobile (750×1200 px, 5:8 portrait)" },

  // ── Brand Value Strip ──────────────────────────────────────────────────
  { key: "feature1_label",               value: "Premium Ingredients",                             type: "text",     label: "Feature Strip — Item 1 Label" },
  { key: "feature2_label",               value: "Long Lasting",                                    type: "text",     label: "Feature Strip — Item 2 Label" },
  { key: "feature3_label",               value: "Made in France",                                  type: "text",     label: "Feature Strip — Item 3 Label" },
  { key: "feature4_label",               value: "Cruelty Free",                                    type: "text",     label: "Feature Strip — Item 4 Label" },

  // ── Best Sellers / Featured Section ────────────────────────────────────
  { key: "featured_title",             value: "Our Best Sellers",                                 type: "text",     label: "Best Sellers Section Title" },
  { key: "featured_view_all",          value: "View All",                                         type: "text",     label: "Best Sellers — 'View All' Link Text" },

  // ── Editorial Blocks (3 promo cards) ───────────────────────────────────
  { key: "editorial_block1_title",     value: "Luxury Gift Sets",                                 type: "text",     label: "Editorial Block 1 — Heading" },
  { key: "editorial_block1_desc",      value: "The perfect gift for unforgettable moments.",      type: "text",     label: "Editorial Block 1 — Description" },
  { key: "editorial_block1_cta",       value: "Shop Now",                                         type: "text",     label: "Editorial Block 1 — CTA Link Text" },
  { key: "editorial_block1_href",      value: "/shop?category=gift-sets",                         type: "text",     label: "Editorial Block 1 — CTA URL" },
  { key: "editorial_block2_title",     value: "Our Ingredients",                                  type: "text",     label: "Editorial Block 2 — Heading" },
  { key: "editorial_block2_desc",      value: "Responsibly sourced. Exquisitely crafted.",        type: "text",     label: "Editorial Block 2 — Description" },
  { key: "editorial_block2_cta",       value: "Discover More",                                    type: "text",     label: "Editorial Block 2 — CTA Link Text" },
  { key: "editorial_block2_href",      value: "/about#ingredients",                               type: "text",     label: "Editorial Block 2 — CTA URL" },
  { key: "editorial_block3_title",     value: "Signature Collection",                             type: "text",     label: "Editorial Block 3 — Heading" },
  { key: "editorial_block3_desc",      value: "Timeless scents, exceptional craftsmanship.",      type: "text",     label: "Editorial Block 3 — Description" },
  { key: "editorial_block3_cta",       value: "Explore",                                          type: "text",     label: "Editorial Block 3 — CTA Link Text" },
  { key: "editorial_block3_href",      value: "/shop?view=collections",                           type: "text",     label: "Editorial Block 3 — CTA URL" },

  // ── Newsletter Section ─────────────────────────────────────────────────
  { key: "newsletter_title",           value: "Stay Inspired",                                    type: "text",     label: "Newsletter Section Title" },
  { key: "newsletter_body",            value: "Join our exclusive list for early access, new arrivals, and special offers.", type: "text", label: "Newsletter Description" },
  { key: "newsletter_cta",             value: "Subscribe",                                        type: "text",     label: "Newsletter Button Text" },
  { key: "newsletter_placeholder",     value: "Enter your email",                                 type: "text",     label: "Newsletter Input Placeholder" },
  { key: "newsletter_success",         value: "You're inside.",                                   type: "text",     label: "Newsletter Success Message" },

  // ── Shop Page ──────────────────────────────────────────────────────────
  { key: "shop_title",                 value: "The Collection",                                   type: "text",     label: "Shop Page Heading" },
  { key: "shop_subtitle",              value: "Rare ingredients. Masterful blending. Scents that become a second skin.", type: "text", label: "Shop Page Subtitle" },
  { key: "shop_banner_image",          value: "",                                                 type: "image",    label: "Shop Page Banner Image" },

  // ── Brand Story Section ────────────────────────────────────────────────
  { key: "story_eyebrow",              value: "The Maison",                                       type: "text",     label: "Brand Story Eyebrow" },
  { key: "story_title",                value: "Born in the space between darkness and gold.",     type: "text",     label: "Brand Story Headline" },
  { key: "story_body1",                value: "Scentora was founded on a singular obsession: the belief that scent is the most intimate art form. Not seen, not heard — felt.", type: "richtext", label: "Brand Story Paragraph 1" },
  { key: "story_body2",                value: "From our atelier in Paris, every blend begins with a single emotion and is refined until it can communicate that emotion to a stranger without a single word.", type: "richtext", label: "Brand Story Paragraph 2" },
  { key: "story_cta",                  value: "Discover our story",                               type: "text",     label: "Brand Story CTA Text" },
  { key: "story_cta_href",             value: "/about",                                           type: "text",     label: "Brand Story CTA URL" },
  { key: "story_image",                value: "",                                                 type: "image",    label: "Brand Story Section Image" },
  { key: "story_pillar1_number",       value: "01",                                               type: "text",     label: "Pillar 1 Number" },
  { key: "story_pillar1_title",        value: "Rare Ingredients",                                 type: "text",     label: "Pillar 1 Title" },
  { key: "story_pillar1_desc",         value: "We source the finest raw materials — Laotian oud, Bulgarian rose absolute, Mysore sandalwood — from trusted harvesters who share our reverence for nature.", type: "richtext", label: "Pillar 1 Description" },
  { key: "story_pillar2_number",       value: "02",                                               type: "text",     label: "Pillar 2 Number" },
  { key: "story_pillar2_title",        value: "Master Perfumers",                                 type: "text",     label: "Pillar 2 Title" },
  { key: "story_pillar2_desc",         value: "Each Scentora creation is a collaboration between our in-house perfumers and legendary noses from Grasse, refined over months of meticulous iteration.", type: "richtext", label: "Pillar 2 Description" },
  { key: "story_pillar3_number",       value: "03",                                               type: "text",     label: "Pillar 3 Number" },
  { key: "story_pillar3_title",        value: "Enduring Luxury",                                  type: "text",     label: "Pillar 3 Title" },
  { key: "story_pillar3_desc",         value: "From the hand-lacquered flacons to the bespoke atomizers, every object we create is designed to be inherited, not discarded.", type: "richtext", label: "Pillar 3 Description" },

  // ── About Page ─────────────────────────────────────────────────────────
  { key: "about_hero_eyebrow",           value: "The Maison",                                                                                                                              type: "text",     label: "About Hero — Eyebrow" },
  { key: "about_hero_title",             value: "A story told\nin scent",                                                                                                                 type: "text",     label: "About Hero — Headline" },
  { key: "about_hero_subtitle",          value: "Born from a singular obsession — that fragrance is the only art form that speaks without language. Every bottle holds a conversation your words never could.", type: "richtext", label: "About Hero — Subtitle" },
  { key: "about_hero_bg_image",          value: "",                                                                                                                                       type: "image",    label: "About Hero — Background Image" },

  { key: "about_ingredients_eyebrow",    value: "The Source",                                                                                                                             type: "text",     label: "Ingredients — Eyebrow" },
  { key: "about_ingredients_title",      value: "Where Every Note Begins",                                                                                                                type: "text",     label: "Ingredients — Headline" },
  { key: "about_ingredients_body",       value: "We travel the world for singular raw materials. Not compromises — the finest version of each ingredient, sourced with full traceability and respect for the hands that harvest them.", type: "richtext", label: "Ingredients — Body Text" },
  { key: "about_ingredients_image",      value: "",                                                                                                                                       type: "image",    label: "Ingredients — Section Image" },
  { key: "about_ingredient1_name",       value: "Laotian Oud",                                                                                                                            type: "text",     label: "Ingredient 1 — Name" },
  { key: "about_ingredient1_origin",     value: "Laos, Southeast Asia",                                                                                                                   type: "text",     label: "Ingredient 1 — Origin" },
  { key: "about_ingredient1_desc",       value: "Harvested from centuries-old Aquilaria trees in the forests of Laos. Our oud is rich, animalic, and deeply resinous — the backbone of our most celebrated signatures.", type: "richtext", label: "Ingredient 1 — Description" },
  { key: "about_ingredient2_name",       value: "Bulgarian Rose Absolute",                                                                                                                type: "text",     label: "Ingredient 2 — Name" },
  { key: "about_ingredient2_origin",     value: "Rose Valley, Bulgaria",                                                                                                                  type: "text",     label: "Ingredient 2 — Origin" },
  { key: "about_ingredient2_desc",       value: "Distilled by hand during the brief May harvest window. A single kilogram requires five tonnes of petals — its honeyed depth is irreplaceable in fine perfumery.", type: "richtext", label: "Ingredient 2 — Description" },
  { key: "about_ingredient3_name",       value: "Mysore Sandalwood",                                                                                                                      type: "text",     label: "Ingredient 3 — Name" },
  { key: "about_ingredient3_origin",     value: "Karnataka, India",                                                                                                                       type: "text",     label: "Ingredient 3 — Origin" },
  { key: "about_ingredient3_desc",       value: "The gold standard of sandalwood — soft, milky, and endlessly warm. Each source is certified sustainable, respecting both the tree and the communities that tend it.", type: "richtext", label: "Ingredient 3 — Description" },
  { key: "about_ingredient4_name",       value: "Tahitian Vanilla",                                                                                                                       type: "text",     label: "Ingredient 4 — Name" },
  { key: "about_ingredient4_origin",     value: "French Polynesia",                                                                                                                       type: "text",     label: "Ingredient 4 — Origin" },
  { key: "about_ingredient4_desc",       value: "From the rare Vanilla tahitensis orchid, this extract carries floral, anise, and cherry nuances absent in any other vanilla — voluptuous and entirely its own.", type: "richtext", label: "Ingredient 4 — Description" },

  { key: "about_perfumers_eyebrow",      value: "The Noses",                                                                                                                              type: "text",     label: "Perfumers — Eyebrow" },
  { key: "about_perfumers_title",        value: "Masters of Their Craft",                                                                                                                 type: "text",     label: "Perfumers — Headline" },
  { key: "about_perfumers_body",         value: "Our perfumers are not alchemists of trend — they are composers of permanence. Each Scentora creation is refined across hundreds of iterations until it says precisely what it was meant to say.", type: "richtext", label: "Perfumers — Body Text" },
  { key: "about_perfumer1_name",         value: "Jean-Michel Dubois",                                                                                                                     type: "text",     label: "Perfumer 1 — Name" },
  { key: "about_perfumer1_role",         value: "Master Perfumer, Grasse",                                                                                                                type: "text",     label: "Perfumer 1 — Role / Title" },
  { key: "about_perfumer1_bio",          value: "With three decades crafting for the world's most storied houses, Jean-Michel brings an obsessive precision to Scentora's oud-forward compositions. He once spent seven months reworking a single base note.", type: "richtext", label: "Perfumer 1 — Bio" },
  { key: "about_perfumer1_image",        value: "",                                                                                                                                       type: "image",    label: "Perfumer 1 — Portrait Image" },
  { key: "about_perfumer2_name",         value: "Sophia Karim",                                                                                                                           type: "text",     label: "Perfumer 2 — Name" },
  { key: "about_perfumer2_role",         value: "Head of Olfactive Creation",                                                                                                             type: "text",     label: "Perfumer 2 — Role / Title" },
  { key: "about_perfumer2_bio",          value: "A graduate of ISIPCA Versailles and a former nose at Givaudan, Sophia brings a modern sensibility to ancient materials. Her florals are architectural — never sweet, always inevitable.", type: "richtext", label: "Perfumer 2 — Bio" },
  { key: "about_perfumer2_image",        value: "",                                                                                                                                       type: "image",    label: "Perfumer 2 — Portrait Image" },

  { key: "about_atelier_eyebrow",        value: "Visit Us",                                                                                                                               type: "text",     label: "Atelier — Eyebrow" },
  { key: "about_atelier_title",          value: "Our Atelier",                                                                                                                            type: "text",     label: "Atelier — Headline" },
  { key: "about_atelier_body",           value: "Step into our Paris atelier for an immersive private consultation. Our specialists will guide you through the collection, help you discover your signature, or compose a bespoke blend created entirely around you.", type: "richtext", label: "Atelier — Body Text" },
  { key: "about_atelier_address",        value: "12 Rue du Faubourg Saint-Honoré",                                                                                                        type: "text",     label: "Atelier — Street Address" },
  { key: "about_atelier_city",           value: "75008 Paris, France",                                                                                                                    type: "text",     label: "Atelier — City & Postcode" },
  { key: "about_atelier_hours",          value: "Monday–Saturday: 10h–19h",                                                                                                               type: "text",     label: "Atelier — Opening Hours" },
  { key: "about_atelier_email",          value: "demo@demo.com",                                                                                                                    type: "text",     label: "Atelier — Email" },
  { key: "about_atelier_phone",          value: "+33 1 42 00 00 00",                                                                                                                      type: "text",     label: "Atelier — Phone" },
  { key: "about_atelier_image",          value: "",                                                                                                                                       type: "image",    label: "Atelier — Section Image" },

  // ── Footer ─────────────────────────────────────────────────────────────
  { key: "footer_brand_desc",          value: "Luxury fragrance maison dedicated to the art of scent. Each creation is a journey into darkness, light, and the gold that lies between.", type: "richtext", label: "Footer Brand Description" },
  { key: "footer_copyright",           value: `© ${new Date().getFullYear()} Scentora Perfumes. All rights reserved.`, type: "text", label: "Footer Copyright Text" },
  { key: "footer_social_instagram",    value: "#",                                                type: "text",     label: "Instagram Profile URL" },
  { key: "footer_social_facebook",     value: "#",                                                type: "text",     label: "Facebook Profile URL" },
  { key: "footer_social_pinterest",    value: "#",                                                type: "text",     label: "Pinterest Profile URL" },
  { key: "footer_social_tiktok",       value: "#",                                                type: "text",     label: "TikTok Profile URL" },

  // ── AI Chatbot ─────────────────────────────────────────────────────────
  { key: "chatbot_brief", type: "longtext", label: "AI Chatbot — System Brief & Instructions", value: `You are a helpful luxury fragrance assistant for Scentora Perfumes. Answer customer questions about our products, ingredients, shipping, returns, and brand story. Be warm, elegant, and concise. If unsure, direct to demo@demo.com.` },
];

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const existing = await prisma.siteContent.findMany();
  const existingKeys = new Set(existing.map((e) => e.key));

  for (const def of DEFAULT_CONTENT) {
    if (!existingKeys.has(def.key)) {
      await prisma.siteContent.create({ data: def });
    }
  }

  const all = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(all);
}

const patchSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const item = await prisma.siteContent.upsert({
    where: { key: parsed.data.key },
    update: { value: parsed.data.value },
    create: { key: parsed.data.key, value: parsed.data.value },
  });
  return NextResponse.json(item);
}
