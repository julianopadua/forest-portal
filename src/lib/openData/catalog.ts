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
  // =========================
  // Mercado financeiro -> CVM
  // =========================
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

  {
    id: "cvm_fi_doc_extrato",

    category_title: "Mercado financeiro",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-doc-extrato",

    title: "FI - DOC - Extrato",
    description:
      "Extrato das informações de Fundos de Investimento: versão Atual + recortes anuais (CSV) + dicionário (TXT).",

    manifest_path: "cvm/fi/doc/extrato/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-doc-extrato",
  },

  // FI - Cadastro (a página oficial é a mesma, mas no portal viram datasets distintos)
  {
    id: "cvm_fi_cad_registro_fundo_classe",

    category_title: "Mercado financeiro",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-cad-registro-fundo-classe",

    title: "FI - CAD - Registro (Fundo, Classe e Subclasse)",
    description:
      "Cadastro de Fundos (registro de fundo/classe/subclasse). Publicação no Storage por dataset, com manifesto próprio.",

    manifest_path: "cvm/fi/cad/registro_fundo_classe/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-cad",
  },

  {
    id: "cvm_fi_cad_nao_adaptados_rcvm175",

    category_title: "Mercado financeiro",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-cad-nao-adaptados-rcvm175",

    title: "FI - CAD - Não adaptados RCVM175",
    description:
      "Fundos não adaptados à RCVM 175. Publicação no Storage por dataset, com manifesto próprio.",

    manifest_path: "cvm/fi/cad/nao_adaptados_rcvm175/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-cad",
  },

  {
    id: "cvm_fi_cad_icvm555_hist",

    category_title: "Mercado financeiro",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-cad-icvm555-hist",

    title: "FI - CAD - ICVM 555 (Histórico)",
    description:
      "Histórico (ICVM 555). Publicação no Storage por dataset, com manifesto próprio.",

    manifest_path: "cvm/fi/cad/icvm555_hist/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-cad",
  },

  // FII (Fundos de Investimento Imobiliário)
  {
    id: "cvm_fii_doc_inf_trimestral",

    category_title: "Mercado financeiro",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fii-informe-trimestral",

    title: "FII - DOC - Informe Trimestral (Estruturado)",
    description:
      "Informes trimestrais estruturados de FII. Publicação no Storage por dataset, com manifesto próprio.",

    manifest_path: "cvm/fii/doc/inf_trimestral/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fii-doc-inf_trimestral",
  },
];
