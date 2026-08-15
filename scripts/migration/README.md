# Supabase → Neon + Vercel Blob migration

One-off migration. Delete this directory once production is verified.

All commands run from `apps/web`.

## Status

| Step | What | State |
|---|---|---|
| 1 | Export Supabase DB → JSON | **done** — 612 rows in `data/db-export.json` |
| 2 | Download Storage images | **done** — 24 files (~28 MB) in `data/images/` |
| — | Code moved to Vercel Blob | **done** — routes, call-sites, next.config, deps |
| 4 | Import JSON → Neon | **done** — schema pushed, 612 rows, counts verified |
| 3 | Upload images → Vercel Blob | blocked: needs `BLOB_READ_WRITE_TOKEN` |
| 5 | Rewrite image URLs in Neon | blocked: needs 3 |

Steps 3 and 4 are independent, so 4 ran first. The app now reads from Neon;
image URLs in the database still point at Supabase until step 5, so product
pages currently 500 on `next/image` with an "unconfigured hostname" error.
That is expected mid-migration.

## Environment notes

There are three `.env` files. Both live ones now point at Neon:

- `.env` (root) — what the running app resolves
- `apps/web/.env` — what the Prisma CLI resolves when run from `apps/web`
- `packages/db/.env` — was a stale SQLite leftover (`file:./dev.db`) against a
  `postgresql` provider; retired to `.env.stale-sqlite-backup`

Supabase values are commented inline in both live files, and full copies are
at `.env.supabase-backup` (root and `apps/web`). Root `.gitignore` was
widened from `**/.env` to `**/.env*` so those backups cannot be committed.

Neon free tier scales to zero — the first query after an idle period can time
out. Just re-run; the scripts are safe to retry.

`data/` is gitignored — it holds password hashes, customer orders, and image
binaries. Never commit it.

## What you must create

Two accounts. Nothing else is manual.

1. **Neon** — <https://console.neon.tech> → new project, region close to your
   users. Copy the pooled and direct connection strings.
2. **Vercel Blob** — Vercel dashboard → Storage → Create → Blob. Copy the
   `BLOB_READ_WRITE_TOKEN`.

Put them in `apps/web/.env`:

```
DATABASE_URL="<neon pooled connection string>"
DIRECT_URL="<neon direct connection string>"
BLOB_READ_WRITE_TOKEN="<vercel blob token>"
```

Keep the old Supabase values commented out until production is verified — they
are the rollback.

## Remaining steps

```bash
# 3 — images to Blob (writes data/url-map.json)
npx tsx --env-file=.env ../../scripts/migration/03-upload-to-blob.ts

# 4 — create schema on Neon, then import rows
npx prisma db push --schema=../../packages/db/prisma/schema.prisma
npx tsx ../../scripts/migration/04-import-db.ts

# 5 — point image URLs at Blob (preview first)
npx tsx ../../scripts/migration/05-rewrite-urls.ts --dry
npx tsx ../../scripts/migration/05-rewrite-urls.ts
```

Then set the same three env vars in Vercel project settings and redeploy.

## Safety rails already built in

- `04-import-db.ts` refuses to run if `DATABASE_URL` still contains
  `supabase`, and refuses to import into a non-empty database.
- `05-rewrite-urls.ts` has the same Supabase guard, supports `--dry`, and
  exits non-zero if any Supabase URL is left unmapped or unrewritten.
- `01`/`02` are read-only against Supabase and safe to re-run.

## Verify before deleting the Supabase project

- Storefront product images load.
- Admin → Content and Admin → Products image uploads succeed.
- Row counts match: product 10, variant 20, order 42, orderItem 69,
  review 349, siteContent 112, category 3, coupon 3, user 3, address 1.
- `grep -ri supabase apps/web/src` returns nothing.

## Known unrelated issue

`npx tsc --noEmit` reports 7 pre-existing errors in admin API routes
(`revalidateTag`/`revalidatePath` signature drift on Next 16). Masked by
`typescript.ignoreBuildErrors` in `next.config.ts`. Not caused by this
migration, not fixed by it.
