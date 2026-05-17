import { fetchJsonFromStorage } from "@/lib/storageFetch";
import { REPORTS_CATALOG_PATH, type ReportsCatalogEnvelope } from "@/lib/reports/catalog";
import {
  corsPreflightResponse,
  jsonResponse,
  notModifiedResponse,
  weakEtagFromObject,
} from "@/lib/api/v1/envelope";
import { problemResponse } from "@/lib/api/v1/errors";

export const revalidate = 3600;

type ReportsCatalogEnvelopeExternal = ReportsCatalogEnvelope;

export async function GET(request: Request) {
  let env: ReportsCatalogEnvelopeExternal;
  try {
    env = await fetchJsonFromStorage<ReportsCatalogEnvelopeExternal>(REPORTS_CATALOG_PATH, {
      label: "reports_catalog",
    });
  } catch (e) {
    const detail = e instanceof Error ? e.message : "unknown error";
    return problemResponse("upstream_unavailable", detail);
  }

  const reports = env.reports;
  const etag = weakEtagFromObject({ generated_at: env.generated_at, count: reports.length });
  if (request.headers.get("if-none-match") === etag) {
    return notModifiedResponse(etag);
  }

  return jsonResponse(
    { reports },
    {
      generation_status: env.generation_status,
      warnings: env.warnings,
      generated_at: env.generated_at,
      etag,
    },
  );
}

export function OPTIONS() {
  return corsPreflightResponse();
}
