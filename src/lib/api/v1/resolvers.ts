import { getOpenDataCatalog } from "@/lib/openData/catalog";
import type { OpenDataDataset } from "@/lib/openData/openDataDataset";
import { getReportsCatalog, type ReportCatalogItem } from "@/lib/reports/catalog";

export async function resolveDatasetByIdOrSlug(
  idOrSlug: string,
): Promise<OpenDataDataset | undefined> {
  const env = await getOpenDataCatalog();
  return env.datasets.find((d) => d.id === idOrSlug || d.slug === idOrSlug);
}

export async function resolveReportByIdOrSlug(
  idOrSlug: string,
): Promise<ReportCatalogItem | undefined> {
  const reports = await getReportsCatalog();
  return reports.find((r) => r.id === idOrSlug || r.slug === idOrSlug);
}
