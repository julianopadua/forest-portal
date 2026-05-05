// src/components/admin/DomainTabs.tsx
"use client";

import { DOMAINS, DOMAIN_BADGE, DOMAIN_LABEL, type TaskDomain } from "@/lib/admin/tasks";

export type DomainFilter = "all" | TaskDomain;

export default function DomainTabs({
  value,
  counts,
  onChange,
}: {
  value: DomainFilter;
  counts: Record<DomainFilter, number>;
  onChange: (v: DomainFilter) => void;
}) {
  const tabs: { id: DomainFilter; label: string; badge?: string }[] = [
    { id: "all", label: "All" },
    ...DOMAINS.map((d) => ({ id: d, label: DOMAIN_LABEL[d], badge: DOMAIN_BADGE[d] })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition focus:outline-none ${
              active
                ? "border-[color:var(--ring)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
                : "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted)] hover:bg-[color:var(--surface-3)]"
            }`}
          >
            {t.badge && <span className={`h-2 w-2 rounded-full ${t.badge}`} />}
            <span>{t.label}</span>
            <span className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-1.5 py-0.5 text-[10px]">
              {counts[t.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
