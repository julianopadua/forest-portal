// src/lib/openData/catalog.ts
export type OpenDataDataset = {
  id: string;

  // Navegação/organização (catálogo)
  category_title: string; // ex: "Mercado financeiro"
  source_id: string; // ex: "cvm" (segmento de URL)
  source_title: string; // ex: "CVM"
  slug: string; // ex: "fi-informe-diario" (segmento de URL)

  // Conteúdo
  title: string; // ex: "FI - Informe Diário"
  description: string;

  // Infra
  manifest_path: string; // path dentro do bucket público
  source_url: string; // link para a fonte oficial do dataset
};

export const OPEN_DATA_DATASETS: OpenDataDataset[] = [
  {
    id: "cvm_fi_inf_diario",

    category_title: "Mercado financeiro",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-informe-diario",

    title: "FI - Informe Diário",
    description:
      "Informes diários de fundos de investimento (arquivos mensais em ZIP) + dicionário de dados (TXT).",

    manifest_path: "cvm/fi/inf_diario/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-doc-inf_diario",
  },
];
