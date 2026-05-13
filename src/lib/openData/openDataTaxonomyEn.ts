//src/lib/openData/openDataTaxonomyEn.ts

//chaves PT de category_title / segment_title / subcategory_title do catalogo -> rotulos EN na UI
export const OPEN_DATA_TAXONOMY_EN_BY_PT: Record<string, string> = {
  "Mercado financeiro": "Financial markets",
  "Mercado de commodities": "Commodities markets",
  "Variáveis climáticas": "Climate variables",
  "Meio ambiente": "Environment",
  Outros: "Other",

  Energia: "Energy",

  Fundos: "Funds",
  "Petróleo e gás": "Oil and gas",
  Queimadas: "Wildfires",
  Clima: "Climate",
  "Áreas protegidas": "Protected areas",
  "Abastecimento e mercado": "Supply and retail market",
  "Biocombustíveis e renováveis": "Biofuels and renewables",
  Lubrificantes: "Lubricants",
  "Comércio e serviços": "Trade and services",
  Administração: "Administration",
  "Pesquisa e desenvolvimento": "Research and development",
};

export function openDataTaxonomyLabel(
  ptLabel: string,
  locale: "pt" | "en",
  enByPt: Record<string, string>
): string {
  if (locale !== "en") return ptLabel;
  return enByPt[ptLabel] ?? ptLabel;
}
