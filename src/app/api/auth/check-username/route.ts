// src/app/api/auth/check-username/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizeUsername(u: string) {
  return u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("username") ?? "";
  const username = normalizeUsername(raw);

  if (username.length < 3) {
    return NextResponse.json({ available: false, reason: "too_short" });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  return NextResponse.json({ available: !data?.id });
}
