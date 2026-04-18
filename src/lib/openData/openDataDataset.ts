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
};
