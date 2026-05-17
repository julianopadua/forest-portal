import { fetchJsonFromStorage, tryFetchJsonFromStorage } from "@/lib/storageFetch";
import type { OpenDataItem, OpenDataManifest, OpenDataMetaFile } from "@/lib/openData/types";

type LooseRecord = Record<string, unknown>;

function isRecord(value: unknown): value is LooseRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function normalizeItem(value: unknown): OpenDataItem | null {
  if (!isRecord(value)) return null;
  const sourceUrl = stringField(value.source_url) ?? stringField(value.public_url) ?? "";
  const normalized: LooseRecord = { ...value, source_url: sourceUrl };
  delete normalized.public_url;
  delete normalized.storage_path;
  return normalized as OpenDataItem;
}

function normalizeMetaFile(value: unknown): OpenDataMetaFile | undefined {
  if (!isRecord(value)) return undefined;
  const sourceUrl = stringField(value.source_url) ?? stringField(value.public_url) ?? "";
  const normalized: LooseRecord = { ...value, source_url: sourceUrl };
  delete normalized.public_url;
  delete normalized.storage_path;
  return normalized as OpenDataMetaFile;
}

function normalizeOpenDataManifest(raw: unknown): OpenDataManifest {
  if (!isRecord(raw)) return raw as OpenDataManifest;
  const rawMeta = isRecord(raw.meta) ? raw.meta : {};
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const meta: LooseRecord = { ...rawMeta };
  meta.metadata_file = normalizeMetaFile(rawMeta.metadata_file);
  if (meta.metadata_file === undefined) delete meta.metadata_file;
  const items = rawItems.map(normalizeItem).filter((item): item is OpenDataItem => item !== null);
  return { ...raw, items, meta } as OpenDataManifest;
}

export async function fetchOpenDataManifest(manifestPath: string): Promise<OpenDataManifest> {
  const raw = await fetchJsonFromStorage<unknown>(manifestPath, { label: "manifest" });
  return normalizeOpenDataManifest(raw);
}

export async function tryFetchOpenDataManifest(
  manifestPath: string,
): Promise<OpenDataManifest | null> {
  const raw = await tryFetchJsonFromStorage<unknown>(manifestPath, { label: "manifest" });
  return raw === null ? null : normalizeOpenDataManifest(raw);
}
