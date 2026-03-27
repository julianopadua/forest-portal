// src/components/reports/charts/SimpleLineChart.tsx
import type { Locale } from "@/lib/reports/types";

type Point = {
  x: string;
  y: number;
};

type ParsedMonthlyPoint = {
  year: number;
  month: number;
  date: Date;
};

const STEP_CANDIDATES = [1, 2, 3, 4, 6, 8, 12, 18, 24, 36, 48];

function formatNumber(n: number, locale: Locale) {
  return n.toLocaleString(locale === "en" ? "en-US" : "pt-BR");
}

function getLocaleTag(locale: Locale) {
  return locale === "en" ? "en-US" : "pt-BR";
}

function pickStep(length: number, targetLabels: number) {
  const rawStep = Math.max(1, Math.ceil(length / targetLabels));
  return STEP_CANDIDATES.find((step) => step >= rawStep) ?? rawStep;
}

function parseMonthlyPoint(value: string): ParsedMonthlyPoint | null {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, 1));
  if (Number.isNaN(date.getTime())) return null;

  return { year, month, date };
}

function formatMonth(date: Date, locale: Locale) {
  return date
    .toLocaleDateString(getLocaleTag(locale), { month: "short", timeZone: "UTC" })
    .replace(/\.$/, "");
}

function formatMonthYear(date: Date, locale: Locale) {
  return date.toLocaleDateString(getLocaleTag(locale), {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

export default function SimpleLineChart({
  locale,
  data,
  height = 280,
}: {
  locale: Locale;
  data: Point[];
  height?: number;
}) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
        {locale === "en" ? "No data." : "Sem dados."}
      </div>
    );
  }

  const width = 900;
  const parsedMonths = data.map((point) => parseMonthlyPoint(point.x));
  const isMonthlySeries = parsedMonths.every((point) => point !== null);
  const yearCount = isMonthlySeries
    ? new Set(parsedMonths.map((point) => point!.year)).size
    : 0;
  const hasMultipleYears = yearCount > 1;

  const padding = {
    top: 20,
    right: 20,
    bottom: hasMultipleYears ? 68 : 48,
    left: 56,
  };

  const values = data.map((d) => d.y);
  const minY = Math.min(...values, 0);
  const maxY = Math.max(...values, 1);
  const rangeY = maxY - minY || 1;

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xAt = (index: number) =>
    padding.left + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);

  const yAt = (value: number) =>
    padding.top + (1 - (value - minY) / rangeY) * plotHeight;

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(d.y)}`)
    .join(" ");

  const ticks = 4;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) => minY + (rangeY * i) / ticks);

  const labelStep = pickStep(data.length, hasMultipleYears ? 10 : 8);
  const pointStep = pickStep(data.length, 18);
  const pointRadius = data.length <= 18 ? 3.5 : data.length <= 36 ? 2.75 : data.length <= 60 ? 2.25 : 1.75;

  const yearSegments = hasMultipleYears
    ? (() => {
        const segments: Array<{ year: number; startIndex: number; endIndex: number }> = [];
        let startIndex = 0;

        for (let i = 1; i <= parsedMonths.length; i += 1) {
          const currentYear = parsedMonths[startIndex]!.year;
          const nextYear = i < parsedMonths.length ? parsedMonths[i]!.year : null;

          if (nextYear !== currentYear) {
            segments.push({
              year: currentYear,
              startIndex,
              endIndex: i - 1,
            });
            startIndex = i;
          }
        }

        return segments;
      })()
    : [];

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-float)]">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px] h-auto w-full">
          {tickValues.map((tick, i) => {
            const y = yAt(tick);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  opacity="0.08"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.65"
                >
                  {formatNumber(Math.round(tick), locale)}
                </text>
              </g>
            );
          })}

          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-[color:var(--primary)]"
          />

          {data.map((d, i) => {
            if (i % pointStep !== 0 && i !== data.length - 1) return null;

            return (
              <g key={`${d.x}-${i}`}>
                <circle
                  cx={xAt(i)}
                  cy={yAt(d.y)}
                  r={pointRadius}
                  fill="currentColor"
                  className="text-[color:var(--primary)]"
                />
                <title>{`${d.x}: ${formatNumber(d.y, locale)}`}</title>
              </g>
            );
          })}

          {hasMultipleYears && (
            <>
              {yearSegments.map((segment, index) => {
                const startX = xAt(segment.startIndex);
                const endX = xAt(segment.endIndex);
                const midX = (startX + endX) / 2;

                return (
                  <g key={`year-${segment.year}`}>
                    {index > 0 ? (
                      <line
                        x1={startX}
                        y1={height - 42}
                        x2={startX}
                        y2={height - 8}
                        stroke="currentColor"
                        opacity="0.12"
                      />
                    ) : null}

                    <text
                      x={midX}
                      y={height - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fill="currentColor"
                      opacity="0.72"
                    >
                      {segment.year}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {data.map((d, i) => {
            const shouldRender = i % labelStep === 0 || i === data.length - 1;
            if (!shouldRender) return null;

            if (isMonthlySeries) {
              const parsed = parsedMonths[i]!;
              return (
                <text
                  key={`label-${d.x}-${i}`}
                  x={xAt(i)}
                  y={hasMultipleYears ? height - 32 : height - 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.75"
                >
                  {hasMultipleYears
                    ? formatMonth(parsed.date, locale)
                    : formatMonthYear(parsed.date, locale)}
                </text>
              );
            }

            return (
              <text
                key={`label-${d.x}-${i}`}
                x={xAt(i)}
                y={height - 16}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                opacity="0.75"
              >
                {d.x}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}