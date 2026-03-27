// src/components/reports/ReportMethodology.tsx
import Link from "next/link";
import type { Locale, ResolvedReportMethodology } from "@/lib/reports/types";

export default function ReportMethodology({
  locale,
  methodology,
  sourcePortalHref,
}: {
  locale: Locale;
  methodology?: ResolvedReportMethodology;
  sourcePortalHref?: string;
}) {
  if (!methodology) return null;

  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)]">
      <h2 className="text-xl font-black tracking-tight text-[color:var(--foreground)]">
        {locale === "en" ? "Methodology and notes" : "Metodologia e notas"}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-[color:var(--foreground)]">
        {methodology.source ? (
          <p className="text-justify">
            <span className="font-semibold text-[color:var(--primary)]">
              {locale === "en" ? "Source:" : "Fonte:"}
            </span>{" "}
            {methodology.source}
          </p>
        ) : null}

        {methodology.note ? (
          <p className="text-justify">
            <span className="font-semibold text-[color:var(--primary)]">
              {locale === "en" ? "Note:" : "Nota:"}
            </span>{" "}
            {methodology.note}
          </p>
        ) : null}

        {methodology.limitations ? (
          <p className="text-justify">
            <span className="font-semibold text-[color:var(--primary)]">
              {locale === "en" ? "Limitations:" : "Limitações:"}
            </span>{" "}
            {methodology.limitations}
          </p>
        ) : null}

        {sourcePortalHref ? (
          <p className="text-justify">
            <Link
              href={sourcePortalHref}
              className="font-semibold text-[color:var(--primary)] transition-colors hover:opacity-80"
            >
              {locale === "en"
                ? "Open the source dataset page in Forest Portal"
                : "Abrir a página da base de origem no Forest Portal"}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}