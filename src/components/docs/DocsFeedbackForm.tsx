"use client";

import { useState } from "react";

import { useI18n } from "@/i18n/I18nProvider";

type Status = "idle" | "sending" | "success" | "error";

export default function DocsFeedbackForm({ context }: { context: string }) {
  const { dict, locale } = useI18n();
  const t = dict.docs.feedback;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (message.trim().length < 3) {
      setStatus("error");
      setErrorMsg(t.errorTooShort);
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/suggest-dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          message,
          query: `[Docs feedback] ${context}`,
          hp,
          locale,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (data.error === "rate_limited") setErrorMsg(t.errorRateLimited);
        else setErrorMsg(t.errorGeneric);
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg(t.errorNetwork);
    }
  }

  return (
    <aside
      aria-labelledby="docs-feedback-title"
      className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm shadow-[var(--shadow-float)]"
    >
      <h3 id="docs-feedback-title" className="text-sm font-semibold text-[color:var(--foreground)]">
        {t.title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">{t.subtitle}</p>

      {status === "success" ? (
        <div className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3 text-xs text-[color:var(--foreground)]">
          {t.thanks}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <label className="flex flex-col gap-1 text-xs text-[color:var(--muted)]">
            {t.emailLabel}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              placeholder={t.emailPlaceholder}
              className="rounded-lg border border-[color:var(--border)] bg-transparent px-2.5 py-1.5 text-sm text-[color:var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-[color:var(--muted)]">
            {t.messageLabel}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={3}
              maxLength={4000}
              rows={4}
              placeholder={t.messagePlaceholder}
              className="rounded-lg border border-[color:var(--border)] bg-transparent px-2.5 py-1.5 text-sm text-[color:var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </label>

          {status === "error" ? (
            <p className="text-xs text-red-600">{errorMsg}</p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="self-end rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-3)] disabled:opacity-60"
          >
            {status === "sending" ? t.sending : t.submit}
          </button>
        </form>
      )}
    </aside>
  );
}
