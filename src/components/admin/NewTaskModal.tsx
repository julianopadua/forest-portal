// src/components/admin/NewTaskModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import {
  DOMAINS,
  DOMAIN_LABEL,
  PRIORITIES,
  PRIORITY_LABEL,
  STATUSES,
  STATUS_LABEL,
  TYPES,
  TYPE_LABEL,
  type Task,
  type TaskInsert,
} from "@/lib/admin/tasks";

type FormState = {
  title: string;
  description: string;
  domain: Task["domain"];
  type: Task["type"];
  priority: Task["priority"];
  status: Task["status"];
  due_date: string;
  impact: string;
  dependsOn: string[];
};

const INITIAL: FormState = {
  title: "",
  description: "",
  domain: "frontend",
  type: "feature",
  priority: "medium",
  status: "backlog",
  due_date: "",
  impact: "",
  dependsOn: [],
};

export default function NewTaskModal({
  open,
  onClose,
  allTasks,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  allTasks: Task[];
  onCreate: (insert: TaskInsert, dependsOn: string[]) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(INITIAL);
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const sortedTasks = useMemo(
    () => [...allTasks].sort((a, b) => a.title.localeCompare(b.title)),
    [allTasks]
  );

  if (!open) return null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function toggleDep(id: string) {
    setForm((s) =>
      s.dependsOn.includes(id)
        ? { ...s, dependsOn: s.dependsOn.filter((x) => x !== id) }
        : { ...s, dependsOn: [...s.dependsOn, id] }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title eh obrigatorio");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const insert: TaskInsert = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        domain: form.domain,
        type: form.type,
        priority: form.priority,
        status: form.status,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
        impact: form.impact.trim() || null,
      };
      await onCreate(insert, form.dependsOn);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar task";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 max-h-[92vh] w-[96vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">New Task</h2>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              Cria uma nova tarefa no board. Cada campo abaixo tem uma descricao curta para ajudar quem nunca usou o sistema.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 text-sm hover:bg-[color:var(--surface-3)]"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Title"
            hint="Resumo curto e acionavel da tarefa. O que vai aparecer no card do board."
          >
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              autoFocus
              required
            />
          </Field>

          <Field
            label="Description"
            hint="Contexto e escopo. Explique o problema ou objetivo de forma que outra pessoa consiga executar."
          >
            <textarea
              className={`${inputClass} min-h-[88px]`}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Domain"
              hint="Define em qual parte do sistema essa tarefa atua: interface (frontend), backend ou pipeline de dados."
            >
              <select
                className={inputClass}
                value={form.domain}
                onChange={(e) => update("domain", e.target.value as Task["domain"])}
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {DOMAIN_LABEL[d]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Type"
              hint="Natureza do trabalho. Feature: novo comportamento. Bug: corrigir defeito. Refactor: melhorar codigo sem mudar comportamento. Data: ingestao ou transformacao. Research: investigar antes de executar."
            >
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => update("type", e.target.value as Task["type"])}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Priority"
              hint="Quao urgente eh executar agora. Critical bloqueia outros trabalhos. Low pode esperar."
            >
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => update("priority", e.target.value as Task["priority"])}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Status"
              hint="Indica em qual etapa do fluxo Kanban a tarefa esta. Veja Docs para o significado de cada coluna."
            >
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => update("status", e.target.value as Task["status"])}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Due date"
              hint="Data alvo (opcional). Use quando ha um compromisso externo, demo ou bloqueio temporal real."
            >
              <input
                type="date"
                className={inputClass}
                value={form.due_date}
                onChange={(e) => update("due_date", e.target.value)}
              />
            </Field>

            <Field
              label="Impact"
              hint="O que muda quando essa task for concluida? Quem se beneficia? Use para decisoes de prioridade."
            >
              <input
                className={inputClass}
                value={form.impact}
                onChange={(e) => update("impact", e.target.value)}
              />
            </Field>
          </div>

          <Field
            label="Depends on"
            hint="Selecione tasks das quais esta nova task depende. Enquanto qualquer uma delas nao estiver Done, esta task aparece como bloqueada."
          >
            {sortedTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--border)] p-3 text-xs text-[color:var(--muted)]">
                Ainda nao existem outras tasks para depender.
              </div>
            ) : (
              <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2">
                {sortedTasks.map((t) => {
                  const checked = form.dependsOn.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs hover:bg-[color:var(--surface-3)]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDep(t.id)}
                      />
                      <span className="font-medium">{t.title}</span>
                      <span className="ml-auto text-[10px] text-[color:var(--muted)]">
                        {DOMAIN_LABEL[t.domain]} - {STATUS_LABEL[t.status]}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </Field>

          {error && (
            <div className="rounded-lg border border-red-500/30 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--border)] pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[color:var(--ring)]";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-[color:var(--foreground)]">
        {label}
      </label>
      <p className="mb-2 text-[11px] leading-snug text-[color:var(--muted)]">{hint}</p>
      {children}
    </div>
  );
}
