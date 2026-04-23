// src/lib/reports/catalog.ts
//
// Portal does NOT keep a hardcoded reports catalog. The SSOT is the JSON
// published by `forest-pipelines publish-catalog` to Supabase Storage at
// `catalog/reports_catalog.json`.

import { fetchJsonFromStorage } from "@/lib/storageFetch";

export type ReportLayout = "default" | "news";

export type ReportCatalogItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sourceTitle: string;
  categoryTitle: string;
  manifestPath: string;
  stableReportPath: string;
  sourcePortalHref?: string;
  tags: string[];
  layout?: ReportLayout;
  heroImageSrc?: string;
  heroImageCreditPt?: string;
  heroImageCreditEn?: string;
  relatedArticleUrl?: string;
  relatedArticleLabelPt?: string;
  relatedArticleLabelEn?: string;
};

export const REPORTS_CATALOG_PATH = "catalog/reports_catalog.json";

/** Raw entry as published by the pipeline (snake_case, matching configs/catalog/reports.yml). */
type RawReportEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  source_title: string;
  category_title: string;
  manifest_path: string;
  stable_report_path: string;
  source_portal_href?: string;
  tags?: string[];
  layout?: ReportLayout;
  hero_image_src?: string;
  hero_image_credit_pt?: string;
  hero_image_credit_en?: string;
  related_article_url?: string;
  related_article_label_pt?: string;
  related_article_label_en?: string;
};

export type ReportsCatalogEnvelope = {
  schema_version: string;
  catalog_id: "reports_catalog";
  generated_at: string;
  generation_status: "success" | "success_partial_fallback" | "failed";
  warnings: string[];
  reports: RawReportEntry[];
};

function toCamelCase(raw: RawReportEntry): ReportCatalogItem {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    sourceTitle: raw.source_title,
    categoryTitle: raw.category_title,
    manifestPath: raw.manifest_path,
    stableReportPath: raw.stable_report_path,
    tags: raw.tags ?? [],
    sourcePortalHref: raw.source_portal_href,
    layout: raw.layout,
    heroImageSrc: raw.hero_image_src,
    heroImageCreditPt: raw.hero_image_credit_pt,
    heroImageCreditEn: raw.hero_image_credit_en,
    relatedArticleUrl: raw.related_article_url,
    relatedArticleLabelPt: raw.related_article_label_pt,
    relatedArticleLabelEn: raw.related_article_label_en,
  };
}

/**
 * Fetch the reports catalog envelope from Storage (with local fallback).
 * Server-side only.
 */
export async function getReportsCatalog(): Promise<ReportCatalogItem[]> {
  const env = await fetchJsonFromStorage<ReportsCatalogEnvelope>(REPORTS_CATALOG_PATH, {
    label: "reports_catalog",
  });
  return env.reports.map(toCamelCase);
}

export async function getReportBySlug(slug: string): Promise<ReportCatalogItem | undefined> {
  const reports = await getReportsCatalog();
  return reports.find((item) => item.slug === slug);
}
