import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";

import { registry, z, API_VERSION } from "./registry";
import {
  CatalogResponse,
  DatasetItemsResponse,
  DatasetResponse,
  HealthBody,
  ProblemDetails,
  ReportResponse,
  ReportsCatalogResponse,
  SourcesResponse,
} from "./schemas";

const PATH_PREFIX = `/api/${API_VERSION}`;

export function buildOpenApiDocument() {
  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/health`,
    summary: "Service health",
    description:
      "Returns service status, API version, and the manifest schema version this " +
      "deployment understands. Use as a low-cost reachability and version probe.",
    responses: {
      200: {
        description: "Service is reachable.",
        content: { "application/json": { schema: HealthBody } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/catalog`,
    summary: "List datasets",
    description:
      "Compact list of all open-data datasets. Each entry exposes the identifier, slug, " +
      "source, category, and the storage path of the full manifest.",
    responses: {
      200: {
        description: "Catalog payload.",
        content: { "application/json": { schema: CatalogResponse } },
      },
      503: {
        description: "Upstream catalog unavailable.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/catalog/reports`,
    summary: "List reports",
    description: "Compact list of all published analytical reports.",
    responses: {
      200: {
        description: "Reports catalog payload.",
        content: { "application/json": { schema: ReportsCatalogResponse } },
      },
      503: {
        description: "Upstream catalog unavailable.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/datasets/{id}`,
    summary: "Get dataset manifest",
    description:
      "Full dataset manifest envelope (schema 1.0). The `{id}` path parameter accepts " +
      "either the dataset identifier (e.g., `inpe_bdqueimadas_focos`) or the slug.",
    request: {
      params: z.object({
        id: z.string().openapi({ description: "Dataset id or slug." }),
      }),
    },
    responses: {
      200: {
        description: "Dataset manifest payload.",
        content: { "application/json": { schema: DatasetResponse } },
      },
      404: {
        description: "Unknown dataset id or slug.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
      503: {
        description: "Upstream catalog unavailable.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/datasets/{id}/items`,
    summary: "Get dataset items",
    description:
      "Returns only the `items[]` array of the dataset manifest. Suitable for clients " +
      "that need download URLs but not full metadata.",
    request: {
      params: z.object({
        id: z.string().openapi({ description: "Dataset id or slug." }),
      }),
    },
    responses: {
      200: {
        description: "Item array payload.",
        content: { "application/json": { schema: DatasetItemsResponse } },
      },
      404: {
        description: "Unknown dataset id or slug.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
      503: {
        description: "Upstream catalog unavailable.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/reports/{id}`,
    summary: "Get report manifest",
    description: "Full report manifest envelope (schema 1.0).",
    request: {
      params: z.object({
        id: z.string().openapi({ description: "Report id or slug." }),
      }),
    },
    responses: {
      200: {
        description: "Report manifest payload.",
        content: { "application/json": { schema: ReportResponse } },
      },
      404: {
        description: "Unknown report id or slug.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
      503: {
        description: "Upstream catalog unavailable.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: `${PATH_PREFIX}/sources`,
    summary: "List source agencies",
    description:
      "Distinct source agencies derived from the catalog, with dataset counts per source. " +
      "Useful for faceted browsing.",
    responses: {
      200: {
        description: "Source facet payload.",
        content: { "application/json": { schema: SourcesResponse } },
      },
      503: {
        description: "Upstream catalog unavailable.",
        content: { "application/problem+json": { schema: ProblemDetails } },
      },
    },
  });

  const generator = new OpenApiGeneratorV31([...registry.definitions]);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Forest Open Data API",
      version: API_VERSION,
      description:
        "Public, read-only HTTP API for the Instituto Forest open-data catalog. Returns " +
        "JSON manifests pointing at file artifacts hosted on Supabase Storage. The API is " +
        "intentionally thin: it serves metadata; actual file bytes are downloaded directly " +
        "from the `public_url` fields it exposes.",
      contact: { name: "Instituto Forest", url: "https://institutoforest.org" },
    },
    servers: [{ url: "https://institutoforest.org" }],
  });
}
