// src/components/reports/NoticiasAgricolasRelatedBlock.tsx
"use client";

import { useEffect, useState } from "react";
import { getPublicObjectUrl } from "@/lib/openData/publicUrls";
import {
  NOTICIAS_AGRICOLAS_MANIFEST_PATH,
  parseNoticiasAgricolasManifest,
  type NoticiasAgricolasSidebarItem,
} from "@/lib/news/noticiasAgricolasManifest";
import type { Locale } from "@/lib/reports/types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; items: NoticiasAgricolasSidebarItem[] }
  | { status: "error"; kind: "config" | "url" | "http" | "json" | "network"; httpStatus?: number; detail?: string };

function formatError(state: Extract<LoadState, { status: "error" }>, locale: Locale): string {
  const en = locale === "en";
  switch (state.kind) {
    case "config":
      return en ? "Public data URL is not configured." : "URL de dados públicos não configurada.";
    case "url":
      return en ? "Could not build the manifest URL." : "Não foi possível montar a URL do manifest.";
    case "http":
      return en
        ? `Could not load news (HTTP ${state.httpStatus ?? "?"}).`
        : `Não foi possível carregar as notícias (HTTP ${state.httpStatus ?? "?"}).`;
    case "json":
      return en ? "Invalid JSON in news manifest." : "JSON do manifest de notícias inválido.";
    case "network":
      return en
        ? `Failed to load news: ${state.detail ?? "Unknown error"}`
        : `Falha ao carregar notícias: ${state.detail ?? "erro desconhecido"}`;
    default:
      return en ? "Something went wrong." : "Algo deu errado.";
  }
}

export default function NoticiasAgricolasRelatedBlock({ locale }: { locale: Locale }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
      if (!base) {
        if (!cancelled) setState({ status: "error", kind: "config" });
        return;
      }

      let url: string;
      try {
        url = getPublicObjectUrl(NOTICIAS_AGRICOLAS_MANIFEST_PATH);
      } catch {
        if (!cancelled) setState({ status: "error", kind: "url" });
        return;
      }

      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setState({ status: "error", kind: "http", httpStatus: res.status });
          return;
        }

        let json: unknown;
        try {
          json = await res.json();
        } catch {
          if (!cancelled) setState({ status: "error", kind: "json" });
          return;
        }

        const items = parseNoticiasAgricolasManifest(json, 5);
        if (!cancelled) {
          setState({ status: "ready", items });
        }
      } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        if (!cancelled) setState({ status: "error", kind: "network", detail });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const title =
    locale === "en" ? "Related news" : "Notícias relacionadas";
  const sourceNote =
    locale === "en"
      ? "Headlines from Notícias Agrícolas (open data feed)."
      : "Manchetes do Notícias Agrícolas (feed de dados abertos).";

  return (
    <section className="border border-[color:var(--border)] bg-[color:var(--surface-2)]/50 p-4 text-xs leading-relaxed text-[color:var(--foreground)]">
      <h2 className="border-b border-[color:var(--border)] pb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
        {title}
      </h2>

      {state.status === "loading" ? (
        <div className="mt-3 space-y-3" aria-busy="true" aria-live="polite">
          <div className="h-3 w-2/3 animate-pulse rounded bg-[color:var(--border)]" />
          <div className="h-3 w-full animate-pulse rounded bg-[color:var(--border)]" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-[color:var(--border)]" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-[color:var(--border)]" />
        </div>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-3 text-[11px] text-[color:var(--muted)]">{formatError(state, locale)}</p>
      ) : null}

      {state.status === "ready" && state.items.length === 0 ? (
        <p className="mt-3 text-[11px] text-[color:var(--muted)]">
          {locale === "en"
            ? "No headlines available at the moment."
            : "Nenhuma manchete disponível no momento."}
        </p>
      ) : null}

      {state.status === "ready" && state.items.length > 0 ? (
        <ul className="mt-3 divide-y divide-[color:var(--border)]">
          {state.items.map((item) => (
            <li key={`${item.url}-${item.title}`} className="py-3 first:pt-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-[color:var(--foreground)] underline-offset-2 hover:text-[color:var(--primary)] hover:underline"
              >
                {item.title}
              </a>
              {item.subtitle ? (
                <p className="mt-1 text-[11px] leading-snug text-[color:var(--muted)] line-clamp-4">
                  {item.subtitle}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 border-t border-[color:var(--border)] pt-3 text-[10px] text-[color:var(--muted)]">
        {sourceNote}
      </p>
    </section>
  );
}
