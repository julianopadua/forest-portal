#!/usr/bin/env node
/**
 * Lê anp_catalog_compact.json na raiz do repo e gera src/lib/openData/anpDatasets.generated.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const jsonPath = path.join(root, "anp_catalog_compact.json");
const outPath = path.join(root, "src/lib/openData/anpDatasets.generated.ts");

const raw = fs.readFileSync(jsonPath, "utf8");
const data = JSON.parse(raw);

if (!data.datasets || !Array.isArray(data.datasets)) {
  console.error("JSON inválido: falta datasets[]");
  process.exit(1);
}

function idFromSlug(slug) {
  return `anp_${String(slug).replace(/-/g, "_")}`;
}

/**
 * Mercado de commodities: segment_title "Energia" + subcategoria curta (sem repetir Energia).
 * Outros: sem segment_title.
 */
const PLACEMENT_BY_SLUG = {
  "tancagem-do-abastecimento-nacional-de-combustiveis": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Abastecimento e mercado",
  },
  "serie-historica-de-precos-de-combustiveis-e-de-glp": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Abastecimento e mercado",
  },
  "rodadas-de-licitacoes-de-petroleo-e-gas-natural": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "resultado-de-poco": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "relacao-de-concessionarios": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "registro-de-leos-e-graxas-lubrificantes": {
    category_title: "Outros",
    subcategory_title: "Comércio e serviços",
  },
  "programa-de-monitoramento-dos-lubrificantes-pml": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Lubrificantes",
  },
  "producao-de-petroleo-e-gas-natural-por-estado-e-localizacao": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "producao-de-petroleo-e-gas-natural-por-poco": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "producao-de-biocombustiveis": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Biocombustíveis e renováveis",
  },
  "processamento-de-petroleo-e-producao-de-derivados": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "previso-de-investimentos-exploratrios": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Petróleo e gás",
  },
  "prestadores-de-servicos-de-apoio-administrativo": {
    category_title: "Outros",
    subcategory_title: "Administração",
  },
  "pontos-de-abastecimento-autorizados": {
    category_title: "Mercado de commodities",
    segment_title: "Energia",
    subcategory_title: "Abastecimento e mercado",
  },
  "pesquisa-e-desenvolvimento-e-inovacao-pdi": {
    category_title: "Outros",
    subcategory_title: "Pesquisa e desenvolvimento",
  },
};

function placementForSlug(slug) {
  if (PLACEMENT_BY_SLUG[slug]) return PLACEMENT_BY_SLUG[slug];
  return {
    category_title: "Outros",
    subcategory_title: "Geral",
  };
}

const lines = [];
lines.push("// Gerado por scripts/generate-anp-catalog.mjs — não editar manualmente.");
lines.push('import type { OpenDataDataset } from "./openDataDataset";');
lines.push("");
lines.push('export const ANP_CATALOG_DATASET_PATH = "anp/catalog/anp_catalog_compact.json";');
lines.push("");
lines.push("export const ANP_OPEN_DATA_DATASETS: OpenDataDataset[] = [");

for (const ds of data.datasets) {
  const slug = ds.slug;
  if (!slug) continue;
  const id = idFromSlug(slug);
  const p = placementForSlug(slug);
  const sourceUrl = `https://dados.gov.br/dados/conjuntos-dados/${slug}`;

  lines.push("  {");
  lines.push(`    id: ${JSON.stringify(id)},`);
  lines.push(`    category_title: ${JSON.stringify(p.category_title)},`);
  if (p.segment_title) {
    lines.push(`    segment_title: ${JSON.stringify(p.segment_title)},`);
  }
  lines.push(`    subcategory_title: ${JSON.stringify(p.subcategory_title)},`);
  lines.push(`    source_id: "anp",`);
  lines.push(`    source_title: "ANP",`);
  lines.push(`    slug: ${JSON.stringify(slug)},`);
  lines.push(`    title: ${JSON.stringify(ds.title || slug)},`);
  lines.push(`    description: ${JSON.stringify((ds.notes_plain || "").replace(/\s+/g, " ").trim().slice(0, 800))},`);
  lines.push(`    manifest_path: ANP_CATALOG_DATASET_PATH,`);
  lines.push(`    source_url: ${JSON.stringify(sourceUrl)},`);
  lines.push("  },");
}

lines.push("];");
lines.push("");

fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${outPath} (${data.datasets.length} datasets)`);
