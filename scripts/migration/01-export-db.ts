/**
 * Step 1 — Export every row from the current (Supabase) Postgres to JSON.
 * Read-only against the source. Safe to re-run.
 *
 * Run from apps/web:  npx tsx ../../scripts/migration/01-export-db.ts
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// FK-safe order: parents before children.
const MODELS = [
  "user",
  "category",
  "product",
  "variant",
  "address",
  "order",
  "orderItem",
  "coupon",
  "review",
  "wishlistItem",
  "siteContent",
  "scrollAd",
] as const;

const OUT_DIR = join(__dirname, "data");

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const dump: Record<string, unknown[]> = {};
  for (const model of MODELS) {
    const rows = await (prisma as any)[model].findMany();
    dump[model] = rows;
    console.log(`${model.padEnd(14)} ${rows.length}`);
  }

  const path = join(OUT_DIR, "db-export.json");
  writeFileSync(path, JSON.stringify(dump, null, 2));
  console.log(`\nWrote ${path}`);
}

main()
  .catch((e) => {
    console.error("EXPORT FAILED:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
