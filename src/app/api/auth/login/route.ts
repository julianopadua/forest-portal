// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

function isEmailLike(v: string) {
  return v.includes("@") && v.includes(".");
}

export async function POST(request: NextRequest) {
  // cookieResponse acumula os Set-Cookie emitidos pelo supabase client
  let cookieResponse = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookieResponse = NextResponse.json({ ok: true });
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieResponse.cookies.set(name, value, options);
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

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  // Copia os cookies de sessão para a resposta final com o token no body
  const final = NextResponse.json({
    ok: true,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  cookieResponse.cookies.getAll().forEach(({ name, value, ...opts }) =>
    final.cookies.set(name, value, opts)
  );
  return final;
}
