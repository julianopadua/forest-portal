import type { Metadata } from "next";

import ApiDocsPageClient from "@/components/docs/ApiDocsPageClient";
import { loadDoc } from "@/lib/docs/loadDoc";

export const metadata: Metadata = {
  title: "Open Data API v1 - Forest",
  description: "Public, read-only HTTP API for the Instituto Forest open-data catalog.",
};

export default async function ApiDocsPage() {
  const [docPt, docEn] = await Promise.all([loadDoc("api-v1", "pt"), loadDoc("api-v1", "en")]);

  return <ApiDocsPageClient docs={{ pt: docPt, en: docEn }} />;
}
