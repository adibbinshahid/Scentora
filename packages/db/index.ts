import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Ensure DATABASE_URL is always set so Prisma client can initialize
// during Vercel build-time prerendering even without env vars configured
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export * from "@prisma/client";
export { Decimal } from "@prisma/client/runtime/library";
