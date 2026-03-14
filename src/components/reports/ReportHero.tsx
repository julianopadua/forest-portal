// src/components/reports/ReportHero.tsx

import type { ReportCatalogItem } from "@/lib/reports/catalog";
import type { ReportDocument } from "@/lib/reports/types";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR");
}

export default function ReportHero({
  catalogItem,
  report,
}: {
  catalogItem: ReportCatalogItem;
  report: ReportDocument;
}) {
  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 md:p-10 shadow-[var(--shadow-float)]">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
        {catalogItem.categoryTitle} / {catalogItem.sourceTitle}
      </div>

      <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-[color:var(--foreground)]">
        {report.title}
      </h1>

      {report.summary ? (
        <p className="mt-4 max-w-4xl text-[color:var(--muted)] leading-relaxed">
          {report.summary}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
        <div>
          <span className="opacity-60">Publicação:</span>{" "}
          <span className="text-[color:var(--foreground)]">{report.publication_status}</span>
        </div>

        <div>
          <span className="opacity-60">Atualizado em:</span>{" "}
          <span className="text-[color:var(--foreground)]">{formatDateTime(report.generated_at)}</span>
        </div>

        {report.coverage.latest_period ? (
          <div>
            <span className="opacity-60">Último período:</span>{" "}
            <span className="text-[color:var(--foreground)]">{report.coverage.latest_period}</span>
          </div>
        ) : null}

        {report.coverage.latest_year ? (
          <div>
            <span className="opacity-60">Ano mais recente:</span>{" "}
            <span className="text-[color:var(--foreground)]">{report.coverage.latest_year}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
