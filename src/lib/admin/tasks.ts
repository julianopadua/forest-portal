// src/lib/admin/tasks.ts
import type { Database } from "@/lib/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type TaskDependency = Database["public"]["Tables"]["task_dependencies"]["Row"];

export type TaskStatus = Task["status"];
export type TaskDomain = Task["domain"];
export type TaskType = Task["type"];
export type TaskPriority = Task["priority"];

export const STATUSES: TaskStatus[] = [
  "backlog",
  "ready",
  "in_progress",
  "blocked",
  "review",
  "done",
];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  ready: "Ready",
  in_progress: "In Progress",
  blocked: "Blocked",
  review: "Review",
  done: "Done",
};

export const DOMAINS: TaskDomain[] = ["frontend", "backend", "data"];

export const DOMAIN_LABEL: Record<TaskDomain, string> = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Data Pipeline",
};

export const DOMAIN_BADGE: Record<TaskDomain, string> = {
  frontend:
    "border-blue-500/40 bg-blue-500/15 text-blue-300",
  backend:
    "border-purple-500/40 bg-purple-500/15 text-purple-300",
  data:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
};

export const TYPES: TaskType[] = ["feature", "bug", "refactor", "data", "research"];

export const TYPE_LABEL: Record<TaskType, string> = {
  feature: "Feature",
  bug: "Bug",
  refactor: "Refactor",
  data: "Data",
  research: "Research",
};

export const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const PRIORITY_BADGE: Record<TaskPriority, string> = {
  low: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  medium: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  high: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  critical: "border-red-500/50 bg-red-500/15 text-red-300",
};

// um task eh derivado-bloqueado se nao esta done e tem ao menos uma dependencia que nao esta done
export function isDerivedBlocked(
  task: Task,
  depsByTaskId: Map<string, string[]>,
  taskById: Map<string, Task>
): boolean {
  if (task.status === "done") return false;
  const deps = depsByTaskId.get(task.id) ?? [];
  for (const depId of deps) {
    const dep = taskById.get(depId);
    if (!dep) continue;
    if (dep.status !== "done") return true;
  }
  return false;
}

export function buildDepsIndex(deps: TaskDependency[]): {
  depsByTaskId: Map<string, string[]>;
  dependentsByTaskId: Map<string, string[]>;
} {
  const depsByTaskId = new Map<string, string[]>();
  const dependentsByTaskId = new Map<string, string[]>();
  for (const d of deps) {
    if (!depsByTaskId.has(d.task_id)) depsByTaskId.set(d.task_id, []);
    depsByTaskId.get(d.task_id)!.push(d.depends_on_task_id);

    if (!dependentsByTaskId.has(d.depends_on_task_id))
      dependentsByTaskId.set(d.depends_on_task_id, []);
    dependentsByTaskId.get(d.depends_on_task_id)!.push(d.task_id);
  }
  return { depsByTaskId, dependentsByTaskId };
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return null;
  }
}
