// src/components/open-data/OpenDataCatalog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { OPEN_DATA_DATASETS } from "@/lib/openData/catalog";
import type { OpenDataManifest } from "@/lib/openData/types";
import { getPublicObjectUrl, withDownload } from "@/lib/openData/publicUrls";

type DatasetState =
  | { status: "idle" | "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; manifest: OpenDataManifest };

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

export default function OpenDataCatalog() {
  const [states, setStates] = useState<Record<string, DatasetState>>(() => {
    const init: Record<string, DatasetState> = {};
    for (const ds of OPEN_DATA_DATASETS) init[ds.id] = { status: "idle" };
    return init;
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      for (const ds of OPEN_DATA_DATASETS) {
        setStates((s) => ({ ...s, [ds.id]: { status: "loading" } }));

        try {
          const url = getPublicObjectUrl(ds.manifest_path);
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} ao buscar manifest`);
          }
          const manifest = (await res.json()) as OpenDataManifest;

          if (!cancelled) {
            setStates((s) => ({ ...s, [ds.id]: { status: "ready", manifest } }));
          }
        } catch (e: any) {
          if (!cancelled) {
            setStates((s) => ({
              ...s,
              [ds.id]: { status: "error", error: e?.message || "Erro ao carregar" },
            }));
          }
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    return OPEN_DATA_DATASETS.map((ds) => {
      const st = states[ds.id];

      return (
        <section
          key={ds.id}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-float)]"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--text)]">{ds.title}</h2>
              <p className="text-sm text-[color:var(--muted)]">{ds.description}</p>
              <a
                className="mt-2 inline-block text-sm text-[color:var(--primary)] underline decoration-transparent hover:decoration-inherit"
                href={ds.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Fonte (CVM)
              </a>
            </div>

            <div className="mt-2 md:mt-0">
              {st?.status === "loading" && (
                <span className="text-sm text-[color:var(--muted)]">Carregando…</span>
              )}
              {st?.status === "error" && (
                <span className="text-sm text-red-600">Erro: {st.error}</span>
              )}
              {st?.status === "ready" && (
                <span className="text-sm text-[color:var(--muted)]">
                  Atualizado em: {new Date(st.manifest.generated_at).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {st?.status === "ready" && (
            <div className="mt-4">
              {st.manifest.meta && (
                <div className="mb-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-medium text-[color:var(--text)]">
                        Dicionário de dados
                      </div>
                      <div className="text-xs text-[color:var(--muted)]">
                        {st.manifest.meta.filename} · {formatBytes(st.manifest.meta.size_bytes)}
                      </div>
                    </div>
                    <a
                      className="inline-flex items-center justify-center rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      href={withDownload(st.manifest.meta.public_url, st.manifest.meta.filename)}
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
                  {st.manifest.items
                    .slice()
                    .sort((a, b) => (a.period < b.period ? 1 : -1))
                    .map((it) => (
                      <li key={`${it.period}-${it.filename}`} className="grid grid-cols-12 px-4 py-3 text-sm">
                        <div className="col-span-3 text-[color:var(--text)]">{it.period}</div>
                        <div className="col-span-6 text-[color:var(--text)]">{it.filename}</div>
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
            </div>
          )}
        </section>
      );
    });
  }, [states]);

  return <div className="flex flex-col gap-6">{cards}</div>;
}
