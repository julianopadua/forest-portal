// src/app/admin/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, username, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel Admin</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Logado como @{profile.username}
        </p>
      </div>

      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <p className="text-[color:var(--muted)]">
          Área reservada para administradores. Funcionalidades em construção.
        </p>
      </div>
    </div>
  );
}
