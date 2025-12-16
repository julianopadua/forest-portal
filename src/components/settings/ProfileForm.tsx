// src/components/settings/ProfileForm.tsx
"use client";

import { useActionState } from "react"; 
import { updateProfile, ProfileState } from "@/app/actions/profile";
import Button from "@/components/ui/Button";

interface ProfileFormProps {
  initialData: {
    email: string; // Novo campo
    full_name: string | null;
    username: string | null;
    bio: string | null;
  };
}

const initialState: ProfileState = {
  status: 'idle',
  message: ''
};

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      
      {state.status !== 'idle' && (
        <div className={`p-3 rounded-lg text-sm ${
          state.status === 'success' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {state.message}
        </div>
      )}

      {/* Email (Read Only - Vem do Auth) */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-2">
          Email Address
        </label>
        <input
          disabled
          value={initialData.email}
          className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-zinc-400 cursor-not-allowed opacity-70"
        />
        <p className="mt-1 text-[10px] text-zinc-600">Email cannot be changed directly.</p>
      </div>

      {/* Nome Completo */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Full Name</label>
        <input
          name="fullName"
          defaultValue={initialData.full_name || ""}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/30 focus:outline-none"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Username</label>
        <input
          name="username"
          defaultValue={initialData.username || ""}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/30 focus:outline-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Bio</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={initialData.bio || ""}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/30 focus:outline-none resize-none"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}