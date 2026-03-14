// src/components/reports/ReportTable.tsx

import type { ReportTableSection } from "@/lib/reports/types";

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return value.toLocaleString("pt-BR");
  return String(value);
}

export default function ReportTable({ section }: { section: ReportTableSection }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-float)] overflow-hidden">
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
              <tr key={idx} className="hover:bg-[color:var(--surface-2)]/40 transition-colors">
                {section.columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[color:var(--foreground)]">
                    {formatCell(row[col.key])}
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
