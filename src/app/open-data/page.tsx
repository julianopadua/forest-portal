// src/app/open-data/page.tsx
import OpenDataPageClient from "@/components/open-data/OpenDataPageClient";
import { getOpenDataDatasets } from "@/lib/openData/catalog";

export default async function OpenDataPage() {
  const datasets = await getOpenDataDatasets();
  return <OpenDataPageClient datasets={datasets} />;
}
