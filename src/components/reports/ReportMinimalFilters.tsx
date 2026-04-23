// src/components/reports/ReportMinimalFilters.tsx
"use client";

import { useState } from "react";
import type { Locale } from "@/lib/reports/types";
import { resolveLocalizedText } from "@/lib/reports/localize";
import type { ReportBiomeFilter } from "@/lib/reports/types";

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04a1 1 0 0 0-.79 1.61z" />
    </svg>
  );
}

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
  const [open, setOpen] = useState(false);

  const labelFilters = locale === "en" ? "Filters" : "Filtros";
  const labelBiome = locale === "en" ? "Biome" : "Bioma";
  const labelStart = locale === "en" ? "From" : "De";
  const labelEnd = locale === "en" ? "To" : "Até";
  const labelReset = locale === "en" ? "Reset" : "Limpar";

  const biomeControl = (
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
  );

  const startControl = (
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
  );

  const endControl = (
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
  );

  const resetButton = (
    <button
      type="button"
      onClick={onReset}
      className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--primary)] underline-offset-2 hover:underline"
    >
      {labelReset}
    </button>
  );

  return (
    <div className="relative text-[10px]">
      {/* Mobile: icon toggle + collapsible panel */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={labelFilters}
          aria-expanded={open}
          className="flex items-center gap-1.5 rounded border border-[color:var(--border)] bg-[color:var(--background)]/95 px-2 py-1 text-[color:var(--foreground)] shadow-sm backdrop-blur-sm"
        >
          <FilterIcon />
          <span className="font-medium text-[color:var(--muted)]">{labelFilters}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-0.5 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && (
          <div
            className="mt-1 flex flex-col gap-1.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)]/95 px-2 py-1.5 shadow-sm backdrop-blur-sm"
            role="group"
            aria-label={labelFilters}
          >
            {biomeControl}
            {startControl}
            {endControl}
            {resetButton}
          </div>
        )}
      </div>

      {/* Desktop: always visible inline row */}
      <div
        className="hidden sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)]/95 px-2 py-1.5 shadow-sm backdrop-blur-sm"
        role="group"
        aria-label={labelFilters}
      >
        <span className="font-medium uppercase tracking-wide text-[color:var(--muted)]">
          {labelFilters}
        </span>
        {biomeControl}
        {startControl}
        {endControl}
        {resetButton}
      </div>
    </div>
  );
}
