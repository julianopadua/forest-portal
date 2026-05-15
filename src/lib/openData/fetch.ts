import { fetchJsonFromStorage, tryFetchJsonFromStorage } from "@/lib/storageFetch";
import type { OpenDataManifest } from "@/lib/openData/types";

export async function fetchOpenDataManifest(manifestPath: string): Promise<OpenDataManifest> {
  return fetchJsonFromStorage<OpenDataManifest>(manifestPath, { label: "manifest" });
}

export async function tryFetchOpenDataManifest(
  manifestPath: string,
): Promise<OpenDataManifest | null> {
  return tryFetchJsonFromStorage<OpenDataManifest>(manifestPath, { label: "manifest" });
}
