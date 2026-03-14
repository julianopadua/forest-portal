// src/components/reports/charts/SimpleBarChart.tsx

type Point = {
  x: string;
  y: number;
};

function formatNumber(n: number) {
  return n.toLocaleString("pt-BR");
}

export default function SimpleBarChart({
  data,
  height = 280,
}: {
  data: Point[];
  height?: number;
}) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
        Sem dados.
      </div>
    );
  }

  const width = 900;
  const padding = { top: 20, right: 20, bottom: 44, left: 56 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxY = Math.max(...data.map((d) => d.y), 1);
  const barGap = 16;
  const barWidth = Math.max(20, (plotWidth - (data.length - 1) * barGap) / data.length);

  const xAt = (index: number) => padding.left + index * (barWidth + barGap);
  const yAt = (value: number) => padding.top + (1 - value / maxY) * plotHeight;

  const ticks = 4;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) => (maxY * i) / ticks);

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-float)]">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px] w-full h-auto">
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
                  {formatNumber(Math.round(tick))}
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
                  rx="8"
                  fill="currentColor"
                  className="text-[color:var(--primary)]"
                />
                <title>{`${d.x}: ${formatNumber(d.y)}`}</title>
                <text
                  x={x + barWidth / 2}
                  y={height - 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.75"
                >
                  {d.x}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
