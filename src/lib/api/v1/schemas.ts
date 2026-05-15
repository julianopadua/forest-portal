import { registry, z } from "./registry";

export const GenerationStatus = z
  .enum(["success", "success_partial_fallback", "failed"])
  .openapi({
    description:
      "Outcome of the upstream pipeline run that produced the artifact. " +
      "`success_partial_fallback` indicates the artifact is internally consistent " +
      "but does not include 100% of the expected items.",
  });

export const Warnings = z
  .array(z.string())
  .openapi({
    description: "Human-readable warnings surfaced by the upstream pipeline.",
    example: [],
  });

export const EnvelopeBase = z.object({
  schema_version: z.string().openapi({ example: "1.0" }),
  generated_at: z
    .string()
    .openapi({ description: "ISO 8601 timestamp (UTC).", example: "2026-04-23T12:00:00Z" }),
  generation_status: GenerationStatus,
  warnings: Warnings,
});

export const DatasetSummary = registry.register(
  "DatasetSummary",
  z
    .object({
      id: z.string().openapi({ example: "inpe_bdqueimadas_focos" }),
      slug: z.string().openapi({ example: "focos-bdqueimadas" }),
      title: z.string().openapi({ example: "INPE - BDQueimadas - Focos Brasil" }),
      description: z.string(),
      source_id: z.string().openapi({ example: "inpe" }),
      source_title: z.string().openapi({ example: "Instituto Nacional de Pesquisas Espaciais" }),
      category_title: z.string(),
      subcategory_title: z.string(),
      segment_title: z.string().optional(),
      source_url: z.string().url(),
      manifest_path: z
        .string()
        .openapi({
          description: "Storage path of the dataset manifest, relative to the bucket.",
          example: "inpe/bdqueimadas/focos_br_ref/manifest.json",
        }),
      generated_at: z.string().optional(),
      last_release_iso: z.string().optional(),
    })
    .openapi("DatasetSummary"),
);

export const ReportSummary = registry.register(
  "ReportSummary",
  z
    .object({
      id: z.string(),
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      source_title: z.string(),
      category_title: z.string(),
      manifest_path: z.string(),
      stable_report_path: z.string(),
      tags: z.array(z.string()),
      source_dataset_url: z.string().url().optional(),
    })
    .openapi("ReportSummary"),
);

export const OpenDataItem = registry.register(
  "OpenDataItem",
  z
    .object({
      kind: z.literal("data"),
      period: z
        .string()
        .openapi({ description: "Time partition: YYYY, YYYY-MM, ISO date, or 'Atual'." }),
      filename: z.string(),
      sha256: z.string().openapi({ description: "Hex sha256 of the file." }),
      size_bytes: z.number().int().nonnegative(),
      storage_path: z.string().optional(),
      public_url: z.string().url(),
      source_url: z.string().url(),
      title: z.string().optional(),
      release_time: z.string().optional(),
    })
    .openapi("OpenDataItem"),
);

export const DatasetMetaFile = z
  .object({
    filename: z.string(),
    sha256: z.string().optional(),
    size_bytes: z.number().int().nonnegative().optional(),
    storage_path: z.string().optional(),
    public_url: z.string().url(),
    source_url: z.string().url().optional(),
  })
  .openapi("DatasetMetaFile");

export const DatasetMetaRelease = z
  .object({
    last_release_iso: z.string().optional(),
    next_release_iso: z.string().optional(),
    week_ending: z.string().optional(),
  })
  .openapi("DatasetMetaRelease");

export const DatasetMeta = registry.register(
  "DatasetMeta",
  z
    .object({
      source_agency: z.string().optional(),
      notes: z.string().optional(),
      metadata_file: DatasetMetaFile.optional(),
      release: DatasetMetaRelease.optional(),
      custom_tags: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi({
      description:
        "Strict metadata envelope. Free-form fields go under `custom_tags`; " +
        "no other top-level keys are emitted.",
    }),
);

export const DatasetManifest = registry.register(
  "DatasetManifest",
  EnvelopeBase.extend({
    dataset_id: z.string(),
    title: z.string(),
    source_dataset_url: z.string().url(),
    bucket_prefix: z.string(),
    items: z.array(OpenDataItem),
    meta: DatasetMeta,
  }).openapi("DatasetManifest"),
);

export const ReportManifest = registry.register(
  "ReportManifest",
  EnvelopeBase.extend({
    report_id: z.string(),
    title: z.union([
      z.string(),
      z.object({ pt: z.string(), en: z.string() }),
    ]),
    bucket_prefix: z.string(),
    paths: z.record(z.string(), z.string()),
    public_urls: z.record(z.string(), z.string()),
    meta: z.object({
      source_label: z
        .union([z.string(), z.object({ pt: z.string(), en: z.string() })])
        .optional(),
      dataset_id: z.string().optional(),
      first_year: z.number().int().nullable().optional(),
      latest_year: z.number().int().nullable().optional(),
      year_range: z.string().nullable().optional(),
      latest_period: z.string().nullable().optional(),
      llm_enabled: z.boolean().optional(),
      available_locales: z.array(z.enum(["pt", "en"])).optional(),
      default_locale: z.enum(["pt", "en"]).optional(),
      available_biomes: z.array(z.string()).optional(),
      custom_tags: z.record(z.string(), z.unknown()).optional(),
    }),
  }).openapi("ReportManifest"),
);

export const SourceFacet = registry.register(
  "SourceFacet",
  z
    .object({
      source_id: z.string().openapi({ example: "inpe" }),
      source_title: z.string().openapi({ example: "Instituto Nacional de Pesquisas Espaciais" }),
      dataset_count: z.number().int().nonnegative(),
    })
    .openapi("SourceFacet"),
);

export const HealthBody = registry.register(
  "Health",
  z
    .object({
      status: z.literal("ok"),
      api_version: z.string(),
      schema_version: z.string(),
      generated_at: z.string(),
    })
    .openapi("Health"),
);

const responseEnvelope = <T extends z.ZodTypeAny>(payload: T, payloadKey: string) =>
  EnvelopeBase.extend({ [payloadKey]: payload }).openapi(`Response_${payloadKey}`);

export const CatalogResponse = responseEnvelope(z.array(DatasetSummary), "datasets");
export const ReportsCatalogResponse = responseEnvelope(z.array(ReportSummary), "reports");
export const DatasetResponse = responseEnvelope(DatasetManifest, "manifest");
export const DatasetItemsResponse = responseEnvelope(z.array(OpenDataItem), "items");
export const ReportResponse = responseEnvelope(ReportManifest, "manifest");
export const SourcesResponse = responseEnvelope(z.array(SourceFacet), "sources");

export const ProblemDetails = registry.register(
  "ProblemDetails",
  z
    .object({
      type: z.string().url().openapi({ example: "https://institutoforest.org/api/errors/not-found" }),
      title: z.string(),
      status: z.number().int(),
      detail: z.string().optional(),
      instance: z.string().optional(),
    })
    .openapi("ProblemDetails"),
);

export type DatasetSummaryT = z.infer<typeof DatasetSummary>;
export type ReportSummaryT = z.infer<typeof ReportSummary>;
export type DatasetManifestT = z.infer<typeof DatasetManifest>;
export type ReportManifestT = z.infer<typeof ReportManifest>;
export type SourceFacetT = z.infer<typeof SourceFacet>;
