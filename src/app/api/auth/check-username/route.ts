// src/app/api/auth/check-username/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { allowFor } from "@/lib/rateLimit";

function normalizeUsername(u: string) {
  return u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

//signup-form ux is a debounced single check per typed username, so the
//honest budget is small. anything above this rate looks like enumeration.
const CHECK_MAX = 8;
const CHECK_WINDOW_MS = 30_000;

export async function GET(request: NextRequest) {
  if (!allowFor("auth.check_username", request, CHECK_MAX, CHECK_WINDOW_MS)) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "30" } },
    );
  }

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
