// src/app/open-data/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import OpenDataPageClient from "@/components/open-data/OpenDataPageClient";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import { dictionaries, type Locale } from "@/i18n/dictionaries";
import { getOpenDataDatasets } from "@/lib/openData/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = rawLocale === "en" ? "en" : "pt";
  const m = dictionaries[locale].openData.meta;
  return { title: m.catalogTitle, description: m.catalogDescription };
}

export default async function OpenDataPage() {
  const datasets = await getOpenDataDatasets();
  return <OpenDataPageClient datasets={datasets} />;
}
