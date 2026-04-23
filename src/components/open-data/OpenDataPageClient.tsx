// src/components/open-data/OpenDataPageClient.tsx
"use client";

import { useState } from "react";
import OpenDataCatalog from "@/components/open-data/OpenDataCatalog";
import type { OpenDataDataset } from "@/lib/openData/openDataDataset";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function OpenDataPageClient({ datasets }: { datasets: OpenDataDataset[] }) {
  const [query, setQuery] = useState("");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-[color:var(--text)]">
            Dados abertos
          </h1>

          <div className="flex w-full items-center gap-2 md:max-w-[min(100%,28rem)]">
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text)]"
                aria-label="Limpar busca"
              >
                Limpar
              </button>
            ) : (
              <span className="shrink-0 w-[3.25rem]" aria-hidden />
            )}
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar datasets…"
                className="w-full rounded-xl border border-[color:var(--border)] bg-transparent py-2 pl-10 pr-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--primary)]"
                aria-label="Buscar datasets"
              />
            </div>
          </div>
        </div>

        <p className="mt-2 text-[color:var(--muted)]">
          Arquivos no Storage público e links diretos às fontes oficiais, organizados por dataset e período.
        </p>
      </header>

      <OpenDataCatalog query={query} datasets={datasets} />
    </main>
  );
}
