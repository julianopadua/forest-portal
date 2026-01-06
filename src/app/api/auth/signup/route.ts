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
  const usernameRaw = String(body?.username ?? "");
  const username = normalizeUsername(usernameRaw);
  const emailInput = body?.email ? String(body.email).trim() : "";
  const password = String(body?.password ?? "");

  if (username.length < 3) {
    return NextResponse.json({ ok: false, error: "Username inválido" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ ok: false, error: "Password inválida" }, { status: 400 });
  }

  // garante username único
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing?.id) {
    return NextResponse.json({ ok: false, error: "Username já existe" }, { status: 409 });
  }

  const authEmail = emailInput || makeSyntheticEmail(username);

  // cria user no auth via service role (email_confirm true para cadastro direto)
  const admin = createAdminClient();
  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email: authEmail,
    password,
    email_confirm: true,
    user_metadata: {
      username,
      full_name: username,
    },
  });

  if (cErr || !created.user?.id) {
    return NextResponse.json({ ok: false, error: cErr?.message ?? "Signup failed" }, { status: 400 });
  }

  // garante username no profiles (trigger pode ter criado sem username)
  await admin.from("profiles").upsert(
    { id: created.user.id, username, full_name: username },
    { onConflict: "id" }
  );

  // cria sessão (cookies) já logado
  const { error: sErr } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password,
  });

  if (sErr) {
    return NextResponse.json({ ok: false, error: "Signup ok, signin failed" }, { status: 400 });
  }

  return response;
}
