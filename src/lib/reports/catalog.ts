// src/lib/reports/catalog.ts
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
};

export const REPORTS_CATALOG: ReportCatalogItem[] = [
  {
    id: "bdqueimadas_overview",
    slug: "bdqueimadas-overview",
    title: "BDQueimadas - Panorama Sintético de Focos",
    description:
      "Leitura sintética da série histórica de focos de queimadas, com destaques automatizados, filtros por período e bioma, comparação anual e visão comparativa por UF.",
    sourceTitle: "INPE - Programa Queimadas",
    categoryTitle: "Meio ambiente",
    manifestPath: "reports/bdqueimadas/overview/manifest.json",
    stableReportPath: "reports/bdqueimadas/overview/report.json",
    sourcePortalHref: "/open-data/inpe/inpe-bdqueimadas-focos",
    tags: ["queimadas", "inpe", "focos", "série temporal", "bioma", "comparação anual"],
  },
];

export function getReportBySlug(slug: string) {
  return REPORTS_CATALOG.find((item) => item.slug === slug);
}