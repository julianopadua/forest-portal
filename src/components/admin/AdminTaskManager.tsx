// src/components/admin/AdminTaskManager.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildDepsIndex,
  isDerivedBlocked,
  type Task,
  type TaskDependency,
  type TaskInsert,
  type TaskStatus,
} from "@/lib/admin/tasks";
import KanbanBoard from "./KanbanBoard";
import DomainTabs, { type DomainFilter } from "./DomainTabs";
import NewTaskModal from "./NewTaskModal";
import TaskDrawer from "./TaskDrawer";
import DocsDrawer from "./DocsDrawer";

export default function AdminTaskManager() {
  const supabase = useMemo(() => createClient(), []);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [deps, setDeps] = useState<TaskDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<DomainFilter>("all");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const refresh = useCallback(async () => {
    setError(null);
    const [{ data: ts, error: tErr }, { data: ds, error: dErr }] = await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("task_dependencies").select("*"),
    ]);
    if (tErr || dErr) {
      setError(tErr?.message ?? dErr?.message ?? "Erro ao carregar tasks");
      return;
    }
    setTasks(ts ?? []);
    setDeps(ds ?? []);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const taskById = useMemo(() => {
    const m = new Map<string, Task>();
    for (const t of tasks) m.set(t.id, t);
    return m;
  }, [tasks]);

  const { depsByTaskId, dependentsByTaskId } = useMemo(() => buildDepsIndex(deps), [deps]);

  const derivedBlockedById = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const t of tasks) m.set(t.id, isDerivedBlocked(t, depsByTaskId, taskById));
    return m;
  }, [tasks, depsByTaskId, taskById]);

  const depCountById = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of tasks) m.set(t.id, depsByTaskId.get(t.id)?.length ?? 0);
    return m;
  }, [tasks, depsByTaskId]);

  const filteredTasks = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.domain === filter)),
    [tasks, filter]
  );

  const counts: Record<DomainFilter, number> = useMemo(
    () => ({
      all: tasks.length,
      frontend: tasks.filter((t) => t.domain === "frontend").length,
      backend: tasks.filter((t) => t.domain === "backend").length,
      data: tasks.filter((t) => t.domain === "data").length,
    }),
    [tasks]
  );

  const handleMove = useCallback(
    async (id: string, status: TaskStatus) => {
      const prev = taskById.get(id);
      if (!prev || prev.status === status) return;
      // atualizacao otimista
      setTasks((arr) => arr.map((t) => (t.id === id ? { ...t, status } : t)));
      const { error: uErr } = await supabase.from("tasks").update({ status }).eq("id", id);
      if (uErr) {
        setError(uErr.message);
        // reverte em caso de falha
        setTasks((arr) => arr.map((t) => (t.id === id ? { ...t, status: prev.status } : t)));
      }
    },
    [supabase, taskById]
  );

  const handleCreate = useCallback(
    async (insert: TaskInsert, dependsOn: string[]) => {
      const { data, error: cErr } = await supabase
        .from("tasks")
        .insert(insert)
        .select("*")
        .single();
      if (cErr || !data) throw new Error(cErr?.message ?? "Erro ao criar task");

      if (dependsOn.length > 0) {
        const rows = dependsOn.map((depId) => ({
          task_id: data.id,
          depends_on_task_id: depId,
        }));
        const { error: dErr } = await supabase.from("task_dependencies").insert(rows);
        if (dErr) throw new Error(dErr.message);
      }

      await refresh();
    },
    [supabase, refresh]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const { error: dErr } = await supabase.from("tasks").delete().eq("id", id);
      if (dErr) {
        setError(dErr.message);
        return;
      }
      setOpenTaskId(null);
      await refresh();
    },
    [supabase, refresh]
  );

  const openTask = openTaskId ? taskById.get(openTaskId) ?? null : null;
  const openTaskDeps = openTask
    ? (depsByTaskId.get(openTask.id) ?? [])
        .map((id) => taskById.get(id))
        .filter((t): t is Task => Boolean(t))
    : [];
  const openTaskDependents = openTask
    ? (dependentsByTaskId.get(openTask.id) ?? [])
        .map((id) => taskById.get(id))
        .filter((t): t is Task => Boolean(t))
    : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Task Manager</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Board de tarefas com Kanban, filtros por dominio e grafo explicito de dependencias.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDocsOpen(true)}
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--surface-3)]"
          >
            Docs
          </button>
          <button
            onClick={() => setNewOpen(true)}
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-[color:var(--primary-contrast)] hover:bg-[color:var(--primary-hover)]"
          >
            New Task
          </button>
        </div>
      </header>

      <div className="mb-4">
        <DomainTabs value={filter} counts={counts} onChange={setFilter} />
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--border)] p-10 text-center text-sm text-[color:var(--muted)]">
          Carregando board...
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          derivedBlockedById={derivedBlockedById}
          depCountById={depCountById}
          onOpenTask={setOpenTaskId}
          onMoveTask={handleMove}
        />
      )}

      <NewTaskModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        allTasks={tasks}
        onCreate={handleCreate}
      />

      <TaskDrawer
        task={openTask}
        dependsOn={openTaskDeps}
        dependents={openTaskDependents}
        derivedBlocked={openTask ? derivedBlockedById.get(openTask.id) ?? false : false}
        onClose={() => setOpenTaskId(null)}
        onDelete={handleDelete}
      />

      <DocsDrawer open={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  );
}
