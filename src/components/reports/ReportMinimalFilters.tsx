// src/components/reports/ReportMinimalFilters.tsx
"use client";

import type { Locale } from "@/lib/reports/types";
import { resolveLocalizedText } from "@/lib/reports/localize";
import type { ReportBiomeFilter } from "@/lib/reports/types";

export default function ReportMinimalFilters({
  locale,
  biomeFilter,
  selectedBiome,
  onBiomeChange,
  selectedStartDate,
  selectedEndDate,
  min,
  max,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: {
  locale: Locale;
  biomeFilter?: ReportBiomeFilter;
  selectedBiome: string;
  onBiomeChange: (value: string) => void;
  selectedStartDate: string;
  selectedEndDate: string;
  min?: string;
  max?: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReset: () => void;
}) {
  const labelFilters = locale === "en" ? "Filters" : "Filtros";
  const labelBiome = locale === "en" ? "Biome" : "Bioma";
  const labelStart = locale === "en" ? "From" : "De";
  const labelEnd = locale === "en" ? "To" : "Até";
  const labelReset = locale === "en" ? "Reset" : "Limpar";

  return (
    <div
      className="flex max-w-[min(100%,22rem)] flex-col gap-1.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)]/95 px-2 py-1.5 text-[10px] shadow-sm backdrop-blur-sm sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
      role="group"
      aria-label={labelFilters}
    >
      <span className="hidden font-medium uppercase tracking-wide text-[color:var(--muted)] sm:inline">
        {labelFilters}
      </span>

      <label className="flex min-w-0 items-center gap-1">
        <span className="shrink-0 text-[color:var(--muted)]">{labelBiome}</span>
        <select
          value={selectedBiome}
          onChange={(e) => onBiomeChange(e.target.value)}
          className="h-7 max-w-[9rem] min-w-0 rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-1.5 text-[10px] text-[color:var(--foreground)] outline-none"
        >
          {(biomeFilter?.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {resolveLocalizedText(option.label, locale)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1">
        <span className="shrink-0 text-[color:var(--muted)]">{labelStart}</span>
        <input
          type="date"
          value={selectedStartDate}
          min={min}
          max={max}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="h-7 w-[min(100%,8.5rem)] rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-1 text-[10px] text-[color:var(--foreground)]"
        />
      </label>

      <label className="flex items-center gap-1">
        <span className="shrink-0 text-[color:var(--muted)]">{labelEnd}</span>
        <input
          type="date"
          value={selectedEndDate}
          min={min}
          max={max}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="h-7 w-[min(100%,8.5rem)] rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-1 text-[10px] text-[color:var(--foreground)]"
        />
      </label>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--primary)] underline-offset-2 hover:underline"
      >
        {labelReset}
      </button>
    </div>
  );
}
