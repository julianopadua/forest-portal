import { NextResponse } from "next/server";

import { API_VERSION } from "./registry";

const ERROR_BASE = "https://institutoforest.org/api/errors";

export type ProblemKind =
  | "not_found"
  | "bad_request"
  | "upstream_unavailable"
  | "internal_error";

const PROBLEM_DETAILS: Record<ProblemKind, { type: string; title: string; status: number }> = {
  not_found: { type: `${ERROR_BASE}/not-found`, title: "Resource not found", status: 404 },
  bad_request: { type: `${ERROR_BASE}/bad-request`, title: "Invalid request", status: 400 },
  upstream_unavailable: {
    type: `${ERROR_BASE}/upstream-unavailable`,
    title: "Upstream catalog unavailable",
    status: 503,
  },
  internal_error: {
    type: `${ERROR_BASE}/internal-error`,
    title: "Internal server error",
    status: 500,
  },
};

export function problemResponse(
  kind: ProblemKind,
  detail: string,
  instance?: string,
): NextResponse {
  const meta = PROBLEM_DETAILS[kind];
  return new NextResponse(
    JSON.stringify({
      type: meta.type,
      title: meta.title,
      status: meta.status,
      detail,
      ...(instance ? { instance } : {}),
    }),
    {
      status: meta.status,
      headers: {
        "Content-Type": "application/problem+json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "X-Api-Version": API_VERSION,
      },
    },
  );
}
