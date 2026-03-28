// src/lib/news/noticiasAgricolasManifest.ts

/** Caminho estável no bucket de open data (Supabase Storage). */
export const NOTICIAS_AGRICOLAS_MANIFEST_PATH = "news/noticias-agricolas/manifest.json";

export type NoticiasAgricolasSidebarItem = {
  title: string;
  url: string;
  /** Lead se não vazio; senão excerpt (nunca content_text). */
  subtitle: string;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

/**
 * Extrai até `limit` itens válidos do manifest (ordem do array preservada).
 */
export function parseNoticiasAgricolasManifest(
  json: unknown,
  limit = 5,
): NoticiasAgricolasSidebarItem[] {
  if (!isRecord(json)) return [];
  const rawItems = json.items;
  if (!Array.isArray(rawItems)) return [];

  const out: NoticiasAgricolasSidebarItem[] = [];

  for (const entry of rawItems) {
    if (!isRecord(entry)) continue;

    const title = typeof entry.title === "string" ? entry.title.trim() : "";
    const url = typeof entry.url === "string" ? entry.url.trim() : "";
    if (!title || !url) continue;

    const lead = typeof entry.lead === "string" ? entry.lead.trim() : "";
    const excerpt = typeof entry.excerpt === "string" ? entry.excerpt.trim() : "";
    const subtitle = lead || excerpt;

    out.push({ title, url, subtitle });
    if (out.length >= limit) break;
  }

  return out;
}
