// src/lib/openData/anpCatalog.ts

import type { OpenDataItem, OpenDataManifest, OpenDataMeta } from "./types";

/** Path único no bucket público (mesmo arquivo usado pelo catálogo ANP). */
export const ANP_CATALOG_COMPACT_PATH = "anp/catalog/anp_catalog_compact.json";

export type AnpResource = {
  resource_id: string;
  url: string;
  format: string;
  name: string;
  description: string | null;
  kind?: string;
  sources?: string[];
};

export type AnpTheme = {
  id: string;
  slug: string;
  title: string;
};

export type AnpDataset = {
  package_id: string;
  slug: string;
  title: string;
  notes_plain: string;
  source_exported_at?: string;
  themes?: AnpTheme[];
  resources: AnpResource[];
  extra_fields?: Record<string, string>;
};

export type AnpCatalogCompact = {
  schema_version: string;
  generated_at: string;
  source_total_registros: number;
  datasets: AnpDataset[];
};

export function isAnpDatasetSource(sourceId: string): boolean {
  return sourceId === "anp";
}

/**
 * Parse "DD/MM/YYYY HH:mm:ss" ou só data BR → ISO ou null.
 */
export function parseAnpBrDateTime(s: string | undefined): string | null {
  if (!s?.trim()) return null;
  const t = s.trim();
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/.exec(t);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const y = Number(m[3]);
    const hh = m[4] != null ? Number(m[4]) : 12;
    const mm = m[5] != null ? Number(m[5]) : 0;
    const ss = m[6] != null ? Number(m[6]) : 0;
    const dt = new Date(y, mo, d, hh, mm, ss);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }
  const isoTry = new Date(t);
  if (!Number.isNaN(isoTry.getTime())) return isoTry.toISOString();
  return null;
}

function filenameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const seg = path.split("/").filter(Boolean).pop();
    return seg || url;
  } catch {
    return url;
  }
}

/** Coluna "Referência": ano no path ou traço. */
function referencePeriodFromResource(r: AnpResource): string {
  const y = r.url.match(/\/(20\d{2})\//);
  if (y) return y[1];
  const y2 = r.url.match(/(20\d{2})[-_/]/);
  if (y2) return y2[1];
  return "—";
}

function isDataResource(r: AnpResource): boolean {
  if (r.kind === "documentation") return false;
  if (r.kind === "data") return true;
  const fmt = (r.format || "").toUpperCase();
  if (fmt === "PDF") return false;
  if (
    ["CSV", "XLSX", "XLS", "ZIP", "JSON", "XML", "TXT", "SHP", "GEOJSON", "KML", "GPKG"].some((x) =>
      fmt.includes(x)
    )
  ) {
    return true;
  }
  return false;
}

function pickDocumentationPdf(resources: AnpResource[]): AnpResource | null {
  for (const r of resources) {
    if (r.kind === "documentation" && (r.format || "").toUpperCase() === "PDF" && r.url) return r;
  }
  for (const r of resources) {
    if ((r.format || "").toUpperCase() === "PDF" && r.url && /metadad/i.test(r.name || "")) return r;
  }
  return null;
}

export function getGeneratedAtIsoForAnpSlug(
  compact: AnpCatalogCompact,
  slug: string
): string | null {
  const dataset = compact.datasets.find((d) => d.slug === slug);
  if (!dataset) return null;
  return generatedAtForDataset(dataset, compact.generated_at);
}

function generatedAtForDataset(dataset: AnpDataset, rootGeneratedAt: string): string {
  const fromExported = parseAnpBrDateTime(dataset.source_exported_at);
  if (fromExported) return fromExported;
  const ultimaMeta = dataset.extra_fields?.ultima_atualizacao_metadados;
  const fromMeta = parseAnpBrDateTime(ultimaMeta);
  if (fromMeta) return fromMeta;
  const ultimaDados = dataset.extra_fields?.ultima_atualizacao_dados;
  if (ultimaDados?.trim()) {
    const d = new Date(ultimaDados);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  const root = new Date(rootGeneratedAt);
  if (!Number.isNaN(root.getTime())) return root.toISOString();
  return new Date().toISOString();
}

/**
 * Monta um manifest compatível com a UI a partir do JSON compacto e do slug da rota.
 */
export function buildManifestFromAnpDataset(
  compact: AnpCatalogCompact,
  slug: string,
  sourceDatasetUrl: string
): OpenDataManifest | null {
  const dataset = compact.datasets.find((d) => d.slug === slug);
  if (!dataset) return null;

  const generated_at = generatedAtForDataset(dataset, compact.generated_at);
  const sourceUrl = sourceDatasetUrl || `https://dados.gov.br/dados/conjuntos-dados/${slug}`;

  const dataResources = dataset.resources.filter(isDataResource);
  const items: OpenDataItem[] = dataResources.map((r) => {
    const filename = filenameFromUrl(r.url);
    const nm = (r.name || "").trim();
    const period = referencePeriodFromResource(r);

    return {
      kind: "data" as const,
      period,
      filename,
      sha256: "",
      size_bytes: 0,
      storage_path: "",
      public_url: r.url,
      source_url: sourceUrl,
      title: nm || filename,
    };
  });

  let meta: OpenDataMeta | null = null;
  const docPdf = pickDocumentationPdf(dataset.resources);
  if (docPdf?.url) {
    const fn = filenameFromUrl(docPdf.url);
    meta = {
      kind: "metadata",
      filename: fn,
      public_url: docPdf.url,
      source_url: sourceUrl,
    };
  }

  return {
    dataset_id: dataset.package_id,
    title: dataset.title,
    source_dataset_url: sourceUrl,
    generated_at,
    bucket_prefix: "anp",
    items,
    meta,
  };
}
