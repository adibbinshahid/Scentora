/**
 * Step 3 — Upload every downloaded image to Vercel Blob, recording an
 * old-URL -> new-URL map for the DB rewrite in step 5.
 *
 * Needs BLOB_READ_WRITE_TOKEN in the environment.
 * Run from apps/web:  npx tsx --env-file=.env ../../scripts/migration/03-upload-to-blob.ts
 */
import { put } from "@vercel/blob";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(__dirname, "data");
const IMG_DIR = join(DATA_DIR, "images");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set. Add it to apps/web/.env first.");
    process.exit(1);
  }

  // old public URL -> { file }
  const manifest: Record<string, { file: string; bytes: number }> = JSON.parse(
    readFileSync(join(DATA_DIR, "image-manifest.json"), "utf8")
  );
  const fileToOldUrl = new Map(Object.entries(manifest).map(([url, m]) => [m.file, url]));

  const files = readdirSync(IMG_DIR);
  console.log(`Uploading ${files.length} image(s) to Vercel Blob...\n`);

  const urlMap: Record<string, string> = {};

  for (const file of files) {
    const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
    const buf = readFileSync(join(IMG_DIR, file));

    const blob = await put(file, buf, {
      access: "public",
      contentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
      // Keep the original filename so the mapping stays one-to-one and re-runs are idempotent.
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const oldUrl = fileToOldUrl.get(file);
    if (oldUrl) urlMap[oldUrl] = blob.url;
    console.log(`  ok ${file} -> ${blob.url}`);
  }

  writeFileSync(join(DATA_DIR, "url-map.json"), JSON.stringify(urlMap, null, 2));
  console.log(`\nMapped ${Object.keys(urlMap).length} URL(s). Wrote data/url-map.json`);
}

main().catch((e) => {
  console.error("UPLOAD FAILED:", e.message);
  process.exit(1);
});
