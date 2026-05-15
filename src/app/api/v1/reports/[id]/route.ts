import {
  corsPreflightResponse,
  jsonResponse,
  notModifiedResponse,
  weakEtagFromObject,
} from "@/lib/api/v1/envelope";
import { problemResponse } from "@/lib/api/v1/errors";
import { resolveReportByIdOrSlug } from "@/lib/api/v1/resolvers";
import { fetchReportManifest } from "@/lib/reports/fetch";

export const runtime = "edge";
export const revalidate = 3600;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const report = await resolveReportByIdOrSlug(id).catch(() => undefined);
  if (!report) {
    return problemResponse("not_found", `No report with id or slug "${id}".`);
  }

  let manifest;
  try {
    manifest = await fetchReportManifest(report.manifestPath);
  } catch (e) {
    const detail = e instanceof Error ? e.message : "unknown error";
    return problemResponse("upstream_unavailable", detail);
  }

  const etag = weakEtagFromObject({ generated_at: manifest.generated_at });
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
