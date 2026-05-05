// src/components/admin/KanbanBoard.tsx
"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import {
  STATUSES,
  STATUS_LABEL,
  type Task,
  type TaskStatus,
} from "@/lib/admin/tasks";

const COLUMN_HINT: Record<TaskStatus, string> = {
  backlog: "Ideias e itens nao refinados",
  ready: "Refinado, pronto para execucao",
  in_progress: "Trabalho ativo agora",
  blocked: "Aguardando algo externo",
  review: "Aguardando revisao ou aceite",
  done: "Concluida e aceita",
};

export default function KanbanBoard({
  tasks,
  derivedBlockedById,
  depCountById,
  onOpenTask,
  onMoveTask,
}: {
  tasks: Task[];
  derivedBlockedById: Map<string, boolean>;
  depCountById: Map<string, number>;
  onOpenTask: (id: string) => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
}) {
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const [, setDraggingId] = useState<string | null>(null);

  const grouped = STATUSES.reduce<Record<TaskStatus, Task[]>>((acc, s) => {
    acc[s] = [];
    return acc;
  }, {
    backlog: [],
    ready: [],
    in_progress: [],
    blocked: [],
    review: [],
    done: [],
  });
  for (const t of tasks) grouped[t.status].push(t);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {STATUSES.map((status) => {
        const isOver = dragOver === status;
        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (dragOver !== status) setDragOver(status);
            }}
            onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              setDragOver(null);
              setDraggingId(null);
              if (id) onMoveTask(id, status);
            }}
            className={`flex flex-col rounded-2xl border bg-[color:var(--surface-2)]/50 p-3 transition ${
              isOver
                ? "border-[color:var(--ring)] bg-[color:var(--surface-2)]"
                : "border-[color:var(--border)]"
            }`}
          >
            <header className="mb-3 flex items-baseline justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--foreground)]">
                  {STATUS_LABEL[status]}
                </h2>
                <p className="text-[11px] leading-snug text-[color:var(--muted)]">
                  {COLUMN_HINT[status]}
                </p>
              </div>
              <span className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-1.5 py-0.5 text-[11px] text-[color:var(--muted)]">
                {grouped[status].length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-2">
              {grouped[status].length === 0 ? (
                <div className="rounded-xl border border-dashed border-[color:var(--border)] p-3 text-center text-[11px] text-[color:var(--muted)]">
                  Solte uma task aqui
                </div>
              ) : (
                grouped[status].map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    derivedBlocked={derivedBlockedById.get(t.id) ?? false}
                    depCount={depCountById.get(t.id) ?? 0}
                    onOpen={onOpenTask}
                    onDragStart={(id) => setDraggingId(id)}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
