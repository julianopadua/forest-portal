// src/components/reports/ReportFigureSource.tsx
import type { Locale } from "@/lib/reports/types";

export default function ReportFigureSource({
  locale,
  legend,
  sourceUrl,
  sourceLabel,
  variant = "default",
}: {
  locale: Locale;
  legend: string;
  sourceUrl: string;
  sourceLabel: string;
  variant?: "default" | "news";
}) {
  const textClass =
    variant === "news"
      ? "mt-3 flex flex-col gap-1 text-xs text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between"
      : "mt-3 flex flex-col gap-1 text-xs text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between";

  return (
    <div className={textClass}>
      {legend.trim() ? (
        <span className="leading-relaxed text-[color:var(--muted)]">{legend}</span>
      ) : null}
      <span className="shrink-0 sm:text-right">
        {locale === "en" ? "Source: " : "Fonte: "}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[color:var(--foreground)] underline-offset-2 hover:underline"
        >
          {sourceLabel}
        </a>
      </span>
    </div>
  );
}
