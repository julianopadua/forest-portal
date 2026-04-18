"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OPEN_DATA_DATASETS, type OpenDataDataset } from "@/lib/openData/catalog";
import {
  ANP_CATALOG_COMPACT_PATH,
  getGeneratedAtIsoForAnpSlug,
  type AnpCatalogCompact,
} from "@/lib/openData/anpCatalog";
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
  key: string;
  title: string;
  datasets: OpenDataDataset[];
};

type SubCategoryNode = {
  key: string;
  title: string;
  sources: SourceNode[];
};

/** Ex.: segmento "Energia" com várias subáreas (Petróleo e gás, Abastecimento…). */
type SegmentGroupNode = {
  key: string;
  title: string;
  subcategories: SubCategoryNode[];
};

type CategoryNode = {
  key: string;
  title: string;
  segmentGroups: SegmentGroupNode[];
  /** Categorias sem segmento (ex.: Fundos na CVM). */
  flatSubcategories: SubCategoryNode[];
};

const CATALOG_CATEGORIES_ORDER = [
  "Mercado financeiro",
  "Mercado de commodities",
  "Variáveis climáticas",
  "Meio ambiente",
  "Outros",
];

/** Ordem dos segmentos dentro de uma categoria (ex.: commodities). */
const SEGMENT_ORDER = ["Energia"];

/** Ordem das subáreas dentro do segmento Energia. */
const ENERGY_SUBORDER = [
  "Petróleo e gás",
  "Abastecimento e mercado",
  "Biocombustíveis e renováveis",
  "Lubrificantes",
];

const OUTROS_SUBORDER = [
  "Pesquisa e desenvolvimento",
  "Administração",
  "Comércio e serviços",
];

function subcategorySortIndexFlat(catTitle: string, subTitle: string): number {
  if (catTitle === "Outros") {
    const i = OUTROS_SUBORDER.indexOf(subTitle);
    return i >= 0 ? i : 50;
  }
  return 100;
}

function sortSubsEnergy(subs: SubCategoryNode[]): SubCategoryNode[] {
  return subs.slice().sort((a, b) => {
    const ia = ENERGY_SUBORDER.indexOf(a.title);
    const ib = ENERGY_SUBORDER.indexOf(b.title);
    const fa = ia >= 0 ? ia : 999;
    const fb = ib >= 0 ? ib : 999;
    if (fa !== fb) return fa - fb;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}

function sortFlatSubcategories(catTitle: string, subs: SubCategoryNode[]): SubCategoryNode[] {
  return subs.slice().sort((a, b) => {
    const ia = subcategorySortIndexFlat(catTitle, a.title);
    const ib = subcategorySortIndexFlat(catTitle, b.title);
    if (ia !== ib) return ia - ib;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}

function buildSourceNodes(srcMap: Map<string, OpenDataDataset[]>): SourceNode[] {
  return Array.from(srcMap.entries())
    .map(([sourceId, datasets]) => {
      datasets.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
      return { key: sourceId, title: datasets[0]?.source_title || sourceId, datasets };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

/** Chave única por painel de fonte (evita colisão ANP/EIA no mesmo source em subs diferentes). */
function sourcePanelKey(
  catKey: string,
  segmentKey: string | null,
  subKey: string,
  sourceKey: string
) {
  return `${catKey}::${segmentKey ?? "∅"}::${subKey}::${sourceKey}`;
}

function countCategoryDatasets(cat: CategoryNode): number {
  let n = 0;
  for (const seg of cat.segmentGroups) {
    for (const sub of seg.subcategories) {
      for (const src of sub.sources) n += src.datasets.length;
    }
  }
  for (const sub of cat.flatSubcategories) {
    for (const src of sub.sources) n += src.datasets.length;
  }
  return n;
}

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
      const anpList = OPEN_DATA_DATASETS.filter((d) => d.source_id === "anp");
      const rest = OPEN_DATA_DATASETS.filter((d) => d.source_id !== "anp");

      async function loadAnp() {
        if (anpList.length === 0) return;
        for (const ds of anpList) {
          if (cancelled) return;
          setStates((s) => ({ ...s, [ds.id]: { status: "loading" } }));
        }
        try {
          const url = getPublicObjectUrl(ANP_CATALOG_COMPACT_PATH);
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar catálogo ANP`);
          const compact = (await res.json()) as AnpCatalogCompact;
          if (cancelled) return;
          for (const ds of anpList) {
            const iso = getGeneratedAtIsoForAnpSlug(compact, ds.slug);
            if (iso) {
              setStates((s) => ({
                ...s,
                [ds.id]: { status: "ready", generated_at: iso },
              }));
            } else {
              setStates((s) => ({
                ...s,
                [ds.id]: { status: "error", error: "Conjunto não encontrado no catálogo ANP" },
              }));
            }
          }
        } catch (e: unknown) {
          if (cancelled) return;
          const msg = e instanceof Error ? e.message : "Erro ao carregar";
          for (const ds of anpList) {
            setStates((s) => ({
              ...s,
              [ds.id]: { status: "error", error: msg },
            }));
          }
        }
      }

      await Promise.all([
        loadAnp(),
        runWithConcurrency(rest, 6, async (ds) => {
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
          } catch (e: unknown) {
            if (!cancelled) {
              const msg = e instanceof Error ? e.message : "Erro ao carregar";
              setStates((s) => ({
                ...s,
                [ds.id]: { status: "error", error: msg },
              }));
            }
          }
        }),
      ]);
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
            [
              ds.title,
              ds.description,
              ds.category_title,
              ds.segment_title ?? "",
              ds.subcategory_title,
              ds.source_title,
              ds.source_id,
              ds.slug,
            ].join(" ")
          );
          return hay.includes(q);
        })
      : OPEN_DATA_DATASETS;

    type Bucket = {
      segments: Map<string, Map<string, Map<string, OpenDataDataset[]>>>;
      flat: Map<string, Map<string, OpenDataDataset[]>>;
    };

    const catMap = new Map<string, Bucket>();

    function ensureBucket(cat: string): Bucket {
      if (!catMap.has(cat)) {
        catMap.set(cat, { segments: new Map(), flat: new Map() });
      }
      return catMap.get(cat)!;
    }

    for (const ds of filtered) {
      const cat = ds.category_title || "Outros";
      const segment = ds.segment_title?.trim() || null;
      const sub = ds.subcategory_title || "Geral";
      const src = ds.source_id || "fonte";
      const bucket = ensureBucket(cat);

      const push = (srcMap: Map<string, OpenDataDataset[]>) => {
        if (!srcMap.has(src)) srcMap.set(src, []);
        srcMap.get(src)!.push(ds);
      };

      if (segment) {
        if (!bucket.segments.has(segment)) bucket.segments.set(segment, new Map());
        const subMap = bucket.segments.get(segment)!;
        if (!subMap.has(sub)) subMap.set(sub, new Map());
        push(subMap.get(sub)!);
      } else {
        if (!bucket.flat.has(sub)) bucket.flat.set(sub, new Map());
        push(bucket.flat.get(sub)!);
      }
    }

    const categories: CategoryNode[] = Array.from(catMap.entries()).map(([catTitle, data]) => {
      const segmentGroups: SegmentGroupNode[] = Array.from(data.segments.entries())
        .sort((a, b) => {
          const ia = SEGMENT_ORDER.indexOf(a[0]);
          const ib = SEGMENT_ORDER.indexOf(b[0]);
          const fa = ia >= 0 ? ia : 999;
          const fb = ib >= 0 ? ib : 999;
          if (fa !== fb) return fa - fb;
          return a[0].localeCompare(b[0], "pt-BR");
        })
        .map(([segTitle, subMap]) => {
          const subcategories: SubCategoryNode[] = Array.from(subMap.entries()).map(([subTitle, srcMap]) => ({
            key: subTitle,
            title: subTitle,
            sources: buildSourceNodes(srcMap),
          }));
          return {
            key: segTitle,
            title: segTitle,
            subcategories: sortSubsEnergy(subcategories),
          };
        });

      const flatSubcategories: SubCategoryNode[] = Array.from(data.flat.entries()).map(([subTitle, srcMap]) => ({
        key: subTitle,
        title: subTitle,
        sources: buildSourceNodes(srcMap),
      }));

      return {
        key: catTitle,
        title: catTitle,
        segmentGroups,
        flatSubcategories: sortFlatSubcategories(catTitle, flatSubcategories),
      };
    });

    if (!q) {
      const existing = new Map(categories.map((c) => [c.key, c]));
      for (const catTitle of CATALOG_CATEGORIES_ORDER) {
        if (!existing.has(catTitle)) {
          categories.push({
            key: catTitle,
            title: catTitle,
            segmentGroups: [],
            flatSubcategories: [],
          });
        }
      }

      const orderIndex = new Map(CATALOG_CATEGORIES_ORDER.map((t, i) => [t, i]));
      categories.sort((a, b) => {
        const ia = orderIndex.has(a.title) ? orderIndex.get(a.title)! : 999;
        const ib = orderIndex.has(b.title) ? orderIndex.get(b.title)! : 999;
        return ia !== ib ? ia - ib : a.title.localeCompare(b.title, "pt-BR");
      });
    } else {
      categories.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    return categories;
  }, [query]);

  useEffect(() => {
    const q = normalize(query);
    if (!q) {
      setOpenCats({});
      setOpenSources({});
      return;
    }

    const nextCats: Record<string, boolean> = {};
    const nextSources: Record<string, boolean> = {};

    for (const cat of tree) {
      nextCats[cat.key] = true;
      for (const seg of cat.segmentGroups) {
        for (const sub of seg.subcategories) {
          for (const src of sub.sources) {
            nextSources[sourcePanelKey(cat.key, seg.key, sub.key, src.key)] = true;
          }
        }
      }
      for (const sub of cat.flatSubcategories) {
        for (const src of sub.sources) {
          nextSources[sourcePanelKey(cat.key, null, sub.key, src.key)] = true;
        }
      }
    }

    setOpenCats(nextCats);
    setOpenSources(nextSources);
  }, [query, tree]);

  function toggleCat(catKey: string) {
    setOpenCats((s) => ({ ...s, [catKey]: !s[catKey] }));
  }

  function toggleSource(panelKey: string) {
    setOpenSources((s) => ({ ...s, [panelKey]: !s[panelKey] }));
  }

  function renderDatasetRows(dsList: OpenDataDataset[]) {
    return dsList.map((ds) => {
      const st = states[ds.id];
      const updatedLabel =
        st?.status === "ready"
          ? formatDateOnly(st.generated_at)
          : st?.status === "error"
            ? "Erro"
            : "Carregando…";

      return (
        <li key={ds.id} className="px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 max-w-xl flex-1">
              <div className="text-sm font-semibold text-[color:var(--text)]">{ds.title}</div>
              <div className="mt-1 text-xs text-[color:var(--muted)] leading-relaxed line-clamp-4">
                {ds.description}
              </div>
              <div className="mt-2 text-xs text-[color:var(--muted)]">Atualizado em: {updatedLabel}</div>
            </div>
            <div className="shrink-0 sm:pt-0.5">
              <Link
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                href={`/open-data/${ds.source_id}/${ds.slug}`}
              >
                Ver downloads
              </Link>
            </div>
          </div>
        </li>
      );
    });
  }

  function renderSourcePanels(
    cat: CategoryNode,
    segmentKey: string | null,
    subs: SubCategoryNode[]
  ) {
    return (
      <div className="flex flex-col gap-8">
        {subs.map((sub) => (
          <div key={sub.key}>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">
              <span className="h-px w-4 bg-[color:var(--border)]"></span>
              {sub.title}
            </h3>

            <div className="flex flex-col gap-3">
              {sub.sources.map((src) => {
                const pkey = sourcePanelKey(cat.key, segmentKey, sub.key, src.key);
                const srcOpen = !!openSources[pkey];

                return (
                  <div key={pkey} className="rounded-xl border border-[color:var(--border)]">
                    <button
                      type="button"
                      onClick={() => toggleSource(pkey)}
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
                      <ul className="divide-y divide-[color:var(--border)]">{renderDatasetRows(src.datasets)}</ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-12">
      {tree.map((cat) => {
        const isOpen = !!openCats[cat.key];
        const totalDatasets = countCategoryDatasets(cat);
        const hasContent = cat.segmentGroups.length > 0 || cat.flatSubcategories.length > 0;

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
              <div className="space-y-10 px-5 pb-5">
                {!hasContent ? (
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--muted)]">
                    Nenhum dataset nesta categoria ainda.
                  </div>
                ) : (
                  <>
                    {cat.segmentGroups.map((seg) => (
                      <div key={seg.key} className="space-y-4">
                        <h3 className="border-b border-[color:var(--border)] pb-2 text-sm font-semibold text-[color:var(--text)]">
                          {seg.title}
                        </h3>
                        {renderSourcePanels(cat, seg.key, seg.subcategories)}
                      </div>
                    ))}

                    {cat.flatSubcategories.length > 0 && (
                      <div
                        className={
                          cat.segmentGroups.length > 0
                            ? "border-t border-[color:var(--border)] pt-8"
                            : ""
                        }
                      >
                        {renderSourcePanels(cat, null, cat.flatSubcategories)}
                      </div>
                    )}
                  </>
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
