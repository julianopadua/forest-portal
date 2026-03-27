// src/lib/reports/catalog.ts
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
  /** Layout da página de detalhe (ex.: estilo notícia com coluna lateral). */
  layout?: ReportLayout;
  /** Caminho público da imagem de abertura (ex.: /images/reports/...). */
  heroImageSrc?: string;
  /** Legenda ou crédito abaixo da imagem (HTML opcional via texto simples). */
  heroImageCreditPt?: string;
  heroImageCreditEn?: string;
  /** Matéria de referência sobre o contexto (ex.: fogo no Cerrado). */
  relatedArticleUrl?: string;
  relatedArticleLabelPt?: string;
  relatedArticleLabelEn?: string;
};

export const REPORTS_CATALOG: ReportCatalogItem[] = [
  {
    id: "bdqueimadas_overview",
    slug: "bdqueimadas-overview",
    title: "BDQueimadas - Panorama Sintético de Focos",
    description:
      "Leitura sintética da série histórica de focos de queimadas, com filtros por período e bioma, comparação anual e visão comparativa por UF.",
    sourceTitle: "INPE - Programa Queimadas",
    categoryTitle: "Meio ambiente",
    manifestPath: "reports/bdqueimadas/overview/manifest.json",
    stableReportPath: "reports/bdqueimadas/overview/report.json",
    sourcePortalHref: "/open-data/inpe/inpe-bdqueimadas-focos",
    tags: ["queimadas", "inpe", "focos"],
    layout: "news",
    heroImageSrc: "/images/reports/bdqueimadas-cerrado-hero.png",
    heroImageCreditPt:
      "Savana precisa do fogo, mas a ação humana altera regimes naturais. Imagem ilustrativa do bioma Cerrado (referência visual alinhada a reportagens como Conexão UFRJ).",
    heroImageCreditEn:
      "Savannas depend on fire, but human action changes natural fire regimes. Illustrative image of the Cerrado (visual reference aligned with outlets such as Conexão UFRJ).",
    relatedArticleUrl: "https://conexao.ufrj.br/2021/07/como-o-fogo-se-comporta-no-cerrado/",
    relatedArticleLabelPt: "Como o fogo se comporta no Cerrado? (Conexão UFRJ)",
    relatedArticleLabelEn: "How does fire behave in the Cerrado? (Conexão UFRJ)",
  },
];

export function getReportBySlug(slug: string) {
  return REPORTS_CATALOG.find((item) => item.slug === slug);
}