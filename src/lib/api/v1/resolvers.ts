import { getOpenDataCatalog } from "@/lib/openData/catalog";
import type { OpenDataDataset } from "@/lib/openData/openDataDataset";

export async function resolveDatasetByIdOrSlug(
  idOrSlug: string,
): Promise<OpenDataDataset | undefined> {
  const env = await getOpenDataCatalog();
  return env.datasets.find((d) => d.id === idOrSlug || d.slug === idOrSlug);
}
