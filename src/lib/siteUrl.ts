const DEFAULT_SITE_URL = "https://institutoforest.org";

/** Canonical public origin for absolute metadata URLs (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}
