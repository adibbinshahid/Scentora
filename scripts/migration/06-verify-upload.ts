/**
 * Verifies the full admin upload path end-to-end:
 *   login -> POST /api/admin/upload (mint client token) -> PUT to Blob
 *
 * Creates a temporary admin user, then deletes it and the test blob in a
 * finally block so nothing is left behind.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { put, del } from "@vercel/blob";

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3001";
const TEMP_EMAIL = "__migration-verify@temp.local";
const TEMP_PW = "verify-" + Math.random().toString(36).slice(2);

const prisma = new PrismaClient();
let tempUserId: string | null = null;
let blobUrl: string | null = null;

function cookieJar() {
  const jar = new Map<string, string>();
  return {
    header: () => [...jar].map(([k, v]) => `${k}=${v}`).join("; "),
    absorb: (res: Response) => {
      for (const c of res.headers.getSetCookie?.() ?? []) {
        const [pair] = c.split(";");
        const i = pair.indexOf("=");
        if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
      }
    },
  };
}

async function main() {
  // 1. temp admin
  const u = await prisma.user.create({
    data: {
      email: TEMP_EMAIL,
      name: "migration-verify",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(TEMP_PW, 10),
    },
  });
  tempUserId = u.id;
  console.log("1. temp admin created");

  // 2. login
  const jar = cookieJar();
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  jar.absorb(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: jar.header() },
    body: new URLSearchParams({ csrfToken, email: TEMP_EMAIL, password: TEMP_PW, redirect: "false" }),
    redirect: "manual",
  });
  jar.absorb(loginRes);

  const session = await (await fetch(`${BASE}/api/auth/session`, { headers: { Cookie: jar.header() } })).json();
  if (!session?.user) throw new Error("login failed — no session established");
  console.log(`2. logged in as ${session.user.email} (${session.user.role ?? "?"})`);

  // 3. mint a client token through the real route
  const tokenRes = await fetch(`${BASE}/api/admin/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: jar.header() },
    body: JSON.stringify({
      type: "blob.generate-client-token",
      payload: {
        pathname: "migration-verify.png",
        callbackUrl: `${BASE}/api/admin/upload`,
        clientPayload: null,
        multipart: false,
      },
    }),
  });
  const tokenBody = await tokenRes.json();
  if (!tokenRes.ok || !tokenBody?.clientToken) {
    throw new Error(`token mint failed (${tokenRes.status}): ${JSON.stringify(tokenBody)}`);
  }
  console.log("3. client token minted by /api/admin/upload");

  // 4. upload with that token — the same call the browser makes
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  const blob = await put("migration-verify.png", png, {
    access: "public",
    contentType: "image/png",
    token: tokenBody.clientToken,
  });
  blobUrl = blob.url;
  console.log(`4. uploaded via client token -> ${blob.url}`);

  // 5. publicly readable?
  const check = await fetch(blob.url);
  console.log(`5. public fetch = ${check.status} ${check.headers.get("content-type")}`);
  if (!check.ok) throw new Error("uploaded blob is not publicly readable");

  // 6. unauthenticated call must be rejected
  const anon = await fetch(`${BASE}/api/admin/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "blob.generate-client-token",
      payload: { pathname: "hack.png", callbackUrl: `${BASE}/api/admin/upload`, clientPayload: null, multipart: false },
    }),
  });
  console.log(`6. unauthenticated mint = ${anon.status} (must not be 200)`);
  if (anon.ok) throw new Error("SECURITY: unauthenticated caller was issued a token");

  console.log("\nUPLOAD PATH VERIFIED");
}

main()
  .catch((e) => {
    console.error("\nFAILED:", e.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (blobUrl) {
      try {
        await del(blobUrl);
        console.log("cleanup: test blob deleted");
      } catch (e: any) {
        console.error("cleanup: blob delete failed —", e.message);
      }
    }
    if (tempUserId) {
      await prisma.user.delete({ where: { id: tempUserId } });
      console.log("cleanup: temp admin deleted");
    }
    await prisma.$disconnect();
  });
