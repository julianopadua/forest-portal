// src/lib/openData/publicUrls.ts
export function getPublicObjectUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  const bucket = process.env.NEXT_PUBLIC_OPEN_DATA_BUCKET?.trim() || "open-data";

  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não definido em .env.local");
  }

  const cleanPath = path.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

export function withDownload(url: string, filename?: string) {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  if (!base || !u.href.startsWith(base)) {
    return url;
  }
  if (filename) u.searchParams.set("download", filename);
  else u.searchParams.set("download", "");
  return u.toString();
}
