// src/lib/openData/catalog.ts
//
// Portal does NOT keep a hardcoded catalog. The SSOT is the consolidated
// JSON published by `forest-pipelines publish-catalog` to Supabase Storage
// at `catalog/open_data_catalog.json`. We fetch it server-side and pass the
// resolved list to Client Components via props.

import { fetchJsonFromStorage } from "@/lib/storageFetch";
import type { OpenDataDataset } from "./openDataDataset";

export type { OpenDataDataset } from "./openDataDataset";

export const OPEN_DATA_CATALOG_PATH = "catalog/open_data_catalog.json";

export type OpenDataCatalogEnvelope = {
  schema_version: string;
  catalog_id: "open_data_catalog";
  generated_at: string;
  generation_status: "success" | "success_partial_fallback" | "failed";
  warnings: string[];
  datasets: OpenDataDataset[];
};

/**
 * Fetch the open-data catalog from Supabase Storage (with local public/
 * fallback for offline development). Server-side only.
 */
export async function getOpenDataCatalog(): Promise<OpenDataCatalogEnvelope> {
  return fetchJsonFromStorage<OpenDataCatalogEnvelope>(OPEN_DATA_CATALOG_PATH, {
    label: "open_data_catalog",
  });
}

/** Convenience: only the datasets array. Keeps call-sites tidy. */
export async function getOpenDataDatasets(): Promise<OpenDataDataset[]> {
  const env = await getOpenDataCatalog();
  return env.datasets;
}
