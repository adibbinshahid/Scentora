import { NextRequest, NextResponse } from "next/server";
import { prisma } from "db";

// ── Auth ──────────────────────────────────────────────────────────────────────

function verifySecret(req: NextRequest): boolean {
  const secret = process.env.MAINTENANCE_SECRET;
  if (!secret) {
    console.error("[maintenance] MAINTENANCE_SECRET env var not set");
    return false;
  }
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token || token.length !== secret.length) return false;
  let mismatch = 0;
  for (let i = 0; i < secret.length; i++) {
    mismatch |= token.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return mismatch === 0;
}

// ── Checks ────────────────────────────────────────────────────────────────────
// Add new checks here — each returns { name, ok, detail? }

async function checkDatabase(): Promise<{ name: string; ok: boolean; detail?: string }> {
  try {
    const row = await prisma.siteContent.findFirst({ select: { key: true } });
    return { name: "database", ok: true, detail: row ? `first_key=${row.key}` : "empty table" };
  } catch (err) {
    // Extract only the last line of the error (Prisma prepends a long stack)
    const full = err instanceof Error ? err.message : String(err);
    const msg = full.split("\n").filter(Boolean).at(-1)?.trim() ?? full;
    console.error("[maintenance] db check failed:", msg);
    return { name: "database", ok: false, detail: msg };
  }
}

// Future checks — uncomment or add more below:
// async function checkStorage() { ... }
// async function checkQueue()   { ... }

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const start = Date.now();

  if (!verifySecret(req)) {
    console.warn("[maintenance] unauthorized attempt from", req.headers.get("x-forwarded-for") ?? "unknown");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[maintenance] run started");

  const results = await Promise.allSettled([
    checkDatabase(),
    // add more check calls here
  ]);

  const checks = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { name: "unknown", ok: false, detail: String((r as PromiseRejectedResult).reason) }
  );

  const allOk = checks.every((c) => c.ok);
  const elapsed = Date.now() - start;

  console.log(`[maintenance] done in ${elapsed}ms — ${allOk ? "OK" : "DEGRADED"}`, JSON.stringify(checks));

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      elapsed_ms: elapsed,
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
