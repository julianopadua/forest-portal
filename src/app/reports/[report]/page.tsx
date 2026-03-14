// src/app/reports/[report]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import ReportAnalysis from "@/components/reports/ReportAnalysis";
import ReportHero from "@/components/reports/ReportHero";
import ReportHighlights from "@/components/reports/ReportHighlights";
import ReportMethodology from "@/components/reports/ReportMethodology";
import ReportSectionRenderer from "@/components/reports/ReportSectionRenderer";
import { getReportBySlug } from "@/lib/reports/catalog";
import { fetchStableReport } from "@/lib/reports/fetch";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ report: string }>;
}) {
  const { report } = await params;
  const catalogItem = getReportBySlug(report);

  if (!catalogItem) notFound();

  const document = await fetchStableReport(catalogItem.stableReportPath);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Voltar para relatórios
        </Link>
      </div>

      <div className="space-y-8">
        <ReportHero catalogItem={catalogItem} report={document} />
        <ReportHighlights highlights={document.highlights} />
        <ReportAnalysis analysis={document.analysis} />

        <div className="space-y-8">
          {document.sections.map((section) => (
            <ReportSectionRenderer key={section.id} section={section} />
          ))}
        </div>

        <ReportMethodology methodology={document.methodology} />
      </div>
    </main>
  );
}
