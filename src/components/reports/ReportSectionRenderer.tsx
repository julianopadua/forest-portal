// src/components/reports/ReportSectionRenderer.tsx
import type { ReactNode } from "react";
import type {
  Locale,
  ResolvedReportFigureAttribution,
  ResolvedReportSection,
  ResolvedReportSeriesSection,
  ResolvedReportTableSection,
  ResolvedReportMonthlyYearComparisonSection,
} from "@/lib/reports/types";
import SimpleBarChart from "@/components/reports/charts/SimpleBarChart";
import SimpleLineChart from "@/components/reports/charts/SimpleLineChart";
import MonthlyComparisonChart from "@/components/reports/charts/MonthlyComparisonChart";
import ReportInlineBiomeStateSeries from "@/components/reports/charts/ReportInlineBiomeStateSeries";
import ReportFigureSource from "@/components/reports/ReportFigureSource";
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

function isMonthlyComparisonSection(
  section: ResolvedReportSection,
): section is ResolvedReportMonthlyYearComparisonSection {
  return section.kind === "monthly_year_comparison";
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
  attribution,
  periodRange,
  yearRange,
  inlineSeriesBiomes,
}: {
  locale: Locale;
  section: ResolvedReportSection;
  variant?: "default" | "news";
  /** Controles de filtro posicionados no canto superior direito da figura (apenas em seções dinâmicas). */
  filterSlot?: ReactNode;
  attribution?: ResolvedReportFigureAttribution | null;
  periodRange?: { start: string; end: string };
  yearRange?: { start: number; end: number };
  inlineSeriesBiomes?: Array<{ value: string; label: string }>;
}) {
  const titleClass =
    variant === "news"
      ? "text-xl font-bold text-[color:var(--foreground)] md:text-2xl"
      : "text-xl font-black tracking-tight text-[color:var(--foreground)] md:text-2xl";

  const chartVariant = variant === "news" ? "news" : "default";
  const figureChrome = filterSlot ? "relative pt-[3.25rem] sm:pt-12" : "relative";

  const canInlineSeries =
    isSeriesSection(section) &&
    section.inline_biome_state_filter &&
    inlineSeriesBiomes &&
    periodRange &&
    yearRange;

  const legendText = attribution
    ? isTableSection(section)
      ? attribution.tablesLegend
      : attribution.chartsLegend
    : "";

  return (
    <section className="space-y-3">
      <h2 className={titleClass}>{section.title}</h2>

      {isMonthlyComparisonSection(section) ? (
        <div className={figureChrome}>
          {filterSlot ? (
            <div className="absolute right-1 top-0 z-10 max-w-[calc(100%-0.5rem)] sm:right-2 sm:top-1">
              {filterSlot}
            </div>
          ) : null}
          <MonthlyComparisonChart
            locale={locale}
            variant={chartVariant}
            currentYear={section.current_year}
            previousYear={section.previous_year}
            avgWindowStart={section.avg_window_start}
            avgWindowEnd={section.avg_window_end}
            lastClosedMonth={section.last_closed_month}
            availableBiomes={section.available_biomes}
            availableStates={section.available_states}
            data={section.data}
          />
          {attribution ? (
            <p className="mt-2 text-left text-xs text-[color:var(--muted)]">
              {locale === "en" ? "Comparison: " : "Comparativo: "}
              {section.current_year}
              {" vs "}
              {section.previous_year ?? "-"}
              {locale === "en" ? " vs historical average" : " vs média histórica"}
            </p>
          ) : null}
        </div>
      ) : null}

      {isSeriesSection(section) && section.kind === "timeseries" && canInlineSeries ? (
        <ReportInlineBiomeStateSeries
          locale={locale}
          variant={chartVariant}
          kind="timeseries"
          xKey={section.x_key}
          yKey={section.y_key}
          biomeKey={section.biome_key ?? "biome"}
          stateKey={section.state_key ?? "state"}
          availableBiomes={inlineSeriesBiomes}
          availableStates={section.available_states ?? []}
          data={section.data}
          periodStart={periodRange.start}
          periodEnd={periodRange.end}
          startYear={yearRange.start}
          endYear={yearRange.end}
        />
      ) : null}

      {isSeriesSection(section) && section.kind === "timeseries" && !canInlineSeries ? (
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
            highlightYear={section.highlight_year}
            data={section.data.map((item) => ({
              x: String(item[section.x_key]),
              y: Number(item[section.y_key] ?? 0),
            }))}
          />
        </div>
      ) : null}

      {isSeriesSection(section) && section.kind === "bar" && canInlineSeries ? (
        <ReportInlineBiomeStateSeries
          locale={locale}
          variant={chartVariant}
          kind="bar"
          xKey={section.x_key}
          yKey={section.y_key}
          biomeKey={section.biome_key ?? "biome"}
          stateKey={section.state_key ?? "state"}
          availableBiomes={inlineSeriesBiomes}
          availableStates={section.available_states ?? []}
          data={section.data}
          periodStart={periodRange.start}
          periodEnd={periodRange.end}
          startYear={yearRange.start}
          endYear={yearRange.end}
        />
      ) : null}

      {isSeriesSection(section) && section.kind === "bar" && !canInlineSeries ? (
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

      {attribution ? (
        <ReportFigureSource
          locale={locale}
          legend={legendText}
          sourceUrl={attribution.sourceUrl}
          sourceLabel={attribution.sourceLabel}
          variant={variant}
        />
      ) : null}
    </section>
  );
}
