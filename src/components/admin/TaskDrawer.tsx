// src/components/admin/TaskDrawer.tsx
"use client";

import {
  DOMAIN_BADGE,
  DOMAIN_LABEL,
  PRIORITY_BADGE,
  PRIORITY_LABEL,
  STATUS_LABEL,
  TYPE_LABEL,
  formatDate,
  type Task,
} from "@/lib/admin/tasks";

export default function TaskDrawer({
  task,
  dependsOn,
  dependents,
  derivedBlocked,
  onClose,
  onDelete,
}: {
  task: Task | null;
  dependsOn: Task[];
  dependents: Task[];
  derivedBlocked: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-[75]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-[92vw] max-w-md overflow-y-auto border-l border-[color:var(--border)] bg-[color:var(--surface)] p-5 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${DOMAIN_BADGE[task.domain]}`}
              >
                {DOMAIN_LABEL[task.domain]}
              </span>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_BADGE[task.priority]}`}
              >
                {PRIORITY_LABEL[task.priority]}
              </span>
              <span className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
                {TYPE_LABEL[task.type]}
              </span>
              {derivedBlocked && (
                <span className="inline-flex items-center rounded-md border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-300">
                  Blocked by deps
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold leading-snug">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 hover:bg-[color:var(--surface-3)]"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <DetailRow label="Status" value={STATUS_LABEL[task.status]} />
        <DetailRow label="Due date" value={formatDate(task.due_date) ?? "-"} />
        <DetailRow label="Created" value={formatDate(task.created_at) ?? "-"} />
        <DetailRow label="Updated" value={formatDate(task.updated_at) ?? "-"} />

        <Section title="Description">
          <p className="whitespace-pre-wrap text-sm text-[color:var(--foreground)]">
            {task.description?.trim() || (
              <span className="text-[color:var(--muted)]">Sem descricao.</span>
            )}
          </p>
        </Section>

        <Section title="Impact">
          <p className="whitespace-pre-wrap text-sm text-[color:var(--foreground)]">
            {task.impact?.trim() || (
              <span className="text-[color:var(--muted)]">Nao informado.</span>
            )}
          </p>
        </Section>

        <Section
          title={`Depends on (${dependsOn.length})`}
          hint="Tasks que precisam estar Done para esta sair de bloqueio."
        >
          <DepList items={dependsOn} emptyText="Sem dependencias." />
        </Section>

        <Section
          title={`Required by (${dependents.length})`}
          hint="Tasks que estao bloqueadas ate esta ser concluida."
        >
          <DepList items={dependents} emptyText="Nenhuma task depende desta." />
        </Section>

        <div className="mt-6 flex items-center justify-end border-t border-[color:var(--border)] pt-4">
          <button
            onClick={async () => {
              if (!confirm("Excluir esta task? Dependencias relacionadas serao removidas.")) return;
              await onDelete(task.id);
            }}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
          >
            Excluir task
          </button>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--border)] py-2 text-sm">
      <span className="text-[color:var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
        {title}
      </h3>
      {hint && <p className="mb-2 text-[11px] text-[color:var(--muted)]">{hint}</p>}
      {children}
    </section>
  );
}

function DepList({ items, emptyText }: { items: Task[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-[color:var(--muted)]">{emptyText}</p>;
  }
  return (
    <ul className="space-y-1">
      {items.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm"
        >
          <span className="truncate">{t.title}</span>
          <span
            className={`ml-2 shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] ${
              t.status === "done"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-300"
            }`}
          >
            {STATUS_LABEL[t.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
