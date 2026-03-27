// src/components/reports/ReportSectionRenderer.tsx
import type { ReactNode } from "react";
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

function seriesAxisLabels(
  section: ResolvedReportSeriesSection,
  locale: Locale,
): { x: string; y: string } {
  const yLower = section.y_key.toLowerCase();
  const isFocos =
    yLower.includes("foco") || yLower.includes("hotspot") || yLower.includes("count");

  const yLabel =
    isFocos || section.y_key === "value"
      ? locale === "en"
        ? "Hotspot count"
        : "Número de focos"
      : section.y_key;

  if (section.kind === "timeseries") {
    return {
      x: locale === "en" ? "Time (month)" : "Tempo (mês)",
      y: yLabel,
    };
  }

  return {
    x: locale === "en" ? "Year" : "Ano",
    y: yLabel,
  };
}

export default function ReportSectionRenderer({
  locale,
  section,
  variant = "default",
  filterSlot,
}: {
  locale: Locale;
  section: ResolvedReportSection;
  variant?: "default" | "news";
  /** Controles de filtro posicionados no canto superior direito da figura. */
  filterSlot?: ReactNode;
}) {
  const titleClass =
    variant === "news"
      ? "text-xl font-bold text-[color:var(--foreground)] md:text-2xl"
      : "text-xl font-black tracking-tight text-[color:var(--foreground)] md:text-2xl";

  const chartVariant = variant === "news" ? "news" : "default";
  const figureChrome = filterSlot ? "relative pt-[3.25rem] sm:pt-12" : "relative";

  return (
    <section className="space-y-3">
      <h2 className={titleClass}>{section.title}</h2>

      {isSeriesSection(section) && section.kind === "timeseries" ? (
        <div className={figureChrome}>
          {filterSlot ? (
            <div className="absolute right-1 top-0 z-10 max-w-[calc(100%-0.5rem)] sm:right-2 sm:top-1">
              {filterSlot}
            </div>
          ) : null}
          <SimpleLineChart
            locale={locale}
            variant={chartVariant}
            xAxisLabel={seriesAxisLabels(section, locale).x}
            yAxisLabel={seriesAxisLabels(section, locale).y}
            data={section.data.map((item) => ({
              x: String(item[section.x_key]),
              y: Number(item[section.y_key] ?? 0),
            }))}
          />
        </div>
      ) : null}

      {isSeriesSection(section) && section.kind === "bar" ? (
        <div className={figureChrome}>
          {filterSlot ? (
            <div className="absolute right-1 top-0 z-10 max-w-[calc(100%-0.5rem)] sm:right-2 sm:top-1">
              {filterSlot}
            </div>
          ) : null}
          <SimpleBarChart
            locale={locale}
            variant={chartVariant}
            xAxisLabel={seriesAxisLabels(section, locale).x}
            yAxisLabel={seriesAxisLabels(section, locale).y}
            data={section.data.map((item) => ({
              x: String(item[section.x_key]),
              y: Number(item[section.y_key] ?? 0),
            }))}
          />
        </div>
      ) : null}

      {isTableSection(section) ? (
        <div className={figureChrome}>
          {filterSlot ? (
            <div className="absolute right-1 top-0 z-10 max-w-[calc(100%-0.5rem)] sm:right-2 sm:top-1">
              {filterSlot}
            </div>
          ) : null}
          <ReportTable locale={locale} section={section} variant={variant} />
        </div>
      ) : null}
    </section>
  );
}