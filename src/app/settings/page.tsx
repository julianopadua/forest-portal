// src/app/settings/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Pega o Usuário (Auth) - Onde mora o EMAIL
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join");
  }

  // 2. Pega o Perfil (Public) - Onde mora a BIO/NOME
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
      
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <ProfileForm 
          initialData={{
            email: user.email || "", // Passamos o email aqui!
            full_name: profile?.full_name ?? "",
            username: profile?.username ?? "",
            bio: profile?.bio ?? ""
          }} 
        />
      </div>
    </div>
  );
}