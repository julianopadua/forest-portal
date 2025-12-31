// src/components/open-data/OpenDataCatalog.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OPEN_DATA_DATASETS, type OpenDataDataset } from "@/lib/openData/catalog";
import type { OpenDataManifest } from "@/lib/openData/types";
import { getPublicObjectUrl } from "@/lib/openData/publicUrls";

type DatasetMetaState =
  | { status: "idle" | "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; generated_at: string };

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>
) {
  const queue = items.slice();
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      await fn(item);
    }
  });
  await Promise.all(workers);
}

type SourceNode = {
  key: string; // source_id
  title: string; // source_title
  datasets: OpenDataDataset[];
};

type CategoryNode = {
  key: string; // category_title
  title: string; // category_title
  sources: SourceNode[];
};

/**
 * Categorias "fixas" do portal.
 * Mesmo vazias, aparecem no catálogo (quando query estiver vazia).
 */
const CATALOG_CATEGORIES_ORDER = [
  "Mercado financeiro",
  "Variáveis climáticas",
  "Incêndios e risco",
  "Outros",
];

export default function OpenDataCatalog({ query }: { query: string }) {
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [openSources, setOpenSources] = useState<Record<string, boolean>>({});
  const [states, setStates] = useState<Record<string, DatasetMetaState>>(() => {
    const init: Record<string, DatasetMetaState> = {};
    for (const ds of OPEN_DATA_DATASETS) init[ds.id] = { status: "idle" };
    return init;
  });

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      await runWithConcurrency(OPEN_DATA_DATASETS, 6, async (ds) => {
        if (cancelled) return;

        setStates((s) => ({ ...s, [ds.id]: { status: "loading" } }));

        try {
          const url = getPublicObjectUrl(ds.manifest_path);
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar manifest`);

          const manifest = (await res.json()) as OpenDataManifest;

          if (!cancelled) {
            setStates((s) => ({
              ...s,
              [ds.id]: { status: "ready", generated_at: manifest.generated_at },
            }));
          }
        } catch (e: any) {
          if (!cancelled) {
            setStates((s) => ({
              ...s,
              [ds.id]: { status: "error", error: e?.message || "Erro ao carregar" },
            }));
          }
        }
      });
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const tree = useMemo<CategoryNode[]>(() => {
    const q = normalize(query);

    const filtered = q
      ? OPEN_DATA_DATASETS.filter((ds) => {
          const hay = normalize(
            [ds.title, ds.description, ds.category_title, ds.source_title, ds.source_id, ds.slug].join(" ")
          );
          return hay.includes(q);
        })
      : OPEN_DATA_DATASETS;

    const catMap = new Map<string, Map<string, OpenDataDataset[]>>();

    for (const ds of filtered) {
      const cat = ds.category_title || "Outros";
      const src = ds.source_id || "fonte";

      if (!catMap.has(cat)) catMap.set(cat, new Map());
      const srcMap = catMap.get(cat)!;

      if (!srcMap.has(src)) srcMap.set(src, []);
      srcMap.get(src)!.push(ds);
    }

    let categories: CategoryNode[] = Array.from(catMap.entries()).map(([catTitle, srcMap]) => {
      const sources: SourceNode[] = Array.from(srcMap.entries())
        .map(([sourceId, datasets]) => {
          datasets.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
          const title = datasets[0]?.source_title || sourceId;
          return { key: sourceId, title, datasets };
        })
        .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));

      return { key: catTitle, title: catTitle, sources };
    });

    // Se não tem busca ativa, injeta categorias vazias do "catálogo oficial"
    if (!q) {
      const existing = new Map(categories.map((c) => [c.key, c]));
      for (const catTitle of CATALOG_CATEGORIES_ORDER) {
        if (!existing.has(catTitle)) {
          categories.push({ key: catTitle, title: catTitle, sources: [] });
        }
      }

      // ordena pela ordem fixa (e joga desconhecidas para depois)
      const orderIndex = new Map(CATALOG_CATEGORIES_ORDER.map((t, i) => [t, i]));
      categories.sort((a, b) => {
        const ia = orderIndex.has(a.title) ? orderIndex.get(a.title)! : 999;
        const ib = orderIndex.has(b.title) ? orderIndex.get(b.title)! : 999;
        if (ia !== ib) return ia - ib;
        return a.title.localeCompare(b.title, "pt-BR");
      });
    } else {
      // em busca, ordena alfabeticamente
      categories.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    return categories;
  }, [query]);

  useEffect(() => {
    const q = normalize(query);
    if (!q) return;

    const nextCats: Record<string, boolean> = {};
    const nextSources: Record<string, boolean> = {};

    for (const cat of tree) {
      nextCats[cat.key] = true;
      for (const src of cat.sources) {
        nextSources[`${cat.key}__${src.key}`] = true;
      }
    }

    setOpenCats((prev) => ({ ...prev, ...nextCats }));
    setOpenSources((prev) => ({ ...prev, ...nextSources }));
  }, [query, tree]);

  function toggleCat(catKey: string) {
    setOpenCats((s) => ({ ...s, [catKey]: !s[catKey] }));
  }

  function toggleSource(catKey: string, sourceKey: string) {
    const k = `${catKey}__${sourceKey}`;
    setOpenSources((s) => ({ ...s, [k]: !s[k] }));
  }

  return (
    <div className="flex flex-col gap-4 pb-12">
      {tree.map((cat) => {
        const isOpen = !!openCats[cat.key];
        const totalDatasets = cat.sources.reduce((acc, s) => acc + s.datasets.length, 0);

        return (
          <section
            key={cat.key}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-float)]"
          >
            <button
              type="button"
              onClick={() => toggleCat(cat.key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div>
                <h2 className="text-base font-semibold text-[color:var(--text)]">{cat.title}</h2>
                <div className="mt-1 text-xs text-[color:var(--muted)]">{totalDatasets} datasets</div>
              </div>
              <span className="text-[color:var(--muted)]">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                {cat.sources.length === 0 ? (
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--muted)]">
                    Nenhum dataset nesta categoria ainda.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {cat.sources.map((src) => {
                      const key = `${cat.key}__${src.key}`;
                      const srcOpen = !!openSources[key];

                      return (
                        <div key={src.key} className="rounded-xl border border-[color:var(--border)]">
                          <button
                            type="button"
                            onClick={() => toggleSource(cat.key, src.key)}
                            aria-expanded={srcOpen}
                            className="flex w-full items-center justify-between gap-4 bg-[color:var(--surface-2)] px-4 py-3 text-left"
                          >
                            <div className="text-sm font-medium text-[color:var(--text)]">
                              {src.title}{" "}
                              <span className="text-xs font-normal text-[color:var(--muted)]">
                                ({src.datasets.length})
                              </span>
                            </div>
                            <span className="text-[color:var(--muted)]">{srcOpen ? "−" : "+"}</span>
                          </button>

                          {srcOpen && (
                            <ul className="divide-y divide-[color:var(--border)]">
                              {src.datasets.map((ds) => {
                                const st = states[ds.id];

                                let updatedLabel = "Carregando…";
                                if (st?.status === "ready") updatedLabel = formatDateOnly(st.generated_at);
                                if (st?.status === "error") updatedLabel = "Erro";

                                return (
                                  <li key={ds.id} className="px-4 py-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                      <div>
                                        <div className="text-sm font-semibold text-[color:var(--text)]">
                                          {ds.title}
                                        </div>
                                        <div className="mt-1 text-xs text-[color:var(--muted)]">
                                          {ds.description}
                                        </div>
                                        <div className="mt-2 text-xs text-[color:var(--muted)]">
                                          Atualizado em: {updatedLabel}
                                        </div>
                                      </div>

                                      <div className="md:ml-4">
                                        <Link
                                          className="inline-flex items-center justify-center rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                          href={`/open-data/${ds.source_id}/${ds.slug}`}
                                        >
                                          Ver downloads
                                        </Link>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}

      {tree.length === 0 && (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm text-[color:var(--muted)] shadow-[var(--shadow-float)]">
          Nenhum dataset encontrado.
        </div>
      )}
    </div>
  );
}
