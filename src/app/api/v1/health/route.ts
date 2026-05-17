import { jsonResponse, corsPreflightResponse, SCHEMA_VERSION } from "@/lib/api/v1/envelope";
import { API_VERSION } from "@/lib/api/v1/constants";

export const runtime = "edge";

export async function GET() {
  return jsonResponse(
    { status: "ok", api_version: API_VERSION, schema_version: SCHEMA_VERSION },
    { cacheSeconds: 60, staleWhileRevalidate: 60 },
  );
}

export function OPTIONS() {
  return corsPreflightResponse();
}
