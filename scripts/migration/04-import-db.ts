/**
 * Step 4 — Import the JSON export into the NEW (Neon) database.
 *
 * Prerequisite: point DATABASE_URL/DIRECT_URL at Neon and run
 *   npx prisma db push --schema=packages/db/prisma/schema.prisma
 * to create the schema first.
 *
 * Refuses to run against Supabase, and refuses to run against a non-empty
 * database, so it cannot silently double-import or clobber the source.
 *
 * Run from apps/web:  npx tsx ../../scripts/migration/04-import-db.ts
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma: any = new PrismaClient();

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

async function main() {
  const target = process.env.DATABASE_URL ?? "";
  if (target.includes("supabase")) {
    console.error("DATABASE_URL still points at Supabase. Switch it to Neon before importing.");
    process.exit(1);
  }

  // Guard: never import into a database that already has rows.
  const existing = await Promise.all(MODELS.map((m) => prisma[m].count()));
  const total = existing.reduce((a: number, b: number) => a + b, 0);
  if (total > 0) {
    console.error(`Target database is not empty (${total} rows). Refusing to import.`);
    MODELS.forEach((m, i) => existing[i] && console.error(`  ${m} = ${existing[i]}`));
    process.exit(1);
  }

  const dump = JSON.parse(readFileSync(join(__dirname, "data", "db-export.json"), "utf8"));

  for (const model of MODELS) {
    const rows = dump[model] ?? [];
    if (!rows.length) {
      console.log(`${model.padEnd(14)} 0 (skipped)`);
      continue;
    }
    // createMany keeps the original cuid ids, so every FK stays valid.
    const res = await prisma[model].createMany({ data: rows });
    console.log(`${model.padEnd(14)} ${res.count}`);
  }

  console.log("\nVerifying row counts...");
  let mismatch = false;
  for (const model of MODELS) {
    const expected = (dump[model] ?? []).length;
    const actual = await prisma[model].count();
    if (expected !== actual) {
      console.error(`  MISMATCH ${model}: expected ${expected}, got ${actual}`);
      mismatch = true;
    }
  }
  if (mismatch) process.exit(1);
  console.log("All row counts match.");
}

main()
  .catch((e) => {
    console.error("IMPORT FAILED:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
