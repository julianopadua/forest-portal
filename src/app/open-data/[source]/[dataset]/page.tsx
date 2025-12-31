// src/app/open-data/[source]/[dataset]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPEN_DATA_DATASETS } from "@/lib/openData/catalog";
import type { OpenDataManifest } from "@/lib/openData/types";
import { getPublicObjectUrl, withDownload } from "@/lib/openData/publicUrls";

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

function periodSortKey(period: string) {
  const p = (period || "").trim();

  // "Atual" sempre no topo
  if (p.toLowerCase() === "atual") return Number.POSITIVE_INFINITY;

  // "YYYY-MM"
  const ym = /^(\d{4})-(\d{2})$/.exec(p);
  if (ym) {
    const y = Number(ym[1]);
    const m = Number(ym[2]);
    if (Number.isFinite(y) && Number.isFinite(m)) return y * 12 + m;
  }

  // "YYYY"
  const y = /^(\d{4})$/.exec(p);
  if (y) {
    const yy = Number(y[1]);
    if (Number.isFinite(yy)) return yy * 12;
  }

  // fallback: empurra pro fim
  return Number.NEGATIVE_INFINITY;
}

export default async function OpenDataDatasetPage({
  params,
}: {
  params: Promise<{ source: string; dataset: string }>;
}) {
  const { source, dataset } = await params;

  const ds = OPEN_DATA_DATASETS.find(
    (d) => d.source_id === source && d.slug === dataset
  );

  if (!ds) notFound();

  const url = getPublicObjectUrl(ds.manifest_path);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao buscar manifest (${ds.id})`);
  }

  const manifest = (await res.json()) as OpenDataManifest;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <div className="text-sm text-[color:var(--muted)]">
          {ds.category_title} · {ds.source_title}
        </div>

        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">
          {ds.title}
        </h1>

        <p className="mt-2 text-[color:var(--muted)]">{ds.description}</p>

        <a
          className="mt-3 inline-block text-sm text-[color:var(--primary)] underline decoration-transparent hover:decoration-inherit"
          href={ds.source_url}
          target="_blank"
          rel="noreferrer"
        >
          Fonte oficial
        </a>

        <div className="mt-3 text-sm text-[color:var(--muted)]">
          Atualizado em:{" "}
          {new Date(manifest.generated_at).toLocaleString("pt-BR")}
        </div>
      </header>

      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-float)]">
        {manifest.meta && (
          <div className="mb-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium text-[color:var(--text)]">
                  Dicionário de dados
                </div>
                <div className="text-xs text-[color:var(--muted)]">
                  {manifest.meta.filename} ·{" "}
                  {formatBytes(manifest.meta.size_bytes)}
                </div>
              </div>

              <a
                className="inline-flex items-center justify-center rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                href={withDownload(
                  manifest.meta.public_url,
                  manifest.meta.filename
                )}
                target="_blank"
                rel="noreferrer"
              >
                Baixar
              </a>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
          <div className="grid grid-cols-12 bg-[color:var(--surface-2)] px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
            <div className="col-span-3">Período</div>
            <div className="col-span-6">Arquivo</div>
            <div className="col-span-2 text-right">Tamanho</div>
            <div className="col-span-1 text-right"> </div>
          </div>

          <ul className="divide-y divide-[color:var(--border)]">
            {manifest.items
              .slice()
              .sort((a, b) => periodSortKey(b.period) - periodSortKey(a.period))
              .map((it) => (
                <li
                  key={`${it.period}-${it.filename}`}
                  className="grid grid-cols-12 px-4 py-3 text-sm"
                >
                  <div className="col-span-3 text-[color:var(--text)]">
                    {it.period}
                  </div>
                  <div className="col-span-6 text-[color:var(--text)]">
                    {it.filename}
                  </div>
                  <div className="col-span-2 text-right text-[color:var(--muted)]">
                    {formatBytes(it.size_bytes)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <a
                      className="rounded-lg px-3 py-1 text-sm font-medium text-[color:var(--primary)] hover:bg-[color:var(--surface-2)]"
                      href={withDownload(it.public_url, it.filename)}
                      target="_blank"
                      rel="noreferrer"
                      title="Baixar"
                    >
                      ↓
                    </a>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
