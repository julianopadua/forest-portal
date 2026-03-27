// src/components/reports/ReportHighlights.tsx
import type { Locale, ResolvedReportHighlight } from "@/lib/reports/types";

function formatValue(
  value: string | number | null | undefined,
  locale: Locale,
) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    return value.toLocaleString(locale === "en" ? "en-US" : "pt-BR");
  }
  return value;
}

function formatPct(value: number | null | undefined, locale: Locale) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return `${value.toLocaleString(locale === "en" ? "en-US" : "pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export default function ReportHighlights({
  locale,
  highlights,
}: {
  locale: Locale;
  highlights: ResolvedReportHighlight[];
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {highlights.map((item) => {
        const pct = formatPct(item.pct_change, locale);
        const pctTone =
          item.pct_change === null || item.pct_change === undefined
            ? "text-[color:var(--muted)]"
            : item.pct_change >= 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-emerald-600 dark:text-emerald-400";

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-float)]"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
              {item.label}
            </div>

            <div className="mt-3 text-3xl font-black tracking-tight text-[color:var(--foreground)]">
              {formatValue(item.value, locale)}
            </div>

            {(item.comparison_label || item.comparison_value !== null) && (
              <div className="mt-3 text-sm text-[color:var(--muted)]">
                {item.comparison_label ? `${item.comparison_label}: ` : ""}
                <span className="font-medium text-[color:var(--foreground)]">
                  {formatValue(item.comparison_value, locale)}
                </span>
              </div>
            )}

            {pct ? (
              <div className={`mt-2 text-sm font-semibold ${pctTone}`}>{pct}</div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}