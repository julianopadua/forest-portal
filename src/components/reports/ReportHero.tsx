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
  categoryTitle,
  sourceTitle,
  title,
  generatedAt,
  yearRange,
  latestPeriod,
  sourcePortalHref,
}: {
  locale: Locale;
  categoryTitle: string;
  sourceTitle: string;
  title: string;
  generatedAt: string;
  yearRange?: string | null;
  latestPeriod?: string | null;
  sourcePortalHref?: string;
}) {
  return (
    <section className="space-y-3 border-b border-[color:var(--border)] pb-5">
      <h1 className="text-lg font-semibold tracking-tight text-[color:var(--foreground)] md:text-xl">
        <span>{title}</span>
        <span className="text-[color:var(--muted)]"> {" - "}{categoryTitle} / {sourceTitle}</span>
      </h1>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[color:var(--muted)]">
        <span>
          <span className="font-semibold">
            {locale === "en" ? "Updated" : "Atualizado"}:
          </span>{" "}
          {formatDateTime(generatedAt, locale)}
        </span>

        {yearRange ? (
          <span>
            <span className="font-semibold">
              {locale === "en" ? "Coverage" : "Cobertura"}:
            </span>{" "}
            {yearRange}
          </span>
        ) : null}

        {latestPeriod ? (
          <span>
            <span className="font-semibold">
              {locale === "en" ? "Latest period" : "Último período"}:
            </span>{" "}
            {latestPeriod}
          </span>
        ) : null}

        {sourcePortalHref ? (
          <Link
            href={sourcePortalHref}
            className="font-semibold text-[color:var(--primary)] transition-colors hover:opacity-80"
          >
            {locale === "en" ? "View source dataset" : "Ver base de origem"}
          </Link>
        ) : null}
      </div>
    </section>
  );
}