// src/lib/openData/catalog.ts
export type OpenDataDataset = {
  id: string;
  title: string;
  description: string;
  manifest_path: string; // path dentro do bucket público
  source_url: string;
};

export const OPEN_DATA_DATASETS: OpenDataDataset[] = [
  {
    id: "cvm_fi_inf_diario",
    title: "CVM - FI - Informe Diário",
    description:
      "Informes diários de fundos de investimento (arquivos mensais em ZIP) + dicionário de dados (TXT).",
    manifest_path: "cvm/fi/inf_diario/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-doc-inf_diario",
  },
];
