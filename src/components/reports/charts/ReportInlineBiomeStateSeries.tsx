// src/components/reports/charts/ReportInlineBiomeStateSeries.tsx
"use client";

import { useMemo, useState } from "react";
import type { Locale, ReportSeriesPoint } from "@/lib/reports/types";
import SimpleBarChart from "@/components/reports/charts/SimpleBarChart";
import SimpleLineChart from "@/components/reports/charts/SimpleLineChart";

const ALL = "__all__";

function rowMatches(
  row: ReportSeriesPoint,
  selBiome: string,
  selState: string,
  biomeKey: string,
  stateKey: string,
): boolean {
  const b = String(row[biomeKey] ?? ALL);
  const s = String(row[stateKey] ?? ALL);
  if (selBiome === ALL && selState === ALL) return b === ALL && s === ALL;
  if (selBiome !== ALL && selState === ALL) return b === selBiome && s === ALL;
  if (selBiome === ALL && selState !== ALL) return b === ALL && s === selState;
  return b === selBiome && s === selState;
}

function filterByPeriodMonthly(
  rows: ReportSeriesPoint[],
  xKey: string,
  start: string,
  end: string,
): ReportSeriesPoint[] {
  return rows.filter((r) => {
    const p = String(r[xKey] ?? "");
    return p >= start && p <= end;
  });
}

function filterByPeriodAnnual(
  rows: ReportSeriesPoint[],
  xKey: string,
  startYear: number,
  endYear: number,
): ReportSeriesPoint[] {
  return rows.filter((r) => {
    const y = Number(r[xKey]);
    if (!Number.isFinite(y)) return false;
    return y >= startYear && y <= endYear;
  });
}

function seriesAxisLabels(
  kind: "timeseries" | "bar",
  locale: Locale,
): { x: string; y: string } {
  if (kind === "timeseries") {
    return {
      x: locale === "en" ? "Time (month)" : "Tempo (mês)",
      y: locale === "en" ? "Hotspot count" : "Número de focos",
    };
  }
  return {
    x: locale === "en" ? "Year" : "Ano",
    y: locale === "en" ? "Hotspot count" : "Número de focos",
  };
}

export default function ReportInlineBiomeStateSeries({
  locale,
  variant = "default",
  kind,
  xKey,
  yKey,
  biomeKey,
  stateKey,
  availableBiomes,
  availableStates,
  data,
  periodStart,
  periodEnd,
  startYear,
  endYear,
}: {
  locale: Locale;
  variant?: "default" | "news";
  kind: "timeseries" | "bar";
  xKey: string;
  yKey: string;
  biomeKey: string;
  stateKey: string;
  availableBiomes: Array<{ value: string; label: string }>;
  availableStates: string[];
  data: ReportSeriesPoint[];
  periodStart: string;
  periodEnd: string;
  startYear: number;
  endYear: number;
}) {
  const [selectedBiome, setSelectedBiome] = useState<string>(ALL);
  const [selectedState, setSelectedState] = useState<string>(ALL);

  const hasBiomeFilter = availableBiomes.length > 1;
  const hasStateFilter = availableStates.length > 0;
  const hasFilters = hasBiomeFilter || hasStateFilter;

  const filtered = useMemo(() => {
    const scoped = data.filter((row) =>
      rowMatches(row, selectedBiome, selectedState, biomeKey, stateKey),
    );
    if (kind === "timeseries") {
      return filterByPeriodMonthly(scoped, xKey, periodStart, periodEnd).sort((a, b) =>
        String(a[xKey]).localeCompare(String(b[xKey])),
      );
    }
    return filterByPeriodAnnual(scoped, xKey, startYear, endYear).sort(
      (a, b) => Number(a[xKey]) - Number(b[xKey]),
    );
  }, [
    data,
    selectedBiome,
    selectedState,
    biomeKey,
    stateKey,
    kind,
    xKey,
    periodStart,
    periodEnd,
    startYear,
    endYear,
  ]);

  const chartPoints = filtered.map((item) => ({
    x: String(item[xKey]),
    y: Number(item[yKey] ?? 0),
  }));

  const labelBiome = locale === "en" ? "Biome" : "Bioma";
  const labelState = locale === "en" ? "State" : "UF";
  const labelAll = locale === "en" ? "All" : "Todos";
  const labelAllStates = locale === "en" ? "All states" : "Todos os estados";

  const chartVariant = variant === "news" ? "news" : "default";
  const axes = seriesAxisLabels(kind, locale);

  return (
    <div className="space-y-3">
      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted)]">
          {hasBiomeFilter ? (
            <label className="flex items-center gap-1.5">
              <span className="font-semibold uppercase tracking-wide">{labelBiome}</span>
              <select
                value={selectedBiome}
                onChange={(e) => {
                  setSelectedBiome(e.target.value);
                  setSelectedState(ALL);
                }}
                className="h-7 rounded border border-[color:var(--border)] bg-[color:var(--background)] px-2 text-xs text-[color:var(--foreground)] outline-none"
              >
                {availableBiomes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {hasStateFilter ? (
            <label className="flex items-center gap-1.5">
              <span className="font-semibold uppercase tracking-wide">{labelState}</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-7 rounded border border-[color:var(--border)] bg-[color:var(--background)] px-2 text-xs text-[color:var(--foreground)] outline-none"
              >
                <option value={ALL}>{labelAllStates}</option>
                {availableStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {(selectedBiome !== ALL || selectedState !== ALL) && (
            <button
              type="button"
              onClick={() => {
                setSelectedBiome(ALL);
                setSelectedState(ALL);
              }}
              className="rounded px-1.5 py-0.5 font-medium text-[color:var(--primary)] underline-offset-2 hover:underline"
            >
              {labelAll}
            </button>
          )}
        </div>
      ) : null}

      {kind === "timeseries" ? (
        <SimpleLineChart
          locale={locale}
          variant={chartVariant}
          xAxisLabel={axes.x}
          yAxisLabel={axes.y}
          data={chartPoints}
        />
      ) : (
        <SimpleBarChart
          locale={locale}
          variant={chartVariant}
          xAxisLabel={axes.x}
          yAxisLabel={axes.y}
          data={chartPoints}
        />
      )}
    </div>
  );
}
