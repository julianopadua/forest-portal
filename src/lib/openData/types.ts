// src/lib/openData/types.ts
export type OpenDataItem = {
  kind: "data";
  period: string; // "YYYY-MM" | "YYYY" | "Atual" (depende do dataset)
  filename: string;
  sha256: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  source_url: string;
};

export type OpenDataMeta = {
  kind: "meta";
  filename: string;
  sha256: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  source_url: string;
};

export type OpenDataManifest = {
  dataset_id: string;
  title: string;
  source_dataset_url: string;
  generated_at: string; // ISO
  bucket_prefix: string;
  items: OpenDataItem[];
  meta: OpenDataMeta | null;
};
