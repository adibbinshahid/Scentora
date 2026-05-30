import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Storage not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { filename, contentType } = await req.json();

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const ext = (filename as string).split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error: urlError } = await supabase.storage
    .from("perfumes")
    .createSignedUploadUrl(path);

  if (urlError || !data) {
    return NextResponse.json(
      { error: urlError?.message ?? "Failed to create upload URL." },
      { status: 500 }
    );
  }

  const { data: publicData } = supabase.storage.from("perfumes").getPublicUrl(path);

  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl: publicData.publicUrl });
}
