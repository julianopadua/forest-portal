// src/components/auth/AuthForm.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";
import { createClient } from "@/lib/supabase/client";

export type AuthMode = "signin" | "signup";
type Msg = { type: "error" | "success"; text: string };
type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function normalizeUsername(u: string) {
  return u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export default function AuthForm(props: {
  mode: AuthMode;
  setMode: (m: AuthMode) => void;
  onSuccess?: () => void;
}) {
  const { mode, setMode, onSuccess } = props;

  const { locale, dict } = useI18n();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  // signin
  const [identifier, setIdentifier] = useState("");

  // signup
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");

  // both
  const [password, setPassword] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ui = useMemo(() => {
    const isPt = locale === "pt";
    return {
      username: "Username",
      fullNameOpt: isPt ? "Nome completo (opcional)" : "Full name (optional)",
      password: dict.common.password,
      submit: dict.common.submit,
      createAccount: dict.common.createAccount,
      signIn: dict.common.signIn,
      processing: isPt ? "Processando..." : "Processing...",
      noAccount: isPt ? "Não tenho conta. Criar cadastro" : "Don't have an account? Create one",
      haveAccount: isPt ? "Já tenho conta. Entrar" : "Already have an account? Sign in",
      badUsername: isPt ? "Username mínimo 3 caracteres (a-z, 0-9, . _ -)" : "Username min 3 chars (a-z, 0-9, . _ -)",
      usernameTaken: isPt ? "Username já em uso" : "Username already taken",
      usernameAvailable: isPt ? "Username disponível" : "Username available",
      usernameChecking: isPt ? "Verificando..." : "Checking...",
    };
  }, [dict, locale]);

  const checkUsername = useCallback(async (raw: string) => {
    const u = normalizeUsername(raw);
    if (u.length < 3) {
      setUsernameStatus(u.length === 0 ? "idle" : "invalid");
      return;
    }
    setUsernameStatus("checking");
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(u)}`);
      const data = await res.json();
      setUsernameStatus(data.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (mode !== "signup") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkUsername(username), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username, mode, checkUsername]);

  async function postJSON(url: string, body: unknown) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "Error");
    return data;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMsg(null);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const id = identifier.trim();
        if (!id) throw new Error("Missing username");
        const data = await postJSON("/api/auth/login", { identifier: id, password });
        // setSession garante que o cliente browser dispara onAuthStateChange
        await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
        router.refresh();
        onSuccess?.();
        return;
      }

      // signup
      const u = normalizeUsername(username);
      if (u.length < 3) throw new Error(ui.badUsername);
      if (usernameStatus === "taken") throw new Error(ui.usernameTaken);

      const data = await postJSON("/api/auth/signup", {
        username: u,
        full_name: fullName.trim() || null,
        password,
      });

      await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
      router.refresh();
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error";
      setMsg({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]";

  const usernameHintColor =
    usernameStatus === "available"
      ? "text-green-400"
      : usernameStatus === "taken"
      ? "text-red-400"
      : "text-[color:var(--muted)]";

  const usernameHint =
    usernameStatus === "available"
      ? ui.usernameAvailable
      : usernameStatus === "taken"
      ? ui.usernameTaken
      : usernameStatus === "checking"
      ? ui.usernameChecking
      : usernameStatus === "invalid"
      ? ui.badUsername
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {mode === "signin" ? (
        <input
          className={inputClass}
          placeholder={ui.username}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
        />
      ) : (
        <>
          <input
            className={inputClass}
            placeholder={ui.fullNameOpt}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />

          <div>
            <input
              className={inputClass}
              placeholder={ui.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
            />
            {usernameHint && (
              <p className={`mt-1 px-1 text-xs ${usernameHintColor}`}>{usernameHint}</p>
            )}
          </div>
        </>
      )}

      <input
        className={inputClass}
        placeholder={ui.password}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        autoComplete={mode === "signin" ? "current-password" : "new-password"}
        required
      />

      {msg && (
        <div
          className={`text-sm p-3 rounded-lg border ${
            msg.type === "error"
              ? "border-red-500/20 text-red-400"
              : "border-green-500/20 text-green-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      <Button
        className="w-full"
        type="submit"
        disabled={isLoading || (mode === "signup" && usernameStatus === "taken")}
      >
        {isLoading
          ? ui.processing
          : mode === "signup"
          ? ui.createAccount
          : ui.submit}
      </Button>

      <button
        type="button"
        className="w-full text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
        onClick={() => {
          setMsg(null);
          setUsernameStatus("idle");
          setMode(mode === "signup" ? "signin" : "signup");
        }}
      >
        {mode === "signup" ? ui.haveAccount : ui.noAccount}
      </button>
    </form>
  );
}
