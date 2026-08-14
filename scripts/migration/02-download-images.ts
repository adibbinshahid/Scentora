/**
 * Step 2 — Download every image referenced by the DB (and everything in the
 * Supabase `perfumes` bucket) to scripts/migration/data/images/.
 * Read-only against Supabase. Safe to re-run.
 *
 * Run from apps/web:  npx tsx ../../scripts/migration/02-download-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";

const DATA_DIR = join(__dirname, "data");
const IMG_DIR = join(DATA_DIR, "images");
const BUCKET = "perfumes";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Pull every supabase.co URL out of the DB export. */
function referencedUrls(): Set<string> {
  const dump = JSON.parse(readFileSync(join(DATA_DIR, "db-export.json"), "utf8"));
  const urls = new Set<string>();

  for (const p of dump.product ?? []) {
    let list: string[];
    try {
      const parsed = JSON.parse(p.images);
      list = Array.isArray(parsed) ? parsed : [p.images];
    } catch {
      list = String(p.images).split(",");
    }
    list.map((u) => String(u).trim()).filter((u) => u.includes("supabase.co")).forEach((u) => urls.add(u));
  }

  for (const c of dump.siteContent ?? []) {
    const v = String(c.value ?? "").trim();
    if (v.includes("supabase.co")) urls.add(v);
  }

  return urls;
}

async function main() {
  mkdirSync(IMG_DIR, { recursive: true });

  const refs = referencedUrls();
  console.log(`DB references ${refs.size} Supabase image URL(s)`);

  // Everything actually sitting in the bucket.
  const { data: objects, error } = await supabase.storage.from(BUCKET).list("", { limit: 1000 });
  if (error) throw new Error(`bucket list failed: ${error.message}`);
  console.log(`Bucket holds ${objects.length} object(s)`);

  // Download the union: bucket contents + anything the DB points at.
  const names = new Set(objects.map((o) => o.name));
  for (const url of refs) names.add(decodeURIComponent(basename(new URL(url).pathname)));

  const manifest: Record<string, { file: string; bytes: number }> = {};
  let failed = 0;

  for (const name of names) {
    const { data, error: dlErr } = await supabase.storage.from(BUCKET).download(name);
    if (dlErr || !data) {
      console.error(`  MISS ${name} — ${dlErr?.message ?? "no data"}`);
      failed++;
      continue;
    }
    const buf = Buffer.from(await data.arrayBuffer());
    writeFileSync(join(IMG_DIR, name), buf);

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(name);
    manifest[pub.publicUrl] = { file: name, bytes: buf.length };
    console.log(`  ok   ${name} (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  writeFileSync(join(DATA_DIR, "image-manifest.json"), JSON.stringify(manifest, null, 2));

  // Every DB-referenced URL must have downloaded, or the rewrite step will break the site.
  const missing = [...refs].filter((u) => !(u in manifest));
  console.log(`\nDownloaded ${Object.keys(manifest).length}, failed ${failed}`);
  if (missing.length) {
    console.error(`\nDB-REFERENCED URLS NOT DOWNLOADED (${missing.length}):`);
    missing.forEach((u) => console.error("  " + u));
    process.exit(1);
  }
  console.log("All DB-referenced images downloaded.");
}

main().catch((e) => {
  console.error("DOWNLOAD FAILED:", e.message);
  process.exit(1);
});
