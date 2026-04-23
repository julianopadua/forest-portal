// src/app/open-data/[source]/[dataset]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpenDataDatasets } from "@/lib/openData/catalog";
import {
  ANP_CATALOG_COMPACT_PATH,
  buildManifestFromAnpDataset,
  isAnpDatasetSource,
  type AnpCatalogCompact,
} from "@/lib/openData/anpCatalog";
import type { OpenDataItem, OpenDataManifest } from "@/lib/openData/types";
import { getPublicObjectUrl, withDownload } from "@/lib/openData/publicUrls";
import { DownloadAllButton } from "@/components/open-data/DownloadAllButton";

function formatBytes(n: number) {
  if (!Number.isFinite(n)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

/**
 * Lógica de ordenação robusta para períodos.
 * Suporta "Atual", datas ISO (YYYY-MM-DD), meses (YYYY-MM) e anos (YYYY).
 */
function itemSortKey(item: OpenDataItem) {
  const p = (item.period || "").trim();
  if (p.toLowerCase() === "atual") return Number.POSITIVE_INFINITY;

  // Tenta capturar YYYY-MM-DD ou YYYY-MM
  const isoMatch = /^(\d{4})-(\d{2})(-(\d{2}))?$/.exec(p);
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = isoMatch[4] ? Number(isoMatch[4]) : 0;
    return y * 400 + m * 32 + d;
  }

  // Tenta capturar apenas o Ano
  const yMatch = /^(\d{4})$/.exec(p);
  if (yMatch) return Number(yMatch[1]) * 400;

  return Number.NEGATIVE_INFINITY;
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default async function OpenDataDatasetPage({
  params,
}: {
  params: Promise<{ source: string; dataset: string }>;
}) {
  const { source, dataset } = await params;
  const datasets = await getOpenDataDatasets();
  const ds = datasets.find((d) => d.source_id === source && d.slug === dataset);

  if (!ds) notFound();

  let manifest: OpenDataManifest;

  if (isAnpDatasetSource(ds.source_id)) {
    const compactUrl = getPublicObjectUrl(ANP_CATALOG_COMPACT_PATH);
    const res = await fetch(compactUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar catálogo ANP (${ds.id})`);
    const compact = (await res.json()) as AnpCatalogCompact;
    const built = buildManifestFromAnpDataset(compact, ds.slug, ds.source_url);
    if (!built) notFound();
    manifest = built;
  } else {
    const url = getPublicObjectUrl(ds.manifest_path);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar manifest (${ds.id})`);
    manifest = (await res.json()) as OpenDataManifest;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-10">
        <div className="mb-6">
          <Link 
            href="/open-data" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Voltar para o catálogo
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="text-[10px] font-black text-[color:var(--primary)] uppercase tracking-[0.2em] mb-2">
              {ds.category_title} / {ds.subcategory_title}
            </div>
            <h1 className="text-4xl font-black text-[color:var(--foreground)] tracking-tight">{ds.title}</h1>
            <p className="mt-3 max-w-2xl text-base text-[color:var(--muted)] leading-relaxed">{ds.description}</p>
          </div>

          <div className="shrink-0 pt-2">
            <DownloadAllButton urls={manifest.items.map(it => ({ url: it.public_url, name: it.filename }))} />
          </div>
        </div>

        {/* Faixa de Informações: Generalizável e Enxuta */}
        <div className="mt-8 flex flex-wrap items-center gap-y-3 gap-x-8 text-[11px] font-bold text-[color:var(--muted)] uppercase tracking-wider border-t border-[color:var(--border)] pt-6">
          <div className="flex items-center gap-2">
            <span className="opacity-50">Varredura:</span>
            <span className="text-[color:var(--foreground)]">{new Date(manifest.generated_at).toLocaleDateString("pt-BR")}</span>
          </div>

          <a 
            href={ds.source_url} 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[color:var(--primary)] transition-colors border-b border-transparent hover:border-[color:var(--primary)]"
          >
            Fonte Oficial ({ds.source_title})
          </a>

          {/* Dicionário: usa meta.metadata_file (schema 1.0). */}
          {manifest.meta?.metadata_file?.filename && manifest.meta?.metadata_file?.public_url && (
            <a
              href={withDownload(manifest.meta.metadata_file.public_url, manifest.meta.metadata_file.filename)}
              className="text-[color:var(--primary)] hover:opacity-80"
            >
              Dicionário de Dados
            </a>
          )}

          {/* Release: usa meta.release (schema 1.0). */}
          {manifest.meta?.release?.last_release_iso && (
            <div className="flex items-center gap-2 text-[color:var(--success)]">
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              Último release: {new Date(manifest.meta.release.last_release_iso).toLocaleDateString("pt-BR")}
            </div>
          )}
        </div>
      </header>

      {/* Tabela de Arquivos */}
      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-[color:var(--surface-2)] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)] border-b border-[color:var(--border)]">
          <div className="col-span-3">Referência</div>
          <div className="col-span-6">Arquivo</div>
          <div className="col-span-2 text-right">Tamanho</div>
          <div className="col-span-1"></div>
        </div>

        <ul className="divide-y divide-[color:var(--border)]">
          {manifest.items
            .slice()
            .sort((a, b) => {
              const d = itemSortKey(b) - itemSortKey(a);
              if (d !== 0) return d;
              return (a.title || a.filename).localeCompare(b.title || b.filename, "pt-BR");
            })
            .map((it) => (
              <li key={it.public_url} className="grid grid-cols-12 px-6 py-4 text-sm items-center hover:bg-[color:var(--surface-2)]/40 transition-colors group">
                <div className="col-span-3 font-medium text-[color:var(--text)]">
                  {it.period}
                </div>
                
                <div className="col-span-6 truncate pr-4">
                  <div className="text-[color:var(--text)] font-medium truncate group-hover:text-[color:var(--primary)] transition-colors">
                    {it.title || it.filename}
                  </div>
                  <div className="text-[10px] text-[color:var(--muted)] font-mono mt-0.5 opacity-50">
                    {it.filename}
                  </div>
                </div>

                <div className="col-span-2 text-right text-[color:var(--muted)] font-mono text-xs">
                  {formatBytes(it.size_bytes)}
                </div>

                <div className="col-span-1 flex justify-end">
                  <a 
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-white transition-all" 
                    href={withDownload(it.public_url, it.filename)} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 11.75L12 16.25m0 0l4.5-4.5M12 16.25V3" />
                    </svg>
                  </a>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}