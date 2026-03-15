// src/components/reports/ReportPageClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ReportAnalysis from "@/components/reports/ReportAnalysis";
import ReportHero from "@/components/reports/ReportHero";
import ReportHighlights from "@/components/reports/ReportHighlights";
import ReportMethodology from "@/components/reports/ReportMethodology";
import ReportSectionRenderer from "@/components/reports/ReportSectionRenderer";
import type { ReportCatalogItem } from "@/lib/reports/catalog";
import { getLocaleTag, resolveLocalizedText, resolveNullableLocalizedText } from "@/lib/reports/localize";
import type {
  Locale,
  ReportDocument,
  ReportSeriesPoint,
  ReportTableRow,
  ReportTableSection,
  ResolvedReportAnalysisDetails,
  ResolvedReportAnalysisIntro,
  ResolvedReportHighlight,
  ResolvedReportMethodology,
  ResolvedReportSection,
  ResolvedReportTableColumn,
} from "@/lib/reports/types";

const ALL_BIOMES_VALUE = "__all__";

function useDocumentLocale(defaultLocale: Locale = "pt"): Locale {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const readLocale = () => {
      const lang = document.documentElement.lang.toLowerCase();
      setLocale(lang.startsWith("en") ? "en" : "pt");
    };

    readLocale();

    const observer = new MutationObserver(() => {
      readLocale();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return locale;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizePeriodRange(start: string, end: string) {
  return start <= end ? { start, end } : { start: end, end: start };
}

function periodToYear(period: string): number {
  return Number(period.slice(0, 4));
}

function matchesBiome(rawBiome: unknown, selectedBiome: string) {
  const biome = typeof rawBiome === "string" && rawBiome.trim() ? rawBiome : ALL_BIOMES_VALUE;
  if (selectedBiome === ALL_BIOMES_VALUE) return biome === ALL_BIOMES_VALUE;
  return biome === selectedBiome;
}

function localizeHighlights(
  highlights: ReportDocument["highlights"],
  locale: Locale,
): ResolvedReportHighlight[] {
  return highlights.map((item) => ({
    id: item.id,
    label: resolveLocalizedText(item.label, locale),
    value: item.value,
    comparison_label: resolveNullableLocalizedText(item.comparison_label, locale),
    comparison_value: item.comparison_value,
    pct_change: item.pct_change,
  }));
}

function localizeMethodology(
  methodology: ReportDocument["methodology"] | undefined,
  locale: Locale,
): ResolvedReportMethodology | undefined {
  if (!methodology) return undefined;

  return {
    source: resolveNullableLocalizedText(methodology.source, locale),
    note: resolveNullableLocalizedText(methodology.note, locale),
    limitations: resolveNullableLocalizedText(methodology.limitations, locale),
  };
}

function buildIntroAnalysis(
  analysis: ReportDocument["analysis"],
  locale: Locale,
): ResolvedReportAnalysisIntro {
  return {
    headline: resolveLocalizedText(analysis.headline, locale),
    overview: resolveLocalizedText(analysis.overview, locale),
  };
}

function buildDetailsAnalysis(
  analysis: ReportDocument["analysis"],
  locale: Locale,
): ResolvedReportAnalysisDetails {
  return {
    comparison: resolveLocalizedText(analysis.comparison, locale),
    limitations: resolveLocalizedText(analysis.limitations, locale),
  };
}

function filterMonthlySeries(
  data: ReportSeriesPoint[],
  selectedBiome: string,
  startPeriod: string,
  endPeriod: string,
): ReportSeriesPoint[] {
  return data.filter((item) => {
    const period = String(item.period ?? "");
    if (!period) return false;
    return (
      period >= startPeriod &&
      period <= endPeriod &&
      matchesBiome(item.biome, selectedBiome)
    );
  });
}

function filterAnnualSeries(
  data: ReportSeriesPoint[],
  selectedBiome: string,
  startYear: number,
  endYear: number,
): ReportSeriesPoint[] {
  return data.filter((item) => {
    const year = toNumber(item.year);
    if (!year) return false;
    return (
      year >= startYear &&
      year <= endYear &&
      matchesBiome(item.biome, selectedBiome)
    );
  });
}

function buildComparisonRows(
  section: ReportTableSection,
  selectedBiome: string,
  startYear: number,
  endYear: number,
  locale: Locale,
): {
  columns: ResolvedReportTableColumn[];
  rows: ReportTableRow[];
} {
  const filtered = section.data
    .map((item) => ({
      state: String(item.state ?? ""),
      year: toNumber(item.year),
      value: toNumber(item.value),
      biome: typeof item.biome === "string" ? item.biome : ALL_BIOMES_VALUE,
    }))
    .filter((item) => {
      if (!item.state || !item.year) return false;
      if (item.year < startYear || item.year > endYear) return false;
      return matchesBiome(item.biome, selectedBiome);
    });

  const years = Array.from(new Set(filtered.map((item) => item.year))).sort((a, b) => a - b);
  const currentYear = years.length ? years[years.length - 1] : null;
  const previousYear = currentYear === null
    ? null
    : years.filter((year) => year < currentYear).at(-1) ?? null;

  const grouped = new Map<
    string,
    { current_year_total: number; previous_year_total: number }
  >();

  for (const item of filtered) {
    if (!grouped.has(item.state)) {
      grouped.set(item.state, {
        current_year_total: 0,
        previous_year_total: 0,
      });
    }

    const target = grouped.get(item.state)!;

    if (currentYear !== null && item.year === currentYear) {
      target.current_year_total += item.value;
    }
    if (previousYear !== null && item.year === previousYear) {
      target.previous_year_total += item.value;
    }
  }

  const rows = Array.from(grouped.entries())
    .map(([state, totals]) => {
      const absoluteChange = totals.current_year_total - totals.previous_year_total;
      const pctChange =
        totals.previous_year_total === 0
          ? null
          : Number(
              (
                ((totals.current_year_total - totals.previous_year_total) /
                  totals.previous_year_total) *
                100
              ).toFixed(2),
            );

      return {
        state,
        current_year_total: totals.current_year_total,
        previous_year_total: totals.previous_year_total,
        absolute_change: absoluteChange,
        pct_change: pctChange,
      };
    })
    .sort((a, b) => {
      if (b.current_year_total !== a.current_year_total) {
        return b.current_year_total - a.current_year_total;
      }
      if (b.previous_year_total !== a.previous_year_total) {
        return b.previous_year_total - a.previous_year_total;
      }
      return a.state.localeCompare(b.state, locale === "en" ? "en-US" : "pt-BR");
    })
    .slice(0, 10);

  const columns: ResolvedReportTableColumn[] = [
    {
      key: "state",
      label: locale === "en" ? "State" : "UF",
    },
    {
      key: "current_year_total",
      label:
        currentYear !== null
          ? locale === "en"
            ? `Hotspots in ${currentYear}`
            : `Focos em ${currentYear}`
          : locale === "en"
            ? "Selected year"
            : "Ano selecionado",
    },
    {
      key: "previous_year_total",
      label:
        previousYear !== null
          ? locale === "en"
            ? `Hotspots in ${previousYear}`
            : `Focos em ${previousYear}`
          : locale === "en"
            ? "Previous year"
            : "Ano anterior",
    },
    {
      key: "absolute_change",
      label: locale === "en" ? "Absolute change" : "Variação absoluta",
    },
    {
      key: "pct_change",
      label: locale === "en" ? "% change" : "Variação %",
    },
  ];

  return { columns, rows };
}

function buildRenderableSections(
  report: ReportDocument,
  locale: Locale,
  selectedBiome: string,
  selectedStartPeriod: string,
  selectedEndPeriod: string,
): ResolvedReportSection[] {
  const { start, end } = normalizePeriodRange(selectedStartPeriod, selectedEndPeriod);
  const startYear = periodToYear(start);
  const endYear = periodToYear(end);

  return report.sections.map((section) => {
    const title = resolveLocalizedText(section.title, locale);

    if (section.kind === "timeseries") {
      return {
        id: section.id,
        kind: "timeseries" as const,
        title,
        x_key: section.x_key,
        y_key: section.y_key,
        data: filterMonthlySeries(section.data, selectedBiome, start, end),
      };
    }

    if (section.kind === "bar") {
      return {
        id: section.id,
        kind: "bar" as const,
        title,
        x_key: section.x_key,
        y_key: section.y_key,
        data: filterAnnualSeries(section.data, selectedBiome, startYear, endYear),
      };
    }

    const tableSection = section as ReportTableSection;
    const comparison = buildComparisonRows(
      tableSection,
      selectedBiome,
      startYear,
      endYear,
      locale,
    );

    return {
      id: tableSection.id,
      kind: "table" as const,
      title,
      columns: comparison.columns,
      rows: comparison.rows,
    };
  });
}

function periodLabel(period: string, locale: Locale) {
  const date = new Date(`${period}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return period;

  return date.toLocaleDateString(getLocaleTag(locale), {
    year: "numeric",
    month: "short",
  });
}

export default function ReportPageClient({
  catalogItem,
  report,
}: {
  catalogItem: ReportCatalogItem;
  report: ReportDocument;
}) {
  const locale = useDocumentLocale(report.default_locale ?? "pt");

  const periodBounds = report.filters?.period.bounds;
  const biomeFilter = report.filters?.biome;

  const [selectedBiome, setSelectedBiome] = useState<string>(
    biomeFilter?.default_value ?? ALL_BIOMES_VALUE,
  );
  const [selectedStartPeriod, setSelectedStartPeriod] = useState<string>(
    periodBounds?.period_start ?? report.coverage.first_period ?? "",
  );
  const [selectedEndPeriod, setSelectedEndPeriod] = useState<string>(
    periodBounds?.period_end ?? report.coverage.latest_period ?? "",
  );

  useEffect(() => {
    if (!periodBounds) return;
    setSelectedStartPeriod(periodBounds.period_start);
    setSelectedEndPeriod(periodBounds.period_end);
  }, [periodBounds?.period_end, periodBounds?.period_start]);

  const introAnalysis = useMemo(
    () => buildIntroAnalysis(report.analysis, locale),
    [report.analysis, locale],
  );

  const detailsAnalysis = useMemo(
    () => buildDetailsAnalysis(report.analysis, locale),
    [report.analysis, locale],
  );

  const highlights = useMemo(
    () => localizeHighlights(report.highlights, locale),
    [report.highlights, locale],
  );

  const methodology = useMemo(
    () => localizeMethodology(report.methodology, locale),
    [report.methodology, locale],
  );

  const renderableSections = useMemo(
    () =>
      buildRenderableSections(
        report,
        locale,
        selectedBiome,
        selectedStartPeriod,
        selectedEndPeriod,
      ),
    [report, locale, selectedBiome, selectedStartPeriod, selectedEndPeriod],
  );

  const normalizedRange = normalizePeriodRange(selectedStartPeriod, selectedEndPeriod);

  return (
    <div className="space-y-10">
      <ReportHero
        locale={locale}
        catalogItem={catalogItem}
        title={resolveLocalizedText(report.title, locale)}
        summary={resolveNullableLocalizedText(report.summary, locale)}
        generatedAt={report.generated_at}
        yearRange={report.coverage.year_range}
        latestPeriod={report.coverage.latest_period}
        sourcePortalHref={catalogItem.sourcePortalHref}
      />

      <ReportAnalysis
        locale={locale}
        mode="intro"
        analysis={introAnalysis}
      />

      <ReportHighlights locale={locale} highlights={highlights} />

      <ReportAnalysis
        locale={locale}
        mode="details"
        analysis={detailsAnalysis}
      />

      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-float)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[color:var(--foreground)]">
              {locale === "en" ? "Explore the visualizations" : "Explore as visualizações"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--muted)]">
              {locale === "en"
                ? "Apply biome and period filters to inspect the published historical aggregates. The text analysis above remains editorially focused on the recent window."
                : "Aplique filtros de bioma e período para inspecionar os agregados históricos publicados. A análise textual acima permanece editorialmente focada na janela recente."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBiome(biomeFilter?.default_value ?? ALL_BIOMES_VALUE);
              setSelectedStartPeriod(periodBounds?.period_start ?? report.coverage.first_period ?? "");
              setSelectedEndPeriod(periodBounds?.period_end ?? report.coverage.latest_period ?? "");
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--border)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-2)]"
          >
            {locale === "en" ? "Reset filters" : "Limpar filtros"}
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[color:var(--muted)]">
              {locale === "en" ? "Biome" : "Bioma"}
            </span>
            <select
              value={selectedBiome}
              onChange={(e) => setSelectedBiome(e.target.value)}
              className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 text-sm text-[color:var(--foreground)] outline-none"
            >
              {(biomeFilter?.options ?? []).map((option) => (
                <option key={option.value} value={option.value}>
                  {resolveLocalizedText(option.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[color:var(--muted)]">
              {locale === "en" ? "Start period" : "Período inicial"}
            </span>
            <select
              value={selectedStartPeriod}
              onChange={(e) => setSelectedStartPeriod(e.target.value)}
              className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 text-sm text-[color:var(--foreground)] outline-none"
            >
              {(report.filters?.period.available_periods ?? []).map((period) => (
                <option key={period} value={period}>
                  {periodLabel(period, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[color:var(--muted)]">
              {locale === "en" ? "End period" : "Período final"}
            </span>
            <select
              value={selectedEndPeriod}
              onChange={(e) => setSelectedEndPeriod(e.target.value)}
              className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 text-sm text-[color:var(--foreground)] outline-none"
            >
              {(report.filters?.period.available_periods ?? []).map((period) => (
                <option key={period} value={period}>
                  {periodLabel(period, locale)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 text-xs leading-relaxed text-[color:var(--muted)]">
          {locale === "en" ? "Active range:" : "Faixa ativa:"}{" "}
          <span className="font-semibold text-[color:var(--foreground)]">
            {periodLabel(normalizedRange.start, locale)} — {periodLabel(normalizedRange.end, locale)}
          </span>
        </div>
      </section>

      <div className="space-y-8">
        {renderableSections.map((section) => (
          <ReportSectionRenderer key={section.id} locale={locale} section={section} />
        ))}
      </div>

      <ReportMethodology
        locale={locale}
        methodology={methodology}
        sourcePortalHref={catalogItem.sourcePortalHref}
      />
    </div>
  );
}