// src/app/join/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";

export default function JoinPage() {
  const { dict } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Login e Cadastro
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Fluxo de Cadastro
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      } else {
        // Fluxo de Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        router.push("/"); // Redireciona para home após login
        router.refresh(); // Atualiza Server Components
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 flex justify-center">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold mb-2">
          {isSignUp ? "Create Account" : dict.join.title}
        </h1>
        <p className="mb-6 text-zinc-300 text-sm">
          {isSignUp ? "Enter your details below to create your account" : dict.join.body}
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {errorMsg}
            </div>
          )}

          <div className="mt-2 flex flex-col gap-3">
            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className={cn(isLoading && "opacity-50 cursor-not-allowed")}
            >
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : dict.join.continue}
            </Button>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-zinc-400 hover:text-white transition-colors underline"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>

            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                {dict.join.backHome}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}