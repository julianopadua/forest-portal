// src/components/reports/ReportTable.tsx
import type { Locale, ResolvedReportTableSection } from "@/lib/reports/types";

function formatCell(value: unknown, key: string, locale: Locale) {
  if (value === null || value === undefined) return "-";

  if (typeof value === "number") {
    if (key === "pct_change") {
      return `${value.toLocaleString(locale === "en" ? "en-US" : "pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;
    }

    return value.toLocaleString(locale === "en" ? "en-US" : "pt-BR");
  }

  return String(value);
}

export default function ReportTable({
  locale,
  section,
  variant = "default",
}: {
  locale: Locale;
  section: ResolvedReportTableSection;
  variant?: "default" | "news";
}) {
  if (!section.rows.length) {
    return (
      <div
        className={`border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)] ${
          variant === "news" ? "rounded-lg" : "rounded-2xl shadow-[var(--shadow-float)]"
        }`}
      >
        {locale === "en"
          ? "No rows available for the selected filters."
          : "Sem linhas disponíveis para os filtros selecionados."}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface)] ${
        variant === "news" ? "rounded-lg" : "rounded-2xl shadow-[var(--shadow-float)]"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[color:var(--surface-2)]">
            <tr>
              {section.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-[color:var(--muted)]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {section.rows.map((row, idx) => (
              <tr
                key={idx}
                className="transition-colors hover:bg-[color:var(--surface-2)]/40"
              >
                {section.columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[color:var(--foreground)]">
                    {formatCell(row[col.key], col.key, locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}