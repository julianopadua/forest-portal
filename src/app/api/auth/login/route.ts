// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

function isEmailLike(v: string) {
  return v.includes("@") && v.includes(".");
}

export async function POST(request: NextRequest) {
  let response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          response = NextResponse.json({ ok: true });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const body = await request.json().catch(() => null);
  const identifier = String(body?.identifier ?? "").trim();
  const password = String(body?.password ?? "");

  if (!identifier || !password) {
    return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
  }

  let email = identifier;

  // se for username, resolve id -> email real no auth.users via service role
  if (!isEmailLike(identifier)) {
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", identifier)
      .maybeSingle();

    if (pErr || !profile?.id) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: uRes, error: uErr } = await admin.auth.admin.getUserById(profile.id);

    if (uErr || !uRes?.user?.email) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    email = uRes.user.email;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  return response;
}
