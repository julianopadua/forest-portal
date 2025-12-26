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
  const u = new URL(url);
  // Supabase: ?download força download (opcionalmente com nome custom) :contentReference[oaicite:3]{index=3}
  if (filename) u.searchParams.set("download", filename);
  else u.searchParams.set("download", "");
  return u.toString();
}
