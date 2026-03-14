// src/lib/reports/fetch.ts

import { getPublicObjectUrl } from "@/lib/openData/publicUrls";
import type { ReportDocument, ReportManifest } from "@/lib/reports/types";

export async function fetchReportManifest(manifestPath: string): Promise<ReportManifest> {
  const url = getPublicObjectUrl(manifestPath);
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao buscar manifest do report`);
  }

  return (await res.json()) as ReportManifest;
}

export async function fetchStableReport(stableReportPath: string): Promise<ReportDocument> {
  const url = getPublicObjectUrl(stableReportPath);
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao buscar report estável`);
  }

  return (await res.json()) as ReportDocument;
}
