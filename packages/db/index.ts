import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function resolveDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Candidate paths in priority order: Vercel serverless cwd variants, then __dirname-relative
  const candidates = [
    path.join(process.cwd(), "prisma/dev.db"),
    path.join(process.cwd(), "../../packages/db/prisma/dev.db"),
    path.join(__dirname, "../prisma/dev.db"),
    path.join(__dirname, "../../prisma/dev.db"),
    path.join(__dirname, "prisma/dev.db"),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return `file:${p}`;
    } catch {}
  }

  return `file:${path.join(process.cwd(), "prisma/dev.db")}`;
}

const dbUrl = resolveDbUrl();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export * from "@prisma/client";
export { Decimal } from "@prisma/client/runtime/library";
