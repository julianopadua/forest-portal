import type { OpenDataDataset } from "@/lib/openData/openDataDataset";
import type { OpenDataManifest } from "@/lib/openData/types";
import { fetchOpenDataManifest } from "@/lib/openData/fetch";
import {
  ANP_CATALOG_COMPACT_PATH,
  buildManifestFromAnpDataset,
  type AnpCatalogCompact,
} from "@/lib/openData/anpCatalog";
import { fetchJsonFromStorage } from "@/lib/storageFetch";

// ANP catalog entries share a single compact envelope at
// anp/catalog/anp_catalog_compact.json. That envelope is schema_version "1"
// and carries a datasets[] array, not a schema-2.0 manifest. The portal UI
// has long synthesized per-slug manifests on the fly via
// buildManifestFromAnpDataset(). The /api/v1 routes did not, so SDK clients
// received the compact root and DatasetManifest.from_dict() failed.
//
// This helper makes the API behave like the UI: when manifest_path points at
// the compact envelope, reshape it for the requested slug; otherwise fetch
// the per-slug manifest directly. Future per-slug ANP manifests published by
// the pipeline will skip the reshape automatically because their
// manifest_path will not equal ANP_CATALOG_COMPACT_PATH.

export class ManifestNotFoundForSlugError extends Error {
  constructor(slug: string) {
    super(`ANP compact envelope has no dataset with slug "${slug}".`);
    this.name = "ManifestNotFoundForSlugError";
  }
}

function isAnpCompactPath(manifestPath: string): boolean {
  return manifestPath === ANP_CATALOG_COMPACT_PATH;
}

export async function loadManifestForDataset(
  dataset: OpenDataDataset,
): Promise<OpenDataManifest> {
  if (!isAnpCompactPath(dataset.manifest_path)) {
    return fetchOpenDataManifest(dataset.manifest_path);
  }
  const compact = await fetchJsonFromStorage<AnpCatalogCompact>(
    ANP_CATALOG_COMPACT_PATH,
    { label: "anp-compact" },
  );
  const built = buildManifestFromAnpDataset(
    compact,
    dataset.slug,
    dataset.source_url,
  );
  if (!built) throw new ManifestNotFoundForSlugError(dataset.slug);
  return built;
}
