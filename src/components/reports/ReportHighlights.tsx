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
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-[var(--shadow-float)] md:p-8">
        <div className="text-[11px] font-black uppercase tracking-wider text-[color:var(--primary)]">
          {locale === "en" ? "Automated reading" : "Leitura automatizada"}
        </div>

        <h2 className="mt-3 max-w-5xl text-2xl font-black leading-tight tracking-tight text-[color:var(--foreground)] md:text-3xl">
          {intro.headline}
        </h2>

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--muted)]">
            {locale === "en" ? "Overview" : "Visão geral"}
          </h3>

          <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-[color:var(--foreground)] md:text-base">
            {intro.overview}
          </p>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-[color:var(--muted)]">
          {locale === "en"
            ? "This textual reading is automatically generated with support from LLM/AI models. It should be treated as interpretive assistance and checked against the underlying data, charts and original source before analytical or decision-making use."
            : "Esta leitura textual é gerada automaticamente com apoio de modelos de LLM/IA. Ela deve ser tratada como apoio interpretativo e conferida com os dados, gráficos e fonte original antes de qualquer uso analítico ou decisório."}
        </p>
      </section>
    );
  }

  const details = analysis as ResolvedReportAnalysisDetails;

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-[var(--shadow-float)] md:p-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--muted)]">
            {locale === "en" ? "Comparison" : "Comparação"}
          </h3>
          <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-[color:var(--foreground)] md:text-base">
            {details.comparison}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--muted)]">
            {locale === "en" ? "Limitations" : "Limitações"}
          </h3>
          <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-[color:var(--foreground)] md:text-base">
            {details.limitations}
          </p>
        </div>
      </div>
    </section>
  );
}