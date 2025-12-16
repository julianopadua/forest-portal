// src/app/settings/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join");
  }

  // Busca dados atuais do perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        {/* Passamos os dados para o componente Client-Side */}
        <ProfileForm initialData={{
          full_name: profile?.full_name ?? "",
          username: profile?.username ?? "",
          bio: profile?.bio ?? ""
        }} />
      </div>
    </div>
  );
}