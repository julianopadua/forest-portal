// src/lib/reports/fetch.ts
import { fetchJsonFromStorage } from "@/lib/storageFetch";
import type { ReportDocument, ReportManifest } from "@/lib/reports/types";

export async function fetchReportManifest(manifestPath: string): Promise<ReportManifest> {
  return fetchJsonFromStorage<ReportManifest>(manifestPath, { label: "manifest" });
}

export async function fetchStableReport(stableReportPath: string): Promise<ReportDocument> {
  return fetchJsonFromStorage<ReportDocument>(stableReportPath, { label: "report" });
}
