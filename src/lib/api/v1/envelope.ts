import { NextResponse } from "next/server";

import { API_VERSION } from "./registry";

export const SCHEMA_VERSION = "1.0";

export type GenerationStatus = "success" | "success_partial_fallback" | "failed";

type PayloadObject = Record<string, unknown>;

export type EnvelopeOptions = {
  generation_status?: GenerationStatus;
  warnings?: string[];
  generated_at?: string;
  cacheSeconds?: number;
  staleWhileRevalidate?: number;
  etag?: string;
  status?: number;
  extraHeaders?: Record<string, string>;
};

const DEFAULT_CACHE = 3600;
const DEFAULT_SWR = 86400;

export function buildEnvelope<T extends PayloadObject>(
  payload: T,
  options: EnvelopeOptions = {},
): T & {
  schema_version: string;
  generated_at: string;
  generation_status: GenerationStatus;
  warnings: string[];
  api_version: string;
} {
  return {
    schema_version: SCHEMA_VERSION,
    generated_at: options.generated_at ?? new Date().toISOString(),
    generation_status: options.generation_status ?? "success",
    warnings: options.warnings ?? [],
    api_version: API_VERSION,
    ...payload,
  };
}

export function jsonResponse<T extends PayloadObject>(payload: T, options: EnvelopeOptions = {}) {
  const body = buildEnvelope(payload, options);
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, max-age=${options.cacheSeconds ?? DEFAULT_CACHE}, stale-while-revalidate=${options.staleWhileRevalidate ?? DEFAULT_SWR}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Api-Version": API_VERSION,
    ...(options.extraHeaders ?? {}),
  };
  if (options.etag) headers["ETag"] = options.etag;
  return new NextResponse(JSON.stringify(body), {
    status: options.status ?? 200,
    headers,
  });
}

export function notModifiedResponse(etag: string) {
  return new NextResponse(null, {
    status: 304,
    headers: {
      ETag: etag,
      "Cache-Control": `public, max-age=${DEFAULT_CACHE}, stale-while-revalidate=${DEFAULT_SWR}`,
      "X-Api-Version": API_VERSION,
    },
  });
}

export function corsPreflightResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export function weakEtagFromObject(obj: unknown): string {
  // FNV-1a 32-bit. Sufficient for ETag (no security claim).
  const json = JSON.stringify(obj);
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `W/"${(hash >>> 0).toString(16)}"`;
}
