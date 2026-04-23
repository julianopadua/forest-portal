// src/lib/storageFetch.ts
//
// Thin, shared helper for fetching JSON artifacts produced by the pipelines
// (manifests, reports, catalogs) from Supabase Storage, with a local
// public/<path> fallback for offline development.
//
// Not a business-logic module — callers wrap it with typed signatures.
import { readFile } from "fs/promises";
import path from "path";

import { getPublicObjectUrl } from "@/lib/openData/publicUrls";

export type StorageFetchOptions = {
  /** Seconds between revalidations on the remote fetch. Default 3600. */
  revalidateSeconds?: number;
  /** Short label for logs. Default: the relative path. */
  label?: string;
};

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
 * Fetch a JSON object from Supabase Storage, falling back to
 * `public/<relativePath>` when the network fetch fails (offline dev, 404).
 * Throws only when both sources fail.
 */
export async function fetchJsonFromStorage<T>(
  relativePath: string,
  options: StorageFetchOptions = {},
): Promise<T> {
  const { revalidateSeconds = 3600, label = relativePath } = options;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (base) {
    try {
      const url = getPublicObjectUrl(relativePath);
      const res = await fetch(url, { next: { revalidate: revalidateSeconds } });
      if (res.ok) {
        return (await res.json()) as T;
      }
      console.warn(`[storage] ${label}: HTTP ${res.status} em ${relativePath}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[storage] ${label}: fetch falhou (${msg}); tentando public/${relativePath.replace(/^\/+/, "")}`);
    }
  }

  const local = await readLocalJson<T>(relativePath);
  if (local) return local;

  const localHint = `public/${relativePath.replace(/^\/+/, "")}`;
  const remoteHint = base
    ? getPublicObjectUrl(relativePath)
    : "(defina NEXT_PUBLIC_SUPABASE_URL em .env.local)";
  throw new Error(
    `[storage] Não foi possível carregar "${relativePath}". Remoto: ${remoteHint}. Local: copie o JSON para ${localHint}.`,
  );
}

/** Try-variant: returns null if neither remote nor local source produces the file. */
export async function tryFetchJsonFromStorage<T>(
  relativePath: string,
  options: StorageFetchOptions = {},
): Promise<T | null> {
  try {
    return await fetchJsonFromStorage<T>(relativePath, options);
  } catch {
    return null;
  }
}
