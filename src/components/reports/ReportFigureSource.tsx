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
      ? "mt-3 space-y-1 text-right text-xs text-[color:var(--muted)]"
      : "mt-3 space-y-1 text-right text-xs text-[color:var(--muted)]";

  return (
    <div className={textClass}>
      {legend.trim() ? (
        <span className="block text-left leading-relaxed text-[color:var(--muted)]">{legend}</span>
      ) : null}
      <span className="block">
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
