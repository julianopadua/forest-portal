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
  tags: string[];
};

export const REPORTS_CATALOG: ReportCatalogItem[] = [
  {
    id: "bdqueimadas_overview",
    slug: "bdqueimadas-overview",
    title: "BDQueimadas - Panorama Sintético de Focos",
    description:
      "Leitura sintética da série recente de focos de queimadas, com destaques, comparação anual, série mensal e tabela comparativa por estado.",
    sourceTitle: "INPE - Programa Queimadas",
    categoryTitle: "Meio ambiente",
    manifestPath: "reports/bdqueimadas/overview/manifest.json",
    stableReportPath: "reports/bdqueimadas/overview/report.json",
    tags: ["queimadas", "inpe", "focos", "série temporal", "comparação anual"],
  },
];

export function getReportBySlug(slug: string) {
  return REPORTS_CATALOG.find((item) => item.slug === slug);
}
