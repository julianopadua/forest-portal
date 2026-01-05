import Link from "next/link";
import { notFound } from "next/navigation";
import { OPEN_DATA_DATASETS } from "@/lib/openData/catalog";
import type { OpenDataManifest } from "@/lib/openData/types";
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

function itemSortKey(item: any) {
  const p = (item.period || "").trim();
  if (p.toLowerCase() === "atual") return Number.POSITIVE_INFINITY;
  const isoMatch = /^(\d{4})-(\d{2})(-(\d{2}))?$/.exec(p);
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = isoMatch[4] ? Number(isoMatch[4]) : 0;
    return y * 400 + m * 32 + d;
  }
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
  const ds = OPEN_DATA_DATASETS.find((d) => d.source_id === source && d.slug === dataset);

  if (!ds) notFound();

  const url = getPublicObjectUrl(ds.manifest_path);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar manifest (${ds.id})`);

  const manifest = (await res.json()) as OpenDataManifest;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <div className="mb-6">
          <Link href="/open-data" className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            Voltar para o catálogo
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <div className="text-xs font-bold text-[color:var(--primary)] uppercase tracking-widest mb-2">
              {ds.category_title} <span className="mx-1 opacity-30">/</span> {ds.subcategory_title}
            </div>
            <h1 className="text-3xl font-extrabold text-[color:var(--text)] tracking-tight">{ds.title}</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)] leading-relaxed">{ds.description}</p>
          </div>

          <div className="shrink-0">
            <DownloadAllButton urls={manifest.items.map(it => ({ url: it.public_url, name: it.filename }))} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[color:var(--muted)] border-t border-[color:var(--border)] pt-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[color:var(--text)]">Varredura:</span>
            {new Date(manifest.generated_at).toLocaleString("pt-BR")}
          </div>

          <a href={ds.source_url} target="_blank" rel="noreferrer" className="hover:text-[color:var(--text)] underline decoration-[color:var(--border)] underline-offset-4">
            Fonte Oficial ({ds.source_title})
          </a>

          {manifest.meta?.filename && (
            <a href={withDownload(manifest.meta.public_url, manifest.meta.filename)} className="flex items-center gap-1.5 font-medium text-[color:var(--primary)] hover:underline">
              Dicionário de Dados
            </a>
          )}

          {manifest.meta?.last_release_iso && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--surface-2)] border border-[color:var(--border)] text-[color:var(--text)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Último release: {new Date(manifest.meta.last_release_iso).toLocaleDateString("pt-BR")}
            </div>
          )}
        </div>
      </header>

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
            .sort((a, b) => itemSortKey(b) - itemSortKey(a))
            .map((it) => (
              <li key={`${it.period}-${it.filename}`} className="grid grid-cols-12 px-6 py-4 text-sm items-center hover:bg-[color:var(--surface-2)]/40 transition-colors group">
                <div className="col-span-3 font-medium text-[color:var(--text)]">{it.period}</div>
                <div className="col-span-6 truncate pr-4">
                  <div className="text-[color:var(--text)] font-medium truncate group-hover:text-[color:var(--primary)] transition-colors">{it.title || it.filename}</div>
                  <div className="text-[10px] text-[color:var(--muted)] font-mono mt-0.5 opacity-50">{it.filename}</div>
                </div>
                <div className="col-span-2 text-right text-[color:var(--muted)] font-mono text-xs">{formatBytes(it.size_bytes)}</div>
                <div className="col-span-1 flex justify-end">
                  <a className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-white transition-all" href={withDownload(it.public_url, it.filename)} target="_blank" rel="noreferrer">
                    ↓
                  </a>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}