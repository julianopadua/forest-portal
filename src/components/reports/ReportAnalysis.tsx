// src/components/reports/ReportHero.tsx
import Link from "next/link";
import type { Locale } from "@/lib/reports/types";

function formatDateTime(iso: string, locale: Locale) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(locale === "en" ? "en-US" : "pt-BR");
}

export default function ReportHero({
  locale,
  catalogItem,
  title,
  summary,
  generatedAt,
  yearRange,
  latestPeriod,
  sourcePortalHref,
}: {
  locale: Locale;
  catalogItem: {
    categoryTitle: string;
    sourceTitle: string;
  };
  title: string;
  summary?: string | null;
  generatedAt: string;
  yearRange?: string | null;
  latestPeriod?: string | null;
  sourcePortalHref?: string;
}) {
  return (
    <section className="space-y-4">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
        {catalogItem.categoryTitle} / {catalogItem.sourceTitle}
      </div>

      <h1 className="max-w-5xl text-3xl font-black tracking-tight text-[color:var(--foreground)] md:text-5xl">
        {title}
      </h1>

      {summary ? (
        <p className="max-w-4xl text-base leading-relaxed text-[color:var(--muted)]">
          {summary}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[color:var(--muted)]">
        <div>
          <span className="font-semibold">
            {locale === "en" ? "Updated" : "Atualizado"}:
          </span>{" "}
          {formatDateTime(generatedAt, locale)}
        </div>

        {yearRange ? (
          <div>
            <span className="font-semibold">
              {locale === "en" ? "Coverage" : "Cobertura"}:
            </span>{" "}
            {yearRange}
          </div>
        ) : null}

        {latestPeriod ? (
          <div>
            <span className="font-semibold">
              {locale === "en" ? "Latest period" : "Último período"}:
            </span>{" "}
            {latestPeriod}
          </div>
        ) : null}

        {sourcePortalHref ? (
          <div>
            <Link
              href={sourcePortalHref}
              className="font-semibold text-[color:var(--primary)] transition-colors hover:opacity-80"
            >
              {locale === "en" ? "View source dataset" : "Ver base de origem"}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}