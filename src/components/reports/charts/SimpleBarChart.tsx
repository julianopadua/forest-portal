// src/components/reports/charts/SimpleBarChart.tsx
import type { Locale } from "@/lib/reports/types";

type Point = {
  x: string;
  y: number;
};

function formatNumber(n: number, locale: Locale) {
  return n.toLocaleString(locale === "en" ? "en-US" : "pt-BR");
}

function getTickStep(length: number) {
  if (length <= 12) return 1;
  if (length <= 24) return 2;
  if (length <= 60) return 4;
  return 6;
}

export default function SimpleBarChart({
  locale,
  data,
  height = 300,
  xAxisLabel,
  yAxisLabel,
  variant = "default",
}: {
  locale: Locale;
  data: Point[];
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  variant?: "default" | "news";
}) {
  if (!data.length) {
    return (
      <div
        className={`border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)] ${
          variant === "news" ? "rounded-lg" : "rounded-2xl shadow-[var(--shadow-float)]"
        }`}
      >
        {locale === "en" ? "No data." : "Sem dados."}
      </div>
    );
  }

  const width = 1000;
  const axisLabelBottom = xAxisLabel ? 22 : 0;
  const axisLabelLeft = yAxisLabel ? 18 : 0;
  const padding = {
    top: 20,
    right: 20,
    bottom: 56 + axisLabelBottom,
    left: 64 + axisLabelLeft,
  };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxY = Math.max(...data.map((d) => d.y), 1);
  const ticks = 4;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) => (maxY * i) / ticks);

  const barGap = Math.max(4, Math.min(14, plotWidth / (data.length * 5)));
  const barWidth = Math.max(2, (plotWidth - (data.length - 1) * barGap) / data.length);

  const xAt = (index: number) => padding.left + index * (barWidth + barGap);
  const yAt = (value: number) => padding.top + (1 - value / maxY) * plotHeight;
  const tickStep = getTickStep(data.length);

  return (
    <div
      className={`border border-[color:var(--border)] bg-[color:var(--surface)] p-3 ${
        variant === "news" ? "rounded-lg" : "rounded-2xl p-4 shadow-[var(--shadow-float)]"
      }`}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
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

        {data.map((d, i) => {
          const x = xAt(i);
          const y = yAt(d.y);
          const h = padding.top + plotHeight - y;

          return (
            <g key={`${d.x}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                fill="currentColor"
                className="text-[color:var(--primary)]"
              />
              <title>{`${d.x}: ${formatNumber(d.y, locale)}`}</title>

              {i % tickStep === 0 || i === data.length - 1 ? (
                <text
                  x={x + barWidth / 2}
                  y={height - 16 - axisLabelBottom}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.75"
                >
                  {d.x}
                </text>
              ) : null}
            </g>
          );
        })}

        {yAxisLabel ? (
          <text
            x={12 + axisLabelLeft / 2}
            y={padding.top + plotHeight / 2}
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
            opacity="0.72"
            transform={`rotate(-90 ${12 + axisLabelLeft / 2} ${padding.top + plotHeight / 2})`}
          >
            {yAxisLabel}
          </text>
        ) : null}

        {xAxisLabel ? (
          <text
            x={padding.left + plotWidth / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
            opacity="0.72"
          >
            {xAxisLabel}
          </text>
        ) : null}
      </svg>
    </div>
  );
}