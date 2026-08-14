/**
 * Step 5 — Rewrite every Supabase image URL in the NEW database to its
 * Vercel Blob equivalent, using data/url-map.json.
 *
 * Run with --dry to preview without writing.
 * Run from apps/web:  npx tsx ../../scripts/migration/05-rewrite-urls.ts --dry
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");

async function main() {
  const target = process.env.DATABASE_URL ?? "";
  if (target.includes("supabase")) {
    console.error("DATABASE_URL still points at Supabase. Point it at Neon first.");
    process.exit(1);
  }

  const urlMap: Record<string, string> = JSON.parse(
    readFileSync(join(__dirname, "data", "url-map.json"), "utf8")
  );
  console.log(`${DRY ? "[DRY RUN] " : ""}Loaded ${Object.keys(urlMap).length} URL mapping(s)\n`);

  const unmapped: string[] = [];
  const remap = (u: string): string => {
    const t = u.trim();
    if (!t.includes("supabase.co")) return t;
    const mapped = urlMap[t];
    if (!mapped) {
      unmapped.push(t);
      return t;
    }
    return mapped;
  };

  // --- Product.images (JSON-stringified array, or comma-separated legacy) ---
  let productsChanged = 0;
  for (const p of await prisma.product.findMany({ select: { id: true, images: true } })) {
    let list: string[];
    let wasJson = true;
    try {
      const parsed = JSON.parse(p.images);
      list = Array.isArray(parsed) ? parsed.map(String) : [String(p.images)];
    } catch {
      list = String(p.images).split(",");
      wasJson = false;
    }

    const next = list.map(remap);
    if (JSON.stringify(next) === JSON.stringify(list.map((s) => s.trim()))) continue;

    // Normalise to JSON on write — the app already reads both shapes.
    const value = wasJson ? JSON.stringify(next) : next.join(",");
    if (!DRY) await prisma.product.update({ where: { id: p.id }, data: { images: value } });
    productsChanged++;
  }

  // --- SiteContent rows whose value is an image URL ---
  let contentChanged = 0;
  for (const c of await prisma.siteContent.findMany({ select: { id: true, value: true } })) {
    const v = String(c.value ?? "");
    if (!v.includes("supabase.co")) continue;
    const next = remap(v);
    if (next === v.trim()) continue;
    if (!DRY) await prisma.siteContent.update({ where: { id: c.id }, data: { value: next } });
    contentChanged++;
  }

  console.log(`Product rows ${DRY ? "to change" : "changed"}:     ${productsChanged}`);
  console.log(`SiteContent rows ${DRY ? "to change" : "changed"}: ${contentChanged}`);

  if (unmapped.length) {
    console.error(`\nUNMAPPED SUPABASE URLS (${unmapped.length}) — these would stay broken:`);
    [...new Set(unmapped)].forEach((u) => console.error("  " + u));
    process.exit(1);
  }

  if (!DRY) {
    // Final sweep: nothing anywhere should still point at Supabase.
    const prods = await prisma.product.findMany({ select: { images: true } });
    const content = await prisma.siteContent.findMany({ select: { value: true } });
    const left =
      prods.filter((p) => p.images.includes("supabase.co")).length +
      content.filter((c) => String(c.value).includes("supabase.co")).length;
    console.log(left === 0 ? "\nNo Supabase URLs remain in the database." : `\nWARNING: ${left} row(s) still reference Supabase.`);
    if (left > 0) process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("REWRITE FAILED:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
