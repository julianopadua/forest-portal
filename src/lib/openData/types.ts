// src/lib/openData/types.ts

/**
 * Representa um arquivo de dados individual dentro do dataset.
 */
export type OpenDataItem = {
  kind: "data";
  period: string;       // "YYYY-MM", "YYYY", "Atual" ou data ISO
  filename: string;
  sha256: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  source_url: string;
  
  // Campos opcionais para maior detalhamento (ex: EIA)
  title?: string;        // Nome amigável da tabela/arquivo
  release_time?: string; // Horário de publicação (ex: "10:30", "13:00")
};

/**
 * Metadados globais do dataset. 
 * Pode ser um arquivo físico (Dicionário) ou apenas informações de texto (Release dates).
 */
export type OpenDataMeta = {
  kind: "meta" | "metadata";
  
  // Campos para quando o meta é um arquivo (Dicionário de dados)
  filename?: string;
  sha256?: string;
  size_bytes?: number;
  storage_path?: string;
  public_url?: string;
  source_url?: string;

  // Campos para informações de release (EIA e futuros)
  last_release_iso?: string;
  next_release_iso?: string;
  week_ending?: string;

  // Assinatura de índice para permitir qualquer campo extra sem erro de TS
  [key: string]: any;
};

/**
 * Estrutura do arquivo manifest.json gerado pelos scrapers.
 */
export type OpenDataManifest = {
  dataset_id: string;
  title: string;
  source_dataset_url: string;
  generated_at: string; // ISO8601
  bucket_prefix: string;
  items: OpenDataItem[];
  meta: OpenDataMeta | null;
};