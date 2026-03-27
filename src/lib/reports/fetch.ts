// src/lib/reports/fetch.ts

import { readFile } from "fs/promises";
import path from "path";
import { getPublicObjectUrl } from "@/lib/openData/publicUrls";
import type { ReportDocument, ReportManifest } from "@/lib/reports/types";

async function readLocalJson<T>(relativePath: string): Promise<T | null> {
  const clean = relativePath.replace(/^\/+/, "");
  const fullPath = path.join(process.cwd(), "public", clean);
  try {
    const raw = await readFile(fullPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Tenta o ficheiro público no Storage Supabase; se falhar (rede, 404, env) lê
 * `public/<relativePath>` (útil em dev offline ou quando fetch ao exterior falha).
 */
async function fetchFromStorageOrLocal<T>(relativePath: string, label: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (base) {
    try {
      const url = getPublicObjectUrl(relativePath);
      const res = await fetch(url, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        return (await res.json()) as T;
      }
      console.warn(`[reports] ${label}: Storage respondeu HTTP ${res.status} para ${relativePath}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[reports] ${label}: fetch ao Storage falhou (${msg}). A tentar public/${relativePath.replace(/^\/+/, "")}...`);
    }
  }

  const local = await readLocalJson<T>(relativePath);
  if (local) {
    return local;
  }

  const localHint = `public/${relativePath.replace(/^\/+/, "")}`;
  const remoteHint = base
    ? `${getPublicObjectUrl(relativePath)}`
    : "(defina NEXT_PUBLIC_SUPABASE_URL no .env.local)";

  throw new Error(
    `[reports] Não foi possível carregar "${relativePath}". ` +
      `Remoto: ${remoteHint}. ` +
      `Local: copie o JSON para ${localHint} no projeto (mesmo caminho que no bucket).`,
  );
}

export async function fetchReportManifest(manifestPath: string): Promise<ReportManifest> {
  return fetchFromStorageOrLocal<ReportManifest>(manifestPath, "manifest");
}

export async function fetchStableReport(stableReportPath: string): Promise<ReportDocument> {
  return fetchFromStorageOrLocal<ReportDocument>(stableReportPath, "report");
}
