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

  const counts = new Map<string, { source_id: string; source_title: string; dataset_count: number }>();
  for (const d of env.datasets) {
    const cur = counts.get(d.source_id);
    if (cur) cur.dataset_count += 1;
    else counts.set(d.source_id, { source_id: d.source_id, source_title: d.source_title, dataset_count: 1 });
  }
  const sources = Array.from(counts.values()).sort((a, b) => a.source_id.localeCompare(b.source_id));

  const etag = weakEtagFromObject({ generated_at: env.generated_at, n: sources.length });
  if (request.headers.get("if-none-match") === etag) {
    return notModifiedResponse(etag);
  }

  return jsonResponse(
    { sources, count: sources.length },
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
