// src/app/actions/profile.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Definindo o tipo do estado de retorno
export type ProfileState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { status: 'error', message: "User not authenticated" };
  }

  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      username: username,
      bio: bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { status: 'error', message: "Failed to update profile." };
  }

  revalidatePath("/settings");
  
  return { status: 'success', message: "Profile updated successfully!" };
}