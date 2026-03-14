// src/components/reports/ReportSectionRenderer.tsx

import type {
  ReportSection,
  ReportSeriesSection,
  ReportTableSection,
} from "@/lib/reports/types";
import SimpleBarChart from "@/components/reports/charts/SimpleBarChart";
import SimpleLineChart from "@/components/reports/charts/SimpleLineChart";
import ReportTable from "@/components/reports/ReportTable";

function isSeriesSection(section: ReportSection): section is ReportSeriesSection {
  return section.kind === "timeseries" || section.kind === "bar";
}

function isTableSection(section: ReportSection): section is ReportTableSection {
  return section.kind === "table";
}

export default function ReportSectionRenderer({ section }: { section: ReportSection }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-[color:var(--foreground)]">
          {section.title}
        </h2>
      </div>

      {isSeriesSection(section) && section.kind === "timeseries" ? (
        <SimpleLineChart
          data={section.data.map((item) => ({
            x: String(item[section.x_key]),
            y: Number(item[section.y_key] ?? 0),
          }))}
        />
      ) : null}

      {isSeriesSection(section) && section.kind === "bar" ? (
        <SimpleBarChart
          data={section.data.map((item) => ({
            x: String(item[section.x_key]),
            y: Number(item[section.y_key] ?? 0),
          }))}
        />
      ) : null}

      {isTableSection(section) ? <ReportTable section={section} /> : null}
    </section>
  );
}
