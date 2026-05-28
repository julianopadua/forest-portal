import type { OpenDataDataset } from "@/lib/openData/openDataDataset";
import type { OpenDataManifest } from "@/lib/openData/types";
import { fetchOpenDataManifest } from "@/lib/openData/fetch";

export async function loadManifestForDataset(
  dataset: OpenDataDataset,
): Promise<OpenDataManifest> {
  return fetchOpenDataManifest(dataset.manifest_path);
}
