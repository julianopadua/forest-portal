//src/lib/reports/catalog.ts
//
//portal does not keep a hardcoded reports catalog. the ssot is the json
//published by `forest-pipelines publish-catalog` to supabase storage at
//`catalog/reports_catalog.json`.

import { fetchJsonFromStorage } from "@/lib/storageFetch";

export type ReportLayout = "default" | "news";

export type ReportCatalogItem = {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  excerpt?: string;
  excerptEn?: string;
  generatedAt?: string;
  coverage?: ReportCatalogCoverage;
  sourceTitle: string;
  sourceTitleEn?: string;
  categoryTitle: string;
  categoryTitleEn?: string;
  manifestPath: string;
  stableReportPath: string;
  sourcePortalHref?: string;
  sourceDatasetUrl?: string;
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

export type ReportCatalogCoverage = {
  firstYear?: number | null;
  latestYear?: number | null;
  yearRange?: string | null;
  latestPeriod?: string | null;
};

/** Raw entry as published by the pipeline (snake_case, matching configs/catalog/reports.yml). */
type RawReportEntry = {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  excerpt?: string;
  excerpt_en?: string;
  generated_at?: string;
  coverage?: {
    first_year?: number | null;
    latest_year?: number | null;
    year_range?: string | null;
    latest_period?: string | null;
  };
  source_title: string;
  source_title_en?: string;
  category_title: string;
  category_title_en?: string;
  manifest_path: string;
  stable_report_path: string;
  source_portal_href?: string;
  source_dataset_url?: string;
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

function toCoverage(raw: RawReportEntry["coverage"]): ReportCatalogCoverage | undefined {
  if (!raw) return undefined;
  return {
    firstYear: raw.first_year,
    latestYear: raw.latest_year,
    yearRange: raw.year_range,
    latestPeriod: raw.latest_period,
  };
}

function toCamelCase(raw: RawReportEntry): ReportCatalogItem {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    titleEn: raw.title_en,
    description: raw.description,
    descriptionEn: raw.description_en,
    excerpt: raw.excerpt,
    excerptEn: raw.excerpt_en,
    generatedAt: raw.generated_at,
    coverage: toCoverage(raw.coverage),
    sourceTitle: raw.source_title,
    sourceTitleEn: raw.source_title_en,
    categoryTitle: raw.category_title,
    categoryTitleEn: raw.category_title_en,
    manifestPath: raw.manifest_path,
    stableReportPath: raw.stable_report_path,
    tags: raw.tags ?? [],
    sourcePortalHref: raw.source_portal_href,
    sourceDatasetUrl: raw.source_dataset_url,
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
