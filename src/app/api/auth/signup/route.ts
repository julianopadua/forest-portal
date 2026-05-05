// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

function normalizeUsername(u: string) {
  return u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function makeSyntheticEmail(username: string) {
  return `${username}@noemail.local`;
}

export async function POST(request: NextRequest) {
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
  const usernameRaw = String(body?.username ?? "");
  const username = normalizeUsername(usernameRaw);
  const fullName = body?.full_name ? String(body.full_name).trim() : "";
  const password = String(body?.password ?? "");

  if (username.length < 3) {
    return NextResponse.json({ ok: false, error: "Username inválido" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ ok: false, error: "Password inválida" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing?.id) {
    return NextResponse.json({ ok: false, error: "Username já existe" }, { status: 409 });
  }

  const authEmail = makeSyntheticEmail(username);
  const displayName = fullName || username;

  const admin = createAdminClient();
  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email: authEmail,
    password,
    email_confirm: true,
    user_metadata: { username, full_name: displayName },
  });

  if (cErr || !created.user?.id) {
    return NextResponse.json({ ok: false, error: cErr?.message ?? "Signup failed" }, { status: 400 });
  }

  await admin.from("profiles").upsert(
    { id: created.user.id, username, full_name: displayName },
    { onConflict: "id" }
  );

  const { data, error: sErr } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password,
  });

  if (sErr || !data.session) {
    return NextResponse.json({ ok: false, error: "Signup ok, signin failed" }, { status: 400 });
  }

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
