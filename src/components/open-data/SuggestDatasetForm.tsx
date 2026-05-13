"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type Status = "idle" | "sending" | "success" | "error";

export default function SuggestDatasetForm({
  query,
  variant = "default",
}: {
  query?: string;
  variant?: "default" | "empty";
}) {
  const { dict, locale } = useI18n();
  const sg = dict.openData.suggest;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (message.trim().length < 3) {
      setStatus("error");
      setErrorMsg(sg.errorDescribeDataset);
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/suggest-dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          query,
          hp,
          locale,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (data.error === "rate_limited") {
          setErrorMsg(sg.errorRateLimited);
        } else {
          setErrorMsg(sg.errorGeneric);
        }
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg(sg.errorNetwork);
    }
  }

  const isEmpty = variant === "empty";

  return (
    <section
      className={`rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)] ${
        isEmpty ? "" : "mt-8"
      }`}
    >
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-[color:var(--text)]">
          {isEmpty ? sg.titleEmpty : sg.titleDefault}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          {sg.body}
          {query ? (
            <>
              {" "}
              {sg.currentQuery}{" "}
              <strong className="text-[color:var(--text)]">&ldquo;{query}&rdquo;</strong>.
            </>
          ) : null}
        </p>
      </header>

      {status === "success" ? (
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--text)]">
          {sg.thanks}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-[color:var(--muted)]">
              {sg.nameOptional}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
                className="rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-[color:var(--muted)]">
              {sg.emailOptional}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                className="rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs text-[color:var(--muted)]">
            {sg.descriptionLabel}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={3}
              maxLength={4000}
              rows={5}
              placeholder={sg.descriptionPlaceholder}
              className="rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </label>

          {status === "error" && errorMsg ? (
            <p className="text-xs text-red-500">{errorMsg}</p>
          ) : null}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? sg.submitting : sg.submit}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
