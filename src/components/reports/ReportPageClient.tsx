// src/components/reports/ReportPageClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReportAnalysis from "@/components/reports/ReportAnalysis";
import ReportHero from "@/components/reports/ReportHero";
import ReportHighlights from "@/components/reports/ReportHighlights";
import ReportMethodology from "@/components/reports/ReportMethodology";
import ReportMinimalFilters from "@/components/reports/ReportMinimalFilters";
import ReportNewsHeader from "@/components/reports/ReportNewsHeader";
import ReportNewsSidebar from "@/components/reports/ReportNewsSidebar";
import ReportSectionRenderer from "@/components/reports/ReportSectionRenderer";
import type { ReportCatalogItem } from "@/lib/reports/catalog";
import {
  getLocaleTag,
  resolveLocalizedText,
  resolveNullableLocalizedText,
} from "@/lib/reports/localize";
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
const FIXED_COMPARISON_CURRENT_YEAR = 2025;
const FIXED_COMPARISON_PREVIOUS_YEAR = 2024;

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

function getRowString(row: ReportSeriesPoint, key: string): string | null {
  const value = row[key];

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function getRowNumber(row: ReportSeriesPoint, key: string): number | null {
  const value = row[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const normalized = trimmed.replace(/\./g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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

    return period >= startPeriod && period <= endPeriod && matchesBiome(item.biome, selectedBiome);
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

    return year >= startYear && year <= endYear && matchesBiome(item.biome, selectedBiome);
  });
}

function resolveGroupKey(section: ReportTableSection) {
  if (section.group_key) return section.group_key;
  const sample = section.data[0];
  if (!sample) return "state";
  if ("state" in sample) return "state";
  if ("uf" in sample) return "uf";
  return "state";
}

function resolveYearKey(section: ReportTableSection) {
  if (section.year_key) return section.year_key;
  const sample = section.data[0];
  if (!sample) return "year";
  if ("year" in sample) return "year";
  return "year";
}

function resolveValueKey(section: ReportTableSection) {
  if (section.value_key) return section.value_key;
  const sample = section.data[0];
  if (!sample) return "value";
  if ("value" in sample) return "value";
  if ("total" in sample) return "total";
  return "value";
}

function resolveBiomeKey(section: ReportTableSection) {
  if (section.biome_key) return section.biome_key;
  const sample = section.data[0];
  if (!sample) return "biome";
  if ("biome" in sample) return "biome";
  return "biome";
}

function resolveMonthlyPeriod(row: ReportSeriesPoint, yearKey: string): string | null {
  const directPeriod = getRowString(row, "period");
  if (directPeriod && /^\d{4}-\d{2}$/.test(directPeriod)) {
    return directPeriod;
  }

  const year = getRowNumber(row, yearKey);
  const month = getRowNumber(row, "month") ?? getRowNumber(row, "mes");

  if (year === null || month === null) return null;
  if (month < 1 || month > 12) return null;

  return `${Math.trunc(year)}-${String(Math.trunc(month)).padStart(2, "0")}`;
}

function rowMatchesSelectedRange(
  row: ReportSeriesPoint,
  yearKey: string,
  startPeriod: string,
  endPeriod: string,
) {
  const monthlyPeriod = resolveMonthlyPeriod(row, yearKey);
  if (monthlyPeriod) {
    return monthlyPeriod >= startPeriod && monthlyPeriod <= endPeriod;
  }

  const year = getRowNumber(row, yearKey);
  if (year === null) return false;

  const startYear = periodToYear(startPeriod);
  const endYear = periodToYear(endPeriod);
  const normalizedYear = Math.trunc(year);

  return normalizedYear >= startYear && normalizedYear <= endYear;
}

function supportsUfAggregation(section: ReportTableSection) {
  const groupKey = resolveGroupKey(section);
  const yearKey = resolveYearKey(section);
  const valueKey = resolveValueKey(section);

  return section.data.some((row) => {
    const group = getRowString(row, groupKey);
    const year = getRowNumber(row, yearKey);
    const value = getRowNumber(row, valueKey);
    return !!group && year !== null && value !== null;
  });
}

function buildSelectedRangeUfRows(
  section: ReportTableSection,
  selectedBiome: string,
  startPeriod: string,
  endPeriod: string,
  locale: Locale,
): {
  title: string;
  columns: ResolvedReportTableColumn[];
  rows: ReportTableRow[];
} {
  const groupKey = resolveGroupKey(section);
  const yearKey = resolveYearKey(section);
  const valueKey = resolveValueKey(section);
  const biomeKey = resolveBiomeKey(section);

  const grouped = new Map<string, number>();

  for (const row of section.data) {
    const state = getRowString(row, groupKey);
    const value = getRowNumber(row, valueKey);

    if (!state || value === null) continue;
    if (!matchesBiome(row[biomeKey], selectedBiome)) continue;
    if (!rowMatchesSelectedRange(row, yearKey, startPeriod, endPeriod)) continue;

    grouped.set(state, (grouped.get(state) ?? 0) + value);
  }

  const rows = Array.from(grouped.entries())
    .map(([state, selected_total]) => ({ state, selected_total }))
    .sort((a, b) => {
      if (b.selected_total !== a.selected_total) {
        return b.selected_total - a.selected_total;
      }

      return a.state.localeCompare(b.state, locale === "en" ? "en-US" : "pt-BR");
    })
    .slice(0, 10);

  return {
    title:
      locale === "en"
        ? `State counts in selected range: ${periodLabel(startPeriod, locale)} - ${periodLabel(endPeriod, locale)}`
        : `Contagem por UF no período selecionado: ${periodLabel(startPeriod, locale)} - ${periodLabel(endPeriod, locale)}`,
    columns: [
      {
        key: "state",
        label: locale === "en" ? "State" : "UF",
      },
      {
        key: "selected_total",
        label: locale === "en" ? "Hotspots" : "Focos",
      },
    ],
    rows,
  };
}

function buildFixedUfComparisonRows(
  section: ReportTableSection,
  selectedBiome: string,
  locale: Locale,
): {
  title: string;
  columns: ResolvedReportTableColumn[];
  rows: ReportTableRow[];
} {
  const groupKey = resolveGroupKey(section);
  const yearKey = resolveYearKey(section);
  const valueKey = resolveValueKey(section);
  const biomeKey = resolveBiomeKey(section);

  const grouped = new Map<
    string,
    { current_year_total: number; previous_year_total: number }
  >();

  for (const row of section.data) {
    const state = getRowString(row, groupKey);
    const year = getRowNumber(row, yearKey);
    const value = getRowNumber(row, valueKey);

    if (!state || year === null || value === null) continue;
    if (!matchesBiome(row[biomeKey], selectedBiome)) continue;

    const normalizedYear = Math.trunc(year);
    if (
      normalizedYear !== FIXED_COMPARISON_CURRENT_YEAR &&
      normalizedYear !== FIXED_COMPARISON_PREVIOUS_YEAR
    ) {
      continue;
    }

    if (!grouped.has(state)) {
      grouped.set(state, {
        current_year_total: 0,
        previous_year_total: 0,
      });
    }

    const target = grouped.get(state)!;

    if (normalizedYear === FIXED_COMPARISON_CURRENT_YEAR) {
      target.current_year_total += value;
    }

    if (normalizedYear === FIXED_COMPARISON_PREVIOUS_YEAR) {
      target.previous_year_total += value;
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

  return {
    title:
      locale === "en"
        ? `Fixed annual comparison by state: ${FIXED_COMPARISON_CURRENT_YEAR} vs ${FIXED_COMPARISON_PREVIOUS_YEAR}`
        : `Comparação anual fixa por UF: ${FIXED_COMPARISON_CURRENT_YEAR} vs ${FIXED_COMPARISON_PREVIOUS_YEAR}`,
    columns: [
      {
        key: "state",
        label: locale === "en" ? "State" : "UF",
      },
      {
        key: "current_year_total",
        label:
          locale === "en"
            ? `Hotspots in ${FIXED_COMPARISON_CURRENT_YEAR}`
            : `Focos em ${FIXED_COMPARISON_CURRENT_YEAR}`,
      },
      {
        key: "previous_year_total",
        label:
          locale === "en"
            ? `Hotspots in ${FIXED_COMPARISON_PREVIOUS_YEAR}`
            : `Focos em ${FIXED_COMPARISON_PREVIOUS_YEAR}`,
      },
      {
        key: "absolute_change",
        label: locale === "en" ? "Absolute change" : "Variação absoluta",
      },
      {
        key: "pct_change",
        label: locale === "en" ? "% change" : "Variação %",
      },
    ],
    rows,
  };
}

function buildFallbackComparisonRows(
  section: ReportTableSection,
  selectedBiome: string,
  startYear: number,
  endYear: number,
  locale: Locale,
): {
  columns: ResolvedReportTableColumn[];
  rows: ReportTableRow[];
} {
  const groupKey = resolveGroupKey(section);
  const yearKey = resolveYearKey(section);
  const valueKey = resolveValueKey(section);
  const biomeKey = resolveBiomeKey(section);

  const filtered = section.data
    .map((row) => ({
      state: getRowString(row, groupKey) ?? "",
      year: getRowNumber(row, yearKey),
      value: getRowNumber(row, valueKey),
      biome: row[biomeKey],
    }))
    .filter((item) => {
      if (!item.state || item.year === null || item.value === null) return false;
      if (item.year < startYear || item.year > endYear) return false;
      return matchesBiome(item.biome, selectedBiome);
    });

  const years = Array.from(new Set(filtered.map((item) => Math.trunc(item.year!)))).sort((a, b) => a - b);
  const currentYear = years.length ? years[years.length - 1] : null;
  const previousYear =
    currentYear === null ? null : years.filter((year) => year < currentYear).at(-1) ?? null;

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
    const normalizedYear = Math.trunc(item.year!);

    if (currentYear !== null && normalizedYear === currentYear) {
      target.current_year_total += item.value!;
    }
    if (previousYear !== null && normalizedYear === previousYear) {
      target.previous_year_total += item.value!;
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
  const rendered: ResolvedReportSection[] = [];

  for (const section of report.sections) {
    const title = resolveLocalizedText(section.title, locale);

    if (section.kind === "timeseries") {
      rendered.push({
        id: section.id,
        kind: "timeseries",
        title,
        x_key: section.x_key,
        y_key: section.y_key,
        data: filterMonthlySeries(section.data, selectedBiome, start, end),
      });
      continue;
    }

    if (section.kind === "bar") {
      rendered.push({
        id: section.id,
        kind: "bar",
        title,
        x_key: section.x_key,
        y_key: section.y_key,
        data: filterAnnualSeries(section.data, selectedBiome, startYear, endYear),
      });
      continue;
    }

    const tableSection = section as ReportTableSection;

    if (!supportsUfAggregation(tableSection)) {
      const fallback = buildFallbackComparisonRows(
        tableSection,
        selectedBiome,
        startYear,
        endYear,
        locale,
      );

      rendered.push({
        id: tableSection.id,
        kind: "table",
        title,
        columns: fallback.columns,
        rows: fallback.rows,
      });
      continue;
    }

    const selectedRangeTable = buildSelectedRangeUfRows(
      tableSection,
      selectedBiome,
      start,
      end,
      locale,
    );

    const fixedComparisonTable = buildFixedUfComparisonRows(
      tableSection,
      selectedBiome,
      locale,
    );

    rendered.push({
      id: `${tableSection.id}__selected_range`,
      kind: "table",
      title: selectedRangeTable.title,
      columns: selectedRangeTable.columns,
      rows: selectedRangeTable.rows,
    });

    rendered.push({
      id: `${tableSection.id}__fixed_compare`,
      kind: "table",
      title: fixedComparisonTable.title,
      columns: fixedComparisonTable.columns,
      rows: fixedComparisonTable.rows,
    });
  }

  return rendered;
}

function periodLabel(period: string, locale: Locale) {
  const date = new Date(`${period}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return period;

  return date.toLocaleDateString(getLocaleTag(locale), {
    year: "numeric",
    month: "short",
  });
}

function firstDayOfPeriod(period: string) {
  return `${period}-01`;
}

function lastDayOfPeriod(period: string) {
  const [yearStr, monthStr] = period.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${period}-${String(lastDay).padStart(2, "0")}`;
}

function isoDateToPeriod(isoDate: string) {
  return isoDate.slice(0, 7);
}

function formatLocalizedDateInput(isoDate: string, locale: Locale) {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";

  const year = match[1];
  const month = match[2];
  const day = match[3];

  return locale === "en"
    ? `${month}-${day}-${year}`
    : `${day}-${month}-${year}`;
}

function parseLocalizedDateInput(raw: string, locale: Locale): string | null {
  const cleaned = raw.trim().replace(/\//g, "-").replace(/\./g, "-");
  const match = cleaned.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const a = Number(match[1]);
  const b = Number(match[2]);
  const year = Number(match[3]);

  const month = locale === "en" ? a : b;
  const day = locale === "en" ? b : a;

  if (!Number.isInteger(year) || year < 1900) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;

  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function clampOrRejectIsoDate(
  isoDate: string,
  minIso?: string,
  maxIso?: string,
): string | null {
  if (minIso && isoDate < minIso) return null;
  if (maxIso && isoDate > maxIso) return null;
  return isoDate;
}

function getAvailableDateBounds(periods: string[]) {
  if (!periods.length) {
    return { minDate: undefined, maxDate: undefined };
  }

  const sorted = [...periods].sort();
  return {
    minDate: firstDayOfPeriod(sorted[0]),
    maxDate: lastDayOfPeriod(sorted[sorted.length - 1]),
  };
}

function DateField({
  locale,
  label,
  value,
  min,
  max,
  onChange,
}: {
  locale: Locale;
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  const nativeInputRef = useRef<HTMLInputElement | null>(null);
  const [textValue, setTextValue] = useState(() => formatLocalizedDateInput(value, locale));

  useEffect(() => {
    setTextValue(formatLocalizedDateInput(value, locale));
  }, [value, locale]);

  const placeholder = locale === "en" ? "MM-DD-YYYY" : "DD-MM-YYYY";

  const commitTextValue = () => {
    const parsed = parseLocalizedDateInput(textValue, locale);
    if (!parsed) {
      setTextValue(formatLocalizedDateInput(value, locale));
      return;
    }

    const validated = clampOrRejectIsoDate(parsed, min, max);
    if (!validated) {
      setTextValue(formatLocalizedDateInput(value, locale));
      return;
    }

    onChange(validated);
    setTextValue(formatLocalizedDateInput(validated, locale));
  };

  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-wider text-[color:var(--muted)]">
        {label}
      </span>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={commitTextValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitTextValue();
            }
          }}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 pr-12 text-sm text-[color:var(--foreground)] outline-none"
        />

        <button
          type="button"
          aria-label={locale === "en" ? "Open calendar" : "Abrir calendário"}
          onClick={() => {
            const input = nativeInputRef.current;
            if (!input) return;

            if (typeof input.showPicker === "function") {
              input.showPicker();
            } else {
              input.focus();
              input.click();
            }
          }}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M3 10h18" />
          </svg>
        </button>

        <input
          ref={nativeInputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-0 w-0 opacity-0"
        />
      </div>
    </label>
  );
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
  const analysisScope = report.analysis_scope;
  const availablePeriods = report.filters?.period.available_periods ?? [];

  const initialStartPeriod =
    analysisScope?.window_start_period ??
    periodBounds?.period_start ??
    report.coverage.first_period ??
    "";

  const initialEndPeriod =
    analysisScope?.window_end_period ??
    periodBounds?.period_end ??
    report.coverage.latest_period ??
    "";

  const initialStartDate = firstDayOfPeriod(initialStartPeriod);
  const initialEndDate = lastDayOfPeriod(initialEndPeriod);

  const { minDate, maxDate } = useMemo(
    () => getAvailableDateBounds(availablePeriods),
    [availablePeriods],
  );

  const [selectedBiome, setSelectedBiome] = useState<string>(
    biomeFilter?.default_value ?? ALL_BIOMES_VALUE,
  );
  const [selectedStartDate, setSelectedStartDate] = useState<string>(initialStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState<string>(initialEndDate);

  useEffect(() => {
    setSelectedStartDate(initialStartDate);
    setSelectedEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const selectedStartPeriod = isoDateToPeriod(selectedStartDate);
  const selectedEndPeriod = isoDateToPeriod(selectedEndDate);

  const introAnalysis = useMemo(
    () => buildIntroAnalysis(report.analysis, locale),
    [report.analysis, locale],
  );

  const detailsAnalysis = useMemo(
    () => buildDetailsAnalysis(report.analysis, locale),
    [report.analysis, locale],
  );

  const highlights = useMemo(
    () =>
      localizeHighlights(report.highlights, locale).filter(
        (item) => item.id !== "coverage_year_range" && item.id !== "latest_period",
      ),
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

  const heroCredit =
    locale === "en"
      ? catalogItem.heroImageCreditEn ?? catalogItem.heroImageCreditPt
      : catalogItem.heroImageCreditPt ?? catalogItem.heroImageCreditEn;


  const filterSlot = (
    <ReportMinimalFilters
      locale={locale}
      biomeFilter={biomeFilter}
      selectedBiome={selectedBiome}
      onBiomeChange={setSelectedBiome}
      selectedStartDate={selectedStartDate}
      selectedEndDate={selectedEndDate}
      min={minDate}
      max={maxDate}
      onStartDateChange={setSelectedStartDate}
      onEndDateChange={setSelectedEndDate}
      onReset={() => {
        setSelectedBiome(biomeFilter?.default_value ?? ALL_BIOMES_VALUE);
        setSelectedStartDate(initialStartDate);
        setSelectedEndDate(initialEndDate);
      }}
    />
  );

  if (catalogItem.layout === "news") {
    return (
      <div className="space-y-10">
        <ReportNewsHeader
          locale={locale}
          categoryTitle={catalogItem.categoryTitle}
          sourceTitle={catalogItem.sourceTitle}
          title={resolveLocalizedText(report.title, locale)}
          generatedAt={report.generated_at}
          heroImageSrc={catalogItem.heroImageSrc}
          heroImageCredit={heroCredit}
        />

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="min-w-0 space-y-10">
            <ReportAnalysis
              locale={locale}
              mode="intro"
              variant="news"
              analysis={introAnalysis}
            />

            <ReportAnalysis
              locale={locale}
              mode="details"
              variant="news"
              analysis={detailsAnalysis}
            />

            <div className="space-y-12 border-t border-[color:var(--border)] pt-10">
              {renderableSections.map((section) => (
                <ReportSectionRenderer
                  key={section.id}
                  locale={locale}
                  section={section}
                  variant="news"
                  filterSlot={filterSlot}
                />
              ))}
            </div>

            <ReportMethodology
              locale={locale}
              variant="news"
              methodology={methodology}
              sourcePortalHref={catalogItem.sourcePortalHref}
            />
          </div>

          <ReportNewsSidebar
            locale={locale}
            catalogItem={catalogItem}
            generatedAt={report.generated_at}
            yearRange={report.coverage.year_range}
            latestPeriod={report.coverage.latest_period}
            highlights={highlights}
            relatedAgricolasNews={catalogItem.id === "bdqueimadas_overview"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReportHero
        locale={locale}
        categoryTitle={catalogItem.categoryTitle}
        sourceTitle={catalogItem.sourceTitle}
        title={resolveLocalizedText(report.title, locale)}
        generatedAt={report.generated_at}
        yearRange={report.coverage.year_range}
        latestPeriod={report.coverage.latest_period}
        sourcePortalHref={catalogItem.sourcePortalHref}
      />

      <ReportAnalysis locale={locale} mode="intro" analysis={introAnalysis} />

      <ReportHighlights locale={locale} highlights={highlights} />

      <ReportAnalysis locale={locale} mode="details" analysis={detailsAnalysis} />

      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-float)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[color:var(--foreground)]">
              {locale === "en" ? "Filters" : "Filtros"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBiome(biomeFilter?.default_value ?? ALL_BIOMES_VALUE);
              setSelectedStartDate(initialStartDate);
              setSelectedEndDate(initialEndDate);
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

          <DateField
            locale={locale}
            label={locale === "en" ? "Start date" : "Data inicial"}
            value={selectedStartDate}
            min={minDate}
            max={maxDate}
            onChange={setSelectedStartDate}
          />

          <DateField
            locale={locale}
            label={locale === "en" ? "End date" : "Data final"}
            value={selectedEndDate}
            min={minDate}
            max={maxDate}
            onChange={setSelectedEndDate}
          />
        </div>

        <div className="mt-4 text-xs leading-relaxed text-[color:var(--muted)]">
          {locale === "en" ? "Active range:" : "Faixa ativa:"}{" "}
          <span className="font-semibold text-[color:var(--foreground)]">
            {periodLabel(normalizedRange.start, locale)} - {periodLabel(normalizedRange.end, locale)}
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