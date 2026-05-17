// src/lib/storageFetch.ts
//
// Thin, shared helper for fetching JSON artifacts produced by the pipelines
// (manifests, reports, catalogs) from Supabase Storage.
//
// edge-safe: no node builtins, no process.cwd, no fs. callers must set
// NEXT_PUBLIC_SUPABASE_URL.
import { getPublicObjectUrl } from "@/lib/openData/publicUrls";

export type StorageFetchOptions = {
  /** Seconds between revalidations on the remote fetch. Default 3600. */
  revalidateSeconds?: number;
  /** Short label for logs. Default: the relative path. */
  label?: string;
};

/**
 * Fetch a JSON object from Supabase Storage. Throws when
 * `NEXT_PUBLIC_SUPABASE_URL` is unset or the remote fetch fails.
 */
export async function fetchJsonFromStorage<T>(
  relativePath: string,
  options: StorageFetchOptions = {},
): Promise<T> {
  const { revalidateSeconds = 3600, label = relativePath } = options;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!base) {
    throw new Error(
      `[storage] NEXT_PUBLIC_SUPABASE_URL nao definido. Nao foi possivel carregar "${relativePath}".`,
    );
  }

  const url = getPublicObjectUrl(relativePath);
  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: revalidateSeconds } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`[storage] ${label}: fetch falhou (${msg}) para ${url}`);
  }

  if (!res.ok) {
    throw new Error(`[storage] ${label}: HTTP ${res.status} em ${url}`);
  }

  return (await res.json()) as T;
}

/** Try-variant: returns null instead of throwing. */
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
