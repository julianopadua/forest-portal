// src/lib/openData/catalog.ts

export type OpenDataDataset = {
  id: string;

  // Navegação/organização (catálogo)
  category_title: string;    // ex: "Mercado financeiro" ou "Mercado de commodities"
  subcategory_title: string; // ex: "Fundos" ou "Petróleo"
  source_id: string;         // ex: "cvm" ou "eia"
  source_title: string;      // ex: "CVM" ou "EIA"
  slug: string;              // ex: "fi-informe-diario"

  // Conteúdo
  title: string;
  description: string;

  // Infra
  manifest_path: string;     // path dentro do bucket público
  source_url: string;        // link para a fonte oficial
};

export const OPEN_DATA_DATASETS: OpenDataDataset[] = [
  // =========================================
  // Mercado financeiro -> Fundos -> CVM
  // =========================================
  {
    id: "cvm_fi_inf_diario",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-informe-diario",
    title: "FI - Informe Diário",
    description: "Informes diários de fundos de investimento (arquivos mensais em ZIP) + dicionário de dados (TXT).",
    manifest_path: "cvm/fi/inf_diario/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-doc-inf_diario",
  },
  {
    id: "cvm_fi_doc_extrato",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-doc-extrato",
    title: "FI - DOC - Extrato",
    description: "Extrato das informações de Fundos de Investimento: versão Atual + recortes anuais (CSV) + dicionário (TXT).",
    manifest_path: "cvm/fi/doc/extrato/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-doc-extrato",
  },
  // --- NOVO ---
  {
    id: "cvm_fi_doc_entrega",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-doc-entrega",
    title: "FI - DOC - Entrega",
    description: "Metadados de entrega de documentos periódicos e eventuais de fundos de investimento.",
    // Baseado no bucket_prefix: cvm/fi/doc/entrega
    manifest_path: "cvm/fi/doc/entrega/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-doc-entrega",
  },
  {
    id: "cvm_fi_cad_registro_fundo_classe",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-cad-registro-fundo-classe",
    title: "FI - CAD - Registro (Fundo, Classe e Subclasse)",
    description: "Cadastro de Fundos (registro de fundo/classe/subclasse).",
    manifest_path: "cvm/fi/cad/registro_fundo_classe/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-cad",
  },
  {
    id: "cvm_fi_cad_nao_adaptados_rcvm175",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-cad-nao-adaptados-rcvm175",
    title: "FI - CAD - Não adaptados RCVM175",
    description: "Fundos não adaptados à RCVM 175.",
    manifest_path: "cvm/fi/cad/nao_adaptados_rcvm175/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-cad",
  },
  {
    id: "cvm_fi_cad_icvm555_hist",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fi-cad-icvm555-hist",
    title: "FI - CAD - ICVM 555 (Histórico)",
    description: "Histórico (ICVM 555).",
    manifest_path: "cvm/fi/cad/icvm555_hist/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fi-cad",
  },
  {
    id: "cvm_fii_doc_inf_trimestral",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fii-informe-trimestral",
    title: "FII - DOC - Informe Trimestral (Estruturado)",
    description: "Informes trimestrais estruturados de FII.",
    manifest_path: "cvm/fii/doc/inf_trimestral/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fii-doc-inf_trimestral",
  },
  // --- NOVO ---
  {
    id: "cvm_fii_doc_inf_mensal",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fii-doc-inf-mensal",
    title: "FII - DOC - Informe Mensal (Estruturado)",
    description: "Informes mensais estruturados de FII (arquivos anuais).",
    // Baseado no bucket_prefix: cvm/fii/doc/inf_mensal
    manifest_path: "cvm/fii/doc/inf_mensal/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fii-doc-inf_mensal",
  },
  // --- NOVO ---
  {
    id: "cvm_fii_doc_inf_anual",
    category_title: "Mercado financeiro",
    subcategory_title: "Fundos",
    source_id: "cvm",
    source_title: "CVM",
    slug: "fii-doc-inf-anual",
    title: "FII - DOC - Informe Anual (Estruturado)",
    description: "Informes anuais estruturados de FII.",
    // Baseado no bucket_prefix: cvm/fii/doc/inf_anual
    manifest_path: "cvm/fii/doc/inf_anual/manifest.json",
    source_url: "https://dados.cvm.gov.br/dataset/fii-doc-inf_anual",
  },

  // =========================================
  // Mercado de commodities -> Petróleo -> EIA
  // =========================================
  {
    id: "eia_petroleum_weekly",
    category_title: "Mercado de commodities",
    subcategory_title: "Petróleo",
    source_id: "eia",
    source_title: "EIA",
    slug: "petroleum-weekly",
    title: "Weekly Petroleum Status Report",
    description: "Relatório semanal de estoques e produção nos EUA. Inclui dados publicados às 10:30 e 13:00.",
    manifest_path: "eia/petroleum_weekly/manifest.json",
    source_url: "https://www.eia.gov/petroleum/supply/weekly/",
  },
  {
    id: "eia_heating_oil_propane",
    category_title: "Mercado de commodities",
    subcategory_title: "Petróleo",
    source_id: "eia",
    source_title: "EIA",
    slug: "heating-oil-propane-prices",
    title: "Weekly Heating Oil and Propane Prices",
    description: "Preços semanais e mensais de óleo de aquecimento e propano por área (Dollars per Gallon).",
    manifest_path: "eia/heating_oil_propane/manifest.json",
    source_url: "https://www.eia.gov/dnav/pet/pet_pri_wfr_a_EPD2F_prs_dpgal_w.htm",
  },
];