// src/components/reports/ReportAnalysis.tsx

import type { ReportAnalysis as ReportAnalysisType } from "@/lib/reports/types";

function AnalysisBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-float)]">
      <h3 className="text-sm font-black uppercase tracking-wider text-[color:var(--primary)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--foreground)] whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}

export default function ReportAnalysis({
  analysis,
}: {
  analysis: ReportAnalysisType;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <AnalysisBlock title="Headline" body={analysis.headline} />
      <AnalysisBlock title="Visão geral" body={analysis.overview} />
      <AnalysisBlock title="Comparação" body={analysis.comparison} />
      <AnalysisBlock title="Limitações" body={analysis.limitations} />
    </section>
  );
}
