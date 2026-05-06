// src/lib/openData/openDataDataset.ts

export type OpenDataDataset = {
  id: string;

  category_title: string;
  /** Agrupa subcategorias sob um título único (ex.: Mercado de commodities → Energia). */
  segment_title?: string;
  subcategory_title: string;
  source_id: string;
  source_title: string;
  slug: string;

  title: string;
  description: string;

  manifest_path: string;
  source_url: string;

  /**
   * ISO 8601. Optional (catalog schema 1.1+). Pre-resolved by the catalog
   * publisher so the portal can render the listing without per-manifest
   * fetches in Client Components.
   */
  generated_at?: string;
  /** ISO 8601. Optional. Mirrors manifest.meta.release.last_release_iso. */
  last_release_iso?: string;
};
