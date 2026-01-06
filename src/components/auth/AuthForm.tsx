// src/components/auth/AuthForm.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export type AuthMode = "signin" | "signup";
type Msg = { type: "error" | "success"; text: string };

function isEmailLike(v: string) {
  return v.includes("@") && v.includes(".");
}

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
  const [email, setEmail] = useState("");

  // both
  const [password, setPassword] = useState("");

  const ui = useMemo(() => {
    const isPt = locale === "pt";
    return {
      identifier: isPt ? "Username ou email" : "Username or email",
      username: isPt ? "Username" : "Username",
      emailOpt: isPt ? "Email (opcional)" : "Email (optional)",
      password: dict.common.password,
      submit: dict.common.submit,
      createAccount: dict.common.createAccount,
      signIn: dict.common.signIn,
      processing: isPt ? "Processando..." : "Processing...",
      noAccount: isPt ? "Não tenho conta. Criar cadastro" : "Don't have an account? Create one",
      haveAccount: isPt ? "Já tenho conta. Entrar" : "Already have an account? Sign in",
      badUsername: isPt ? "Username mínimo 3 caracteres (a-z, 0-9, . _ -)" : "Username min 3 chars (a-z, 0-9, . _ -)",
    };
  }, [dict, locale]);

  async function postJSON(url: string, body: any) {
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
      if (mode === "signin") {
        const id = identifier.trim();
        if (!id) throw new Error("Missing identifier");

        await postJSON("/api/auth/login", { identifier: id, password });

        router.refresh();
        onSuccess?.();
        return;
      }

      // signup
      const u = normalizeUsername(username);
      if (u.length < 3) throw new Error(ui.badUsername);

      const eMail = email.trim();
      if (eMail && !isEmailLike(eMail)) throw new Error("Invalid email");

      await postJSON("/api/auth/signup", {
        username: u,
        email: eMail || null,
        password,
      });

      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message ?? "Error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {mode === "signin" ? (
        <>
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder={ui.identifier}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </>
      ) : (
        <>
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder={ui.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
            placeholder={ui.emailOpt}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </>
      )}

      <input
        className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 outline-none focus:border-[color:var(--ring)]"
        placeholder={ui.password}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />

      {msg && (
        <div className={`text-sm p-3 rounded-lg border ${msg.type === "error" ? "border-red-500/20 text-red-400" : "border-green-500/20 text-green-400"}`}>
          {msg.text}
        </div>
      )}

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? ui.processing : mode === "signup" ? ui.createAccount : ui.submit}
      </Button>

      <button
        type="button"
        className="w-full text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
        onClick={() => {
          setMsg(null);
          setMode(mode === "signup" ? "signin" : "signup");
        }}
      >
        {mode === "signup" ? ui.haveAccount : ui.noAccount}
      </button>
    </form>
  );
}
