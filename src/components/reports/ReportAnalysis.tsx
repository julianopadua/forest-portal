// src/components/reports/ReportAnalysis.tsx
import type {
  Locale,
  ResolvedReportAnalysisDetails,
  ResolvedReportAnalysisIntro,
} from "@/lib/reports/types";

export default function ReportAnalysis({
  locale,
  mode,
  analysis,
}: {
  locale: Locale;
  mode: "intro" | "details";
  analysis: ResolvedReportAnalysisIntro | ResolvedReportAnalysisDetails;
}) {
  if (mode === "intro") {
    const intro = analysis as ResolvedReportAnalysisIntro;

    return (
      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)]">
        <div className="space-y-2">

          <h2 className="text-2xl font-black leading-tight tracking-tight text-[color:var(--foreground)] md:text-3xl">
            {intro.headline}
          </h2>
        </div>

        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--muted)]">
            {locale === "en" ? "Overview" : "Visão geral"}
          </h3>

          <p className="whitespace-pre-line text-justify text-sm leading-7 text-[color:var(--foreground)] md:text-base">
            {intro.overview}
          </p>
        </div>

        <p className="mt-4 text-justify text-xs leading-relaxed text-[color:var(--muted)]">
          {locale === "en"
            ? "This textual reading is automatically generated with support from LLM/AI models. It should be checked against the data, charts and original source before analytical or decision-making use."
            : "Esta leitura textual é gerada automaticamente com apoio de modelos de LLMs/IAs. Ela deve ser conferida com os dados, gráficos e fonte original antes de qualquer uso analítico ou decisório."}
        </p>
      </section>
    );
  }

  const details = analysis as ResolvedReportAnalysisDetails;

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)]">
        <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--muted)]">
          {locale === "en" ? "Comparison" : "Comparação"}
        </h3>
        <p className="mt-3 whitespace-pre-line text-justify text-sm leading-7 text-[color:var(--foreground)] md:text-base">
          {details.comparison}
        </p>
      </div>

      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)]">
        <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--muted)]">
          {locale === "en" ? "Limitations" : "Limitações"}
        </h3>
        <p className="mt-3 whitespace-pre-line text-justify text-sm leading-7 text-[color:var(--foreground)] md:text-base">
          {details.limitations}
        </p>
      </div>
    </section>
  );
}