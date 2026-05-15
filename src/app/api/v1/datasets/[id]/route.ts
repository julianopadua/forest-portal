import {
  corsPreflightResponse,
  jsonResponse,
  notModifiedResponse,
  weakEtagFromObject,
} from "@/lib/api/v1/envelope";
import { problemResponse } from "@/lib/api/v1/errors";
import { resolveDatasetByIdOrSlug } from "@/lib/api/v1/resolvers";
import { fetchOpenDataManifest } from "@/lib/openData/fetch";

export const runtime = "edge";
export const revalidate = 3600;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const dataset = await resolveDatasetByIdOrSlug(id).catch(() => undefined);
  if (!dataset) {
    return problemResponse("not_found", `No dataset with id or slug "${id}".`);
  }

  let manifest;
  try {
    manifest = await fetchOpenDataManifest(dataset.manifest_path);
  } catch (e) {
    const detail = e instanceof Error ? e.message : "unknown error";
    return problemResponse("upstream_unavailable", detail);
  }

  const etag = weakEtagFromObject({
    generated_at: manifest.generated_at,
    count: manifest.items.length,
  });
  if (request.headers.get("if-none-match") === etag) {
    return notModifiedResponse(etag);
  }

  return jsonResponse(
    { manifest },
    {
      generation_status: manifest.generation_status,
      warnings: manifest.warnings,
      generated_at: manifest.generated_at,
      etag,
    },
  );
}

export function OPTIONS() {
  return corsPreflightResponse();
}
