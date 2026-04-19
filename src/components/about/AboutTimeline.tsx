import type { ReactNode } from "react";

export type AboutTimelineItem = {
  period: string;
  children: ReactNode;
};

export type AboutTimelineProps = {
  items: AboutTimelineItem[];
};

export function AboutTimeline({ items }: AboutTimelineProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      <ul className="space-y-0 border-l border-[color:var(--border)] pl-6 sm:pl-8">
        {items.map((item, i) => (
          <li key={i} className="relative pb-10 pl-2 last:pb-0">
            <span
              className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-[color:var(--primary)]/70 sm:-left-[29px]"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{item.period}</p>
            <div className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">{item.children}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
