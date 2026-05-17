import { getOpenDataCatalog } from "@/lib/openData/catalog";
import {
  corsPreflightResponse,
  jsonResponse,
  notModifiedResponse,
  weakEtagFromObject,
} from "@/lib/api/v1/envelope";
import { problemResponse } from "@/lib/api/v1/errors";

export const revalidate = 3600;

export async function GET(request: Request) {
  let env;
  try {
    env = await getOpenDataCatalog();
  } catch (e) {
    const detail = e instanceof Error ? e.message : "unknown error";
    return problemResponse("upstream_unavailable", detail);
  }

  const datasets = env.datasets;
  const etag = weakEtagFromObject({ generated_at: env.generated_at, count: datasets.length });
  if (request.headers.get("if-none-match") === etag) {
    return notModifiedResponse(etag);
  }

  return jsonResponse(
    { datasets },
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
