// src/components/reports/ReportMethodology.tsx

import type { ReportMethodology as ReportMethodologyType } from "@/lib/reports/types";

export default function ReportMethodology({
  methodology,
}: {
  methodology?: ReportMethodologyType;
}) {
  if (!methodology) return null;

  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)]">
      <h2 className="text-xl font-black tracking-tight text-[color:var(--foreground)]">
        Metodologia e notas
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-[color:var(--foreground)]">
        {methodology.source ? (
          <p>
            <span className="font-semibold text-[color:var(--primary)]">Fonte:</span> {methodology.source}
          </p>
        ) : null}

        {methodology.note ? (
          <p>
            <span className="font-semibold text-[color:var(--primary)]">Nota:</span> {methodology.note}
          </p>
        ) : null}

        {methodology.limitations ? (
          <p>
            <span className="font-semibold text-[color:var(--primary)]">Limitações:</span> {methodology.limitations}
          </p>
        ) : null}
      </div>
    </section>
  );
}
