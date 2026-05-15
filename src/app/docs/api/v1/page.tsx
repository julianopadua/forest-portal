import type { Metadata } from "next";

import DocsLayout from "@/components/docs/DocsLayout";
import EndpointBlock from "@/components/docs/EndpointBlock";

export const metadata: Metadata = {
  title: "Open Data API v1 - Forest",
  description:
    "Public, read-only HTTP API for the Instituto Forest open-data catalog.",
};

const sections = [
  {
    title: "Open Data API v1",
    items: [
      { href: "#overview", label: "Overview" },
      { href: "#authentication", label: "Authentication" },
      { href: "#versioning", label: "Versioning" },
      { href: "#caching", label: "Caching" },
      { href: "#errors", label: "Errors" },
      { href: "#openapi", label: "OpenAPI specification" },
    ],
  },
  {
    title: "Endpoints",
    items: [
      { href: "#health", label: "GET /health" },
      { href: "#catalog", label: "GET /catalog" },
      { href: "#catalog-reports", label: "GET /catalog/reports" },
      { href: "#datasets-id", label: "GET /datasets/{id}" },
      { href: "#datasets-id-items", label: "GET /datasets/{id}/items" },
      { href: "#reports-id", label: "GET /reports/{id}" },
      { href: "#sources", label: "GET /sources" },
    ],
  },
  {
    title: "SDK",
    items: [{ href: "#sdk-python", label: "Python SDK" }],
  },
];

const BASE = "https://institutoforest.org/api/v1";

const CATALOG_RESPONSE_EXAMPLE = `{
  "schema_version": "1.0",
  "api_version": "v1",
  "generated_at": "2026-04-23T12:00:00Z",
  "generation_status": "success",
  "warnings": [],
  "datasets": [
    {
      "id": "inpe_bdqueimadas_focos",
      "slug": "focos-bdqueimadas",
      "title": "INPE - BDQueimadas - Focos Brasil",
      "source_id": "inpe",
      "source_title": "Instituto Nacional de Pesquisas Espaciais",
      "category_title": "Meio ambiente",
      "subcategory_title": "Queimadas",
      "manifest_path": "inpe/bdqueimadas/focos_br_ref/manifest.json",
      "source_url": "https://terrabrasilis.dpi.inpe.br/queimadas/portal/",
      "generated_at": "2026-04-22T03:11:09Z",
      "last_release_iso": "2026-04-22T00:00:00Z"
    }
  ]
}`;

const DATASET_RESPONSE_EXAMPLE = `{
  "schema_version": "1.0",
  "api_version": "v1",
  "generated_at": "2026-04-22T03:11:09Z",
  "generation_status": "success",
  "warnings": [],
  "manifest": {
    "schema_version": "1.0",
    "dataset_id": "inpe_bdqueimadas_focos",
    "title": "INPE - BDQueimadas - Focos Brasil",
    "source_dataset_url": "https://terrabrasilis.dpi.inpe.br/queimadas/portal/",
    "generated_at": "2026-04-22T03:11:09Z",
    "generation_status": "success",
    "warnings": [],
    "bucket_prefix": "inpe/bdqueimadas/focos_br_ref",
    "items": [
      {
        "kind": "data",
        "period": "2024",
        "filename": "focos_2024.zip",
        "sha256": "...",
        "size_bytes": 1234567,
        "public_url": "https://<project>.supabase.co/storage/v1/object/public/open-data/inpe/bdqueimadas/focos_br_ref/focos_2024.zip",
        "source_url": "https://..."
      }
    ],
    "meta": {
      "source_agency": "INPE - Programa Queimadas",
      "release": { "last_release_iso": "2026-04-22T00:00:00Z" },
      "custom_tags": { "total_years": 25 }
    }
  }
}`;

const PROBLEM_EXAMPLE = `{
  "type": "https://institutoforest.org/api/errors/not-found",
  "title": "Resource not found",
  "status": 404,
  "detail": "No dataset with id or slug \\"inpe_unknown\\"."
}`;

export default function ApiDocsPage() {
  return (
    <DocsLayout sections={sections}>
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
          API Reference
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
          Forest Open Data API
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[color:var(--muted)]">
          A public, read-only HTTP API over the Instituto Forest open-data catalog. Exposes the
          dataset and report manifests already published by the platform pipelines and points
          callers at the underlying file artifacts hosted on Supabase Storage.
        </p>
      </header>

      <section id="overview" className="mt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">Overview</h2>
        <p className="mt-3 leading-relaxed">
          The API serves metadata only. Returned manifests carry <code>public_url</code> fields
          that point directly at file objects on Supabase Storage; clients fetch those bytes from
          the storage CDN, not from this API. This keeps the API thin, fast, and inexpensive to
          cache.
        </p>
        <p className="mt-3 leading-relaxed">
          Base URL:{" "}
          <code className="rounded border border-[color:var(--border)] bg-[color:var(--surface-2)] px-1.5 py-0.5 text-sm">
            {BASE}
          </code>
        </p>
        <p className="mt-3 leading-relaxed">
          All responses are JSON, UTF-8, with the same envelope: <code>schema_version</code>,{" "}
          <code>api_version</code>, <code>generated_at</code>, <code>generation_status</code>,{" "}
          <code>warnings[]</code>, plus a payload key (<code>datasets</code>, <code>manifest</code>,
          <code>items</code>, <code>reports</code>, <code>sources</code>).
        </p>
      </section>

      <section id="authentication" className="mt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">Authentication</h2>
        <p className="mt-3 leading-relaxed">
          None. The catalog is public open data. Requests do not require credentials. CORS is
          permissive (<code>Access-Control-Allow-Origin: *</code>); browser clients can call the
          API directly.
        </p>
      </section>

      <section id="versioning" className="mt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">Versioning</h2>
        <p className="mt-3 leading-relaxed">
          The API version sits in the URL prefix (<code>/api/v1</code>). Backwards-compatible
          additions are shipped under the current version; breaking changes are released under a
          new version (<code>/api/v2</code>) with the previous version kept available and a
          <code>Deprecation</code> response header set on the older endpoints.
        </p>
        <p className="mt-3 leading-relaxed">
          The manifest payload itself carries an independent <code>schema_version</code> field
          (currently <code>1.0</code>). API and manifest versions evolve independently.
        </p>
      </section>

      <section id="caching" className="mt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">Caching</h2>
        <p className="mt-3 leading-relaxed">
          Responses include{" "}
          <code>Cache-Control: public, max-age=3600, stale-while-revalidate=86400</code>. A weak{" "}
          <code>ETag</code> is computed from <code>generated_at</code> and item count; clients
          may revalidate with <code>If-None-Match</code> and receive <code>304 Not Modified</code>.
          The upstream catalog is regenerated by the pipelines on each publish; one-hour staleness
          on the API layer is acceptable for the data we serve.
        </p>
      </section>

      <section id="errors" className="mt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">Errors</h2>
        <p className="mt-3 leading-relaxed">
          Error responses follow{" "}
          <a
            className="underline hover:text-[color:var(--accent)]"
            href="https://datatracker.ietf.org/doc/html/rfc7807"
            target="_blank"
            rel="noreferrer"
          >
            RFC 7807
          </a>{" "}
          with <code>Content-Type: application/problem+json</code> and the fields <code>type</code>,
          <code>title</code>, <code>status</code>, and <code>detail</code>. Defined error kinds:
          <code>not_found</code> (404), <code>bad_request</code> (400),{" "}
          <code>upstream_unavailable</code> (503), <code>internal_error</code> (500).
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-xs leading-relaxed text-[color:var(--foreground)] not-prose">
          <code>{PROBLEM_EXAMPLE}</code>
        </pre>
      </section>

      <section id="openapi" className="mt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">OpenAPI specification</h2>
        <p className="mt-3 leading-relaxed">
          A machine-readable OpenAPI 3.1 specification is published at{" "}
          <a className="underline hover:text-[color:var(--accent)]" href="/api/v1/openapi.json">
            /api/v1/openapi.json
          </a>
          . It is regenerated from the same Zod schemas that validate the route responses; the
          spec and the runtime cannot drift.
        </p>
      </section>

      <h2 className="mt-16 text-2xl font-semibold text-[color:var(--foreground)]">Endpoints</h2>

      <EndpointBlock
        id="health"
        method="GET"
        path={`${BASE}/health`}
        summary="Service health"
        description={
          <>Probe endpoint. Returns service status and the manifest schema version this deployment serves.</>
        }
        curlExample={`curl ${BASE}/health`}
        responseExample={`{
  "schema_version": "1.0",
  "api_version": "v1",
  "generated_at": "2026-05-14T22:00:00Z",
  "generation_status": "success",
  "warnings": [],
  "status": "ok"
}`}
      />

      <EndpointBlock
        id="catalog"
        method="GET"
        path={`${BASE}/catalog`}
        summary="List datasets"
        description={
          <>
            Compact list of all open-data datasets. Suitable for discovery; for the full file list
            of a single dataset, follow the <code>manifest_path</code> via{" "}
            <code>/datasets/{"{id}"}</code>.
          </>
        }
        responseFields={[
          { name: "datasets[]", type: "DatasetSummary[]", description: "All datasets currently in the catalog." },
          { name: "datasets[].id", type: "string", description: "Stable dataset identifier (snake_case)." },
          { name: "datasets[].slug", type: "string", description: "URL-safe slug (kebab-case)." },
          { name: "datasets[].source_id", type: "string", description: "Source agency identifier." },
          { name: "datasets[].manifest_path", type: "string", description: "Storage path of the dataset manifest." },
        ]}
        curlExample={`curl ${BASE}/catalog`}
        responseExample={CATALOG_RESPONSE_EXAMPLE}
      />

      <EndpointBlock
        id="catalog-reports"
        method="GET"
        path={`${BASE}/catalog/reports`}
        summary="List reports"
        description={<>Compact list of all published analytical reports.</>}
        curlExample={`curl ${BASE}/catalog/reports`}
      />

      <EndpointBlock
        id="datasets-id"
        method="GET"
        path={`${BASE}/datasets/{id}`}
        summary="Get dataset manifest"
        description={
          <>
            Full dataset manifest envelope. The path parameter accepts the dataset{" "}
            <code>id</code> (e.g. <code>inpe_bdqueimadas_focos</code>) or its <code>slug</code>.
          </>
        }
        params={[
          { name: "id", in: "path", type: "string", description: "Dataset id or slug.", required: true },
        ]}
        curlExample={`curl ${BASE}/datasets/inpe_bdqueimadas_focos`}
        responseExample={DATASET_RESPONSE_EXAMPLE}
      />

      <EndpointBlock
        id="datasets-id-items"
        method="GET"
        path={`${BASE}/datasets/{id}/items`}
        summary="Get dataset items"
        description={
          <>
            Returns only the <code>items[]</code> array of the manifest. Useful for clients that
            need download URLs but not full metadata.
          </>
        }
        params={[
          { name: "id", in: "path", type: "string", description: "Dataset id or slug.", required: true },
        ]}
        curlExample={`curl ${BASE}/datasets/inpe_bdqueimadas_focos/items`}
      />

      <EndpointBlock
        id="reports-id"
        method="GET"
        path={`${BASE}/reports/{id}`}
        summary="Get report manifest"
        description={<>Full report manifest envelope.</>}
        params={[
          { name: "id", in: "path", type: "string", description: "Report id or slug.", required: true },
        ]}
        curlExample={`curl ${BASE}/reports/bdqueimadas_overview`}
      />

      <EndpointBlock
        id="sources"
        method="GET"
        path={`${BASE}/sources`}
        summary="List source agencies"
        description={
          <>
            Distinct source agencies derived from the catalog with dataset counts per source.
            Useful for faceted browsing in client applications.
          </>
        }
        curlExample={`curl ${BASE}/sources`}
      />

      <section id="sdk-python" className="mt-16 border-t border-[color:var(--border)] pt-10">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">Python SDK</h2>
        <p className="mt-3 leading-relaxed">
          A reference Python client wraps the API and adds local download with sha256 verification.
          The package source lives in{" "}
          <code>forest-open-data-pipelines/sdk/forest_data/</code>; the public name is{" "}
          <code>forest-data</code> on PyPI.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-xs leading-relaxed text-[color:var(--foreground)] not-prose">
          <code>{`pip install forest-data

import forest_data

client = forest_data.Client()
print([d.id for d in client.list_datasets()])

# download every file in a dataset, verify sha256, and save under ./data
paths = client.download("inpe_bdqueimadas_focos", path="./data")`}</code>
        </pre>
        <p className="mt-3 leading-relaxed">
          The SDK does no caching of its own; it talks to{" "}
          <code>{BASE}</code> and follows the URLs returned in the manifest.
        </p>
      </section>
    </DocsLayout>
  );
}
