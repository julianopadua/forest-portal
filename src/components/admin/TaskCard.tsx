// src/components/admin/TaskCard.tsx
"use client";

import {
  DOMAIN_BADGE,
  DOMAIN_LABEL,
  PRIORITY_BADGE,
  PRIORITY_LABEL,
  formatDate,
  type Task,
} from "@/lib/admin/tasks";

export default function TaskCard({
  task,
  derivedBlocked,
  depCount,
  onOpen,
  onDragStart,
}: {
  task: Task;
  derivedBlocked: boolean;
  depCount: number;
  onOpen: (id: string) => void;
  onDragStart: (id: string) => void;
}) {
  const due = formatDate(task.due_date);
  const blockedBorder = derivedBlocked
    ? "border-red-500/60 ring-1 ring-red-500/30"
    : "border-[color:var(--border)]";

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task.id);
      }}
      onClick={() => onOpen(task.id)}
      className={`group cursor-pointer rounded-xl border bg-[color:var(--surface)] p-3 transition hover:bg-[color:var(--surface-2)] ${blockedBorder}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${DOMAIN_BADGE[task.domain]}`}
        >
          {DOMAIN_LABEL[task.domain]}
        </span>
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_BADGE[task.priority]}`}
          title={`Priority: ${PRIORITY_LABEL[task.priority]}`}
        >
          {PRIORITY_LABEL[task.priority]}
        </span>
      </div>

      <h3 className="text-sm font-medium leading-snug text-[color:var(--foreground)]">
        {task.title}
      </h3>

      <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--muted)]">
        <span className="flex items-center gap-2">
          {depCount > 0 && (
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${
                derivedBlocked
                  ? "border-red-500/40 text-red-300"
                  : "border-[color:var(--border)] text-[color:var(--muted)]"
              }`}
              title={
                derivedBlocked
                  ? "Bloqueada por dependencia nao resolvida"
                  : "Tem dependencias"
              }
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {depCount}
            </span>
          )}
          {derivedBlocked && (
            <span className="rounded-md border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 text-red-300">
              Blocked
            </span>
          )}
        </span>
        {due && <span title={`Due ${due}`}>{due}</span>}
      </div>
    </article>
  );
}
