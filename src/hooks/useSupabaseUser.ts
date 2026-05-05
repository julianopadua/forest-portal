// src/hooks/useSupabaseUser.ts
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  role: "user" | "admin";
};

export function useSupabaseUser() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, role")
      .eq("id", userId)
      .maybeSingle();

    setProfile(
      data
        ? { id: data.id, username: data.username, full_name: data.full_name, role: (data.role as "user" | "admin") ?? "user" }
        : null
    );
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!alive) return;
      if (error || !data.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(data.user);
      await loadProfile(data.user.id);
      if (alive) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadProfile(u.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, profile, loading };
}
