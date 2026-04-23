// src/lib/openData/types.ts

/** Arquivo de dados individual dentro do manifest. */
export type OpenDataItem = {
  kind: "data";
  period: string;       // "YYYY-MM", "YYYY", "Atual" ou ISO date
  filename: string;
  sha256: string;
  size_bytes: number;
  storage_path?: string;
  public_url: string;
  source_url: string;

  // Campos opcionais para maior detalhamento (ex: EIA)
  title?: string;        // Nome amigável da tabela/arquivo
  release_time?: string; // Horário de publicação (ex: "10:30", "13:00")
};

/** Descritor de arquivo de metadados (ex.: dicionário de dados CVM). */
export type OpenDataMetaFile = {
  filename: string;
  sha256?: string;
  size_bytes?: number;
  storage_path?: string;
  public_url: string;
  source_url?: string;
};

/** Informação de cadência/release emitida por fontes com ciclo conhecido (EIA). */
export type OpenDataMetaRelease = {
  last_release_iso?: string;
  next_release_iso?: string;
  week_ending?: string;
};

/** Envelope estruturado de metadados do dataset (schema 1.0+). */
export type OpenDataMeta = {
  /** Nome do órgão/fonte oficial (ex.: "INPE - Programa Queimadas"). */
  source_agency?: string;
  /** Observações livres sobre o dataset. */
  notes?: string;
  /** Dicionário de dados / manual (apenas quando a fonte publica um arquivo explícito). */
  metadata_file?: OpenDataMetaFile;
  /** Informação de release (próxima publicação, última, semana de referência). */
  release?: OpenDataMetaRelease;
  /** Qualquer dado adicional específico da fonte vai aqui, isolado do contrato estrito. */
  custom_tags?: Record<string, unknown>;
};

/** Status de geração de um manifest. Permite à UI sinalizar falhas parciais. */
export type GenerationStatus = "success" | "success_partial_fallback" | "failed";

/** Estrutura do arquivo manifest.json gerado pelo pipeline (schema 1.0). */
export type OpenDataManifest = {
  schema_version: string;               // "1.0"
  dataset_id: string;
  title: string;
  source_dataset_url: string;
  generated_at: string;                 // ISO 8601
  generation_status: GenerationStatus;
  warnings: string[];
  bucket_prefix: string;
  items: OpenDataItem[];
  meta: OpenDataMeta;
};
