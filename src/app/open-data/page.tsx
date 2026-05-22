//src/app/open-data/page.tsx
import type { Metadata } from "next";
import OpenDataPageClient from "@/components/open-data/OpenDataPageClient";
import { dictionaries } from "@/i18n/dictionaries";
import { getOpenDataDatasets } from "@/lib/openData/catalog";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const m = dictionaries.pt.openData.meta;
  return { title: m.catalogTitle, description: m.catalogDescription };
}

export default async function OpenDataPage() {
  const datasets = await getOpenDataDatasets();
  return <OpenDataPageClient datasets={datasets} />;
}
