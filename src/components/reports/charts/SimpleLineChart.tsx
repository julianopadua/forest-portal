// src/components/reports/charts/SimpleLineChart.tsx

type Point = {
  x: string;
  y: number;
};

function formatNumber(n: number) {
  return n.toLocaleString("pt-BR");
}

export default function SimpleLineChart({
  data,
  height = 260,
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

          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-[color:var(--primary)]"
          />

          {data.map((d, i) => (
            <g key={`${d.x}-${i}`}>
              <circle
                cx={xAt(i)}
                cy={yAt(d.y)}
                r="4"
                fill="currentColor"
                className="text-[color:var(--primary)]"
              />
              <title>{`${d.x}: ${formatNumber(d.y)}`}</title>
            </g>
          ))}

          {data.map((d, i) => {
            if (i % Math.ceil(data.length / 8) !== 0 && i !== data.length - 1) return null;
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
