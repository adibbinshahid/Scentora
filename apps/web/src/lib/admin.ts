import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  const role = (session.user as any).role as string;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export async function requireAdminRead() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  const role = (session.user as any).role as string;
  if (!["ADMIN", "SUPER_ADMIN", "ADMIN_VIEW"].includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export function adminId(session: any): string {
  return (session?.user as any)?.id as string;
}
