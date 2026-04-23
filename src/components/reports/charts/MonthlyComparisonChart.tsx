// src/components/reports/charts/MonthlyComparisonChart.tsx
"use client";

import { useState, useMemo } from "react";
import type { Locale, ReportMonthlyYearComparisonPoint } from "@/lib/reports/types";

const ALL = "__all__";

const PT_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(m: number, locale: Locale) {
  return locale === "en" ? EN_MONTHS[m - 1] : PT_MONTHS[m - 1];
}

function formatNumber(n: number, locale: Locale) {
  return n.toLocaleString(locale === "en" ? "en-US" : "pt-BR");
}

function filterData(
  data: ReportMonthlyYearComparisonPoint[],
  biome: string,
  state: string,
): ReportMonthlyYearComparisonPoint[] {
  return data.filter((d) => d.biome === biome && d.state === state).sort((a, b) => a.month - b.month);
}

type SeriesPoint = {
  month: number;
  current: number | null;
  previous: number | null;
  avg: number | null;
};

export default function MonthlyComparisonChart({
  locale,
  currentYear,
  previousYear,
  avgWindowStart,
  avgWindowEnd,
  lastClosedMonth,
  availableBiomes,
  availableStates,
  data,
  variant = "default",
  height = 300,
}: {
  locale: Locale;
  currentYear: number;
  previousYear: number | null;
  avgWindowStart: number;
  avgWindowEnd: number;
  lastClosedMonth: number;
  availableBiomes: Array<{ value: string; label: string }>;
  availableStates: string[];
  data: ReportMonthlyYearComparisonPoint[];
  variant?: "default" | "news";
  height?: number;
}) {
  const [selectedBiome, setSelectedBiome] = useState<string>(ALL);
  const [selectedState, setSelectedState] = useState<string>(ALL);

  const filtered = useMemo(
    () => filterData(data, selectedBiome, selectedState),
    [data, selectedBiome, selectedState],
  );

  const series: SeriesPoint[] = filtered.map((d) => ({
    month: d.month,
    current: d.current_year_val ?? null,
    previous: d.previous_year_val ?? null,
    avg: d.avg_5yr_val ?? null,
  }));

  const hasBiomeFilter = availableBiomes.length > 1;
  const hasStateFilter = availableStates.length > 0;
  const hasFilters = hasBiomeFilter || hasStateFilter;

  const allValues = series.flatMap((s) =>
    [s.current, s.previous, s.avg].filter((v): v is number => v !== null),
  );
  const maxY = allValues.length ? Math.max(...allValues) : 1;
  const minY = 0;
  const rangeY = maxY - minY || 1;

  const width = 900;
  const padding = { top: 24, right: 24, bottom: 52, left: 64 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xAt = (m: number) =>
    padding.left + ((m - 1) / 11) * plotWidth;

  const yAt = (v: number) =>
    padding.top + (1 - (v - minY) / rangeY) * plotHeight;

  const ticks = 4;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) => minY + (rangeY * i) / ticks);

  function buildPath(
    points: Array<{ month: number; value: number | null }>,
    stopAtMonth?: number,
  ): string {
    let d = "";
    let first = true;
    for (const p of points) {
      if (p.value === null) continue;
      if (stopAtMonth !== undefined && p.month > stopAtMonth) break;
      const x = xAt(p.month);
      const y = yAt(p.value);
      d += first ? `M ${x} ${y}` : ` L ${x} ${y}`;
      first = false;
    }
    return d;
  }

  const currentPoints = series.map((s) => ({ month: s.month, value: s.current }));
  const previousPoints = series.map((s) => ({ month: s.month, value: s.previous }));
  const avgPoints = series.map((s) => ({ month: s.month, value: s.avg }));

  const currentPath = buildPath(currentPoints, lastClosedMonth);
  const previousPath = buildPath(previousPoints);
  const avgPath = buildPath(avgPoints);

  // Filled area under avg line
  function buildAreaPath(points: Array<{ month: number; value: number | null }>): string {
    const valid = points.filter((p): p is { month: number; value: number } => p.value !== null);
    if (!valid.length) return "";
    const top = valid.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(p.month)} ${yAt(p.value)}`).join(" ");
    const bottom = `L ${xAt(valid[valid.length - 1].month)} ${yAt(minY)} L ${xAt(valid[0].month)} ${yAt(minY)} Z`;
    return `${top} ${bottom}`;
  }

  const avgArea = buildAreaPath(avgPoints);

  // Last closed month marker for current year
  const lastPoint = currentPoints.findLast((p) => p.value !== null && p.month <= lastClosedMonth);

  const labelBiome = locale === "en" ? "Biome" : "Bioma";
  const labelState = locale === "en" ? "State" : "UF";
  const labelAll = locale === "en" ? "All" : "Todos";
  const labelAllStates = locale === "en" ? "All states" : "Todos os estados";
  const avgLabel =
    avgWindowStart === avgWindowEnd
      ? String(avgWindowStart)
      : `${avgWindowStart}–${avgWindowEnd}`;

  const containerClass =
    variant === "news"
      ? "rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3"
      : "rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-float)]";

  return (
    <div className={containerClass}>
      {/* Inline filters */}
      {hasFilters && (
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted)]">
          {hasBiomeFilter && (
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
          )}
          {hasStateFilter && selectedBiome === ALL && (
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
          )}
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
      )}

      {/* Legend */}
      <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-[color:var(--muted)]">
        <span className="flex items-center gap-1.5">
          <svg width="24" height="10" aria-hidden="true">
            <line x1="0" y1="5" x2="24" y2="5" stroke="var(--color-primary, #2ecc9a)" strokeWidth="2.5" />
            <circle cx="12" cy="5" r="3" fill="var(--color-primary, #2ecc9a)" />
          </svg>
          {currentYear}
        </span>
        {previousYear !== null && (
          <span className="flex items-center gap-1.5">
            <svg width="24" height="10" aria-hidden="true">
              <line
                x1="0" y1="5" x2="24" y2="5"
                stroke="currentColor" strokeWidth="1.8"
                strokeDasharray="4 3" opacity="0.55"
              />
            </svg>
            {previousYear}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <svg width="24" height="10" aria-hidden="true">
            <rect x="0" y="2" width="24" height="6" fill="var(--color-primary, #2ecc9a)" opacity="0.18" rx="1" />
          </svg>
          {locale === "en" ? `avg ${avgLabel}` : `média ${avgLabel}`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[640px] h-auto w-full">
          {/* Grid lines + Y labels */}
          {tickValues.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left} y1={yAt(tick)}
                x2={width - padding.right} y2={yAt(tick)}
                stroke="currentColor" opacity="0.07"
              />
              <text
                x={padding.left - 8} y={yAt(tick) + 4}
                textAnchor="end" fontSize="11"
                fill="currentColor" opacity="0.6"
              >
                {formatNumber(Math.round(tick), locale)}
              </text>
            </g>
          ))}

          {/* 5-year average filled area */}
          {avgArea && (
            <path
              d={avgArea}
              fill="currentColor"
              className="text-[color:var(--primary)]"
              opacity="0.13"
            />
          )}

          {/* 5-year average line */}
          {avgPath && (
            <path
              d={avgPath}
              fill="none"
              stroke="currentColor"
              className="text-[color:var(--primary)]"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              opacity="0.45"
            />
          )}

          {/* Previous year line */}
          {previousPath && (
            <path
              d={previousPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeDasharray="4 3"
              opacity="0.45"
            />
          )}

          {/* Current year line */}
          {currentPath && (
            <path
              d={currentPath}
              fill="none"
              stroke="currentColor"
              className="text-[color:var(--primary)]"
              strokeWidth="2.8"
            />
          )}

          {/* Current year data point circles */}
          {currentPoints.map((p) => {
            if (p.value === null || p.month > lastClosedMonth) return null;
            return (
              <circle
                key={p.month}
                cx={xAt(p.month)} cy={yAt(p.value)}
                r={3.5}
                fill="currentColor"
                className="text-[color:var(--primary)]"
              >
                <title>{`${monthLabel(p.month, locale)} ${currentYear}: ${formatNumber(p.value, locale)}`}</title>
              </circle>
            );
          })}

          {/* Last closed month annotation */}
          {lastPoint && lastPoint.value !== null && (
            <g>
              <circle
                cx={xAt(lastPoint.month)} cy={yAt(lastPoint.value)}
                r={5.5}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[color:var(--primary)]"
              />
              <text
                x={xAt(lastPoint.month)}
                y={yAt(lastPoint.value) - 11}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="currentColor"
                className="text-[color:var(--primary)]"
              >
                {formatNumber(lastPoint.value, locale)}
              </text>
            </g>
          )}

          {/* X-axis month labels */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <text
              key={m}
              x={xAt(m)}
              y={height - padding.bottom + 18}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              opacity={m <= lastClosedMonth ? 0.85 : 0.4}
            >
              {monthLabel(m, locale)}
            </text>
          ))}

          {/* Vertical guide at last closed month */}
          {lastClosedMonth < 12 && (
            <line
              x1={xAt(lastClosedMonth) + plotWidth / 22}
              y1={padding.top}
              x2={xAt(lastClosedMonth) + plotWidth / 22}
              y2={height - padding.bottom}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.2"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
