// src/lib/reports/localizeCatalog.ts
//
// Locale-aware view over a ReportCatalogItem. Prefers _en fields published by
// the pipeline (configs/catalog/reports.yml -> reports_catalog.json). Falls
// back to a small per-slug overrides map below for entries already in Storage
// that predate the addition of _en fields, then to the shared open-data
// taxonomy for category_title, and finally to the pt value. Remove the slug
// from REPORT_EN_OVERRIDES once its catalog row ships title_en and friends.

import type { Locale } from "@/i18n/dictionaries";
import { OPEN_DATA_TAXONOMY_EN_BY_PT, openDataTaxonomyLabel } from "@/lib/openData/openDataTaxonomyEn";
import type { ReportCatalogItem } from "@/lib/reports/catalog";

type ReportEnOverride = {
  title?: string;
  description?: string;
  sourceTitle?: string;
  categoryTitle?: string;
};

const REPORT_EN_OVERRIDES: Record<string, ReportEnOverride> = {
  "bdqueimadas-overview": {
    title: "BDQueimadas - Hotspots Overview",
    description:
      "Synthesis of the historical hotspot series, with filters by period and biome, year-over-year comparison, and a comparative view by state.",
    sourceTitle: "INPE - Queimadas Programme",
    categoryTitle: "Environment",
  },
};

export type LocalizedCatalogView = {
  title: string;
  description: string;
  sourceTitle: string;
  categoryTitle: string;
};

export function localizeCatalogItem(
  item: ReportCatalogItem,
  locale: Locale,
): LocalizedCatalogView {
  if (locale !== "en") {
    return {
      title: item.title,
      description: item.description,
      sourceTitle: item.sourceTitle,
      categoryTitle: item.categoryTitle,
    };
  }

  const override = REPORT_EN_OVERRIDES[item.slug];
  const category =
    item.categoryTitleEn ??
    override?.categoryTitle ??
    openDataTaxonomyLabel(item.categoryTitle, "en", OPEN_DATA_TAXONOMY_EN_BY_PT);

  return {
    title: item.titleEn ?? override?.title ?? item.title,
    description: item.descriptionEn ?? override?.description ?? item.description,
    sourceTitle: item.sourceTitleEn ?? override?.sourceTitle ?? item.sourceTitle,
    categoryTitle: category,
  };
}
