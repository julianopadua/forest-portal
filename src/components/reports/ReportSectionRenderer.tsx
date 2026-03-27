// src/components/reports/ReportSectionRenderer.tsx
import type {
  Locale,
  ResolvedReportSection,
  ResolvedReportSeriesSection,
  ResolvedReportTableSection,
} from "@/lib/reports/types";
import SimpleBarChart from "@/components/reports/charts/SimpleBarChart";
import SimpleLineChart from "@/components/reports/charts/SimpleLineChart";
import ReportTable from "@/components/reports/ReportTable";

function isSeriesSection(
  section: ResolvedReportSection,
): section is ResolvedReportSeriesSection {
  return section.kind === "timeseries" || section.kind === "bar";
}

function isTableSection(
  section: ResolvedReportSection,
): section is ResolvedReportTableSection {
  return section.kind === "table";
}

export default function ReportSectionRenderer({
  locale,
  section,
}: {
  locale: Locale;
  section: ResolvedReportSection;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black tracking-tight text-[color:var(--foreground)] md:text-2xl">
          {section.title}
        </h2>
      </div>

      {isSeriesSection(section) && section.kind === "timeseries" ? (
        <SimpleLineChart
          locale={locale}
          data={section.data.map((item) => ({
            x: String(item[section.x_key]),
            y: Number(item[section.y_key] ?? 0),
          }))}
        />
      ) : null}

      {isSeriesSection(section) && section.kind === "bar" ? (
        <SimpleBarChart
          locale={locale}
          data={section.data.map((item) => ({
            x: String(item[section.x_key]),
            y: Number(item[section.y_key] ?? 0),
          }))}
        />
      ) : null}

      {isTableSection(section) ? (
        <ReportTable locale={locale} section={section} />
      ) : null}
    </section>
  );
}