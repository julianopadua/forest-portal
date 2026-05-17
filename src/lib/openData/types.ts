//src/lib/openData/types.ts

export type OpenDataProfileStatus = "ok" | "partial" | "failed" | "skipped";

export type OpenDataProfileWarning = {
  code: string;
  message: string;
};

export type OpenDataArchiveMemberProfile = {
  filename: string;
  size_bytes?: number;
  format?: string;
  row_count?: number | null;
  column_count?: number | null;
  columns?: string[] | null;
  profile_status?: OpenDataProfileStatus;
  profile_warnings?: OpenDataProfileWarning[];
};

export type OpenDataArchiveProfile = {
  member_count: number;
  members: string[];
  uncompressed_size_bytes?: number;
  tabular_members?: OpenDataArchiveMemberProfile[];
};

/** Arquivo de dados individual dentro do manifest. */
export type OpenDataItem = {
  kind: "data";
  /** "YYYY-MM", "YYYY", "Atual", or ISO date. */
  period: string;
  filename: string;
  source_url: string;
  sha256?: string;
  size_bytes?: number;
  row_count?: number;
  column_count?: number;
  columns?: string[];
  content_type?: string | null;
  format?: string;
  last_modified?: string | null;
  profiled_at?: string;
  profile_status?: OpenDataProfileStatus;
  profile_warnings?: OpenDataProfileWarning[];
  archive_profile?: OpenDataArchiveProfile;

  /** Nome amigavel da tabela ou arquivo. */
  title?: string;
  /** Horario de publicacao, por exemplo "10:30" ou "13:00". */
  release_time?: string;
  source_page_url?: string;
};

/** Descritor de arquivo de metadados (ex.: dicionário de dados CVM). */
export type OpenDataMetaFile = {
  filename: string;
  sha256?: string;
  size_bytes?: number;
  source_url: string;
  row_count?: number;
  column_count?: number;
  columns?: string[];
  content_type?: string | null;
  format?: string;
  last_modified?: string | null;
  profiled_at?: string;
  profile_status?: OpenDataProfileStatus;
  profile_warnings?: OpenDataProfileWarning[];
  archive_profile?: OpenDataArchiveProfile;
};

/** Informação de cadência/release emitida por fontes com ciclo conhecido (EIA). */
export type OpenDataMetaRelease = {
  last_release_iso?: string;
  next_release_iso?: string;
  week_ending?: string;
};

/** Envelope estruturado de metadados do dataset (schema 2.0+). */
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

/** Estrutura do arquivo manifest.json gerado pelo pipeline (schema 2.0). */
export type OpenDataManifest = {
  /** "2.0". */
  schema_version: string;
  dataset_id: string;
  title: string;
  source_dataset_url: string;
  /** ISO 8601. */
  generated_at: string;
  generation_status: GenerationStatus;
  warnings: string[];
  bucket_prefix: string;
  items: OpenDataItem[];
  meta: OpenDataMeta;
};
