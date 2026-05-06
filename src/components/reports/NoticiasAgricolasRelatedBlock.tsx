// src/components/reports/NoticiasAgricolasRelatedBlock.tsx
"use client";

import type { NoticiasAgricolasSidebarItem } from "@/lib/news/noticiasAgricolasManifest";
import type { Locale } from "@/lib/reports/types";

export type NoticiasAgricolasLoadStatus = "ready" | "unavailable";

export type NoticiasAgricolasRelatedData = {
  status: NoticiasAgricolasLoadStatus;
  items: NoticiasAgricolasSidebarItem[];
};

export default function NoticiasAgricolasRelatedBlock({
  locale,
  data,
}: {
  locale: Locale;
  data: NoticiasAgricolasRelatedData;
}) {
  const title = locale === "en" ? "Related news" : "Notícias relacionadas";
  const sourceNote =
    locale === "en"
      ? "Headlines from Notícias Agrícolas (open data feed)."
      : "Manchetes do Notícias Agrícolas (feed de dados abertos).";

  return (
    <section className="border border-[color:var(--border)] bg-[color:var(--surface-2)]/50 p-4 text-xs leading-relaxed text-[color:var(--foreground)]">
      <h2 className="border-b border-[color:var(--border)] pb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
        {title}
      </h2>

      {data.status === "unavailable" ? (
        <p className="mt-3 text-[11px] text-[color:var(--muted)]">
          {locale === "en"
            ? "News feed is currently unavailable."
            : "Feed de notícias indisponível no momento."}
        </p>
      ) : data.items.length === 0 ? (
        <p className="mt-3 text-[11px] text-[color:var(--muted)]">
          {locale === "en"
            ? "No headlines available at the moment."
            : "Nenhuma manchete disponível no momento."}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-[color:var(--border)]">
          {data.items.map((item) => (
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
      )}

      <p className="mt-3 border-t border-[color:var(--border)] pt-3 text-[10px] text-[color:var(--muted)]">
        {sourceNote}
      </p>
    </section>
  );
}
