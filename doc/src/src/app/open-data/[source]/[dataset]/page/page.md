# 📄 Documentação – `src/app/open-data/[source]/[dataset]/page.tsx`

---

## 1. Visão geral e responsabilidade
Este módulo implementa a **página de visualização de um dataset de dados abertos**.  
Ele:

* Busca o manifesto JSON público do dataset a partir da URL gerada por `getPublicObjectUrl`.
* Renderiza informações de catálogo (título, descrição, fonte, data de geração, etc.).
* Exibe uma tabela listando os arquivos disponíveis, com:
  * período, título/filename, tamanho formatado e link de download.
* Disponibiliza um botão “Download all” que agrupa todos os arquivos do manifesto.

A página é **assíncrona** (`export default async function`) e utiliza a API de navegação do Next 13 (`notFound`).

---

## 2. Onde este arquivo se encaixa na arquitetura
| Camada / Domínio | Papel |
|------------------|-------|
| **UI – camada de rotas** | Página Next.js (`app/.../page.tsx`) responsável por renderizar a UI do dataset. |
| **Domínio – Open Data** | Consome o catálogo (`OPEN_DATA_DATASETS`) e o manifesto (`OpenDataManifest`). |
| **Utilitário** | Usa helpers de URL (`getPublicObjectUrl`, `withDownload`) e um componente compartilhado (`DownloadAllButton`). |

Ele está localizado na rota dinâmica `[source]/[dataset]`, portanto faz parte da **interface pública** de navegação do aplicativo.

---

## 3. Interfaces e exports
| Export | Tipo | Descrição |
|--------|------|-----------|
| `default async function OpenDataDatasetPage({ params })` | **React Server Component** | Renderiza a página completa do dataset. Recebe `params` (Promise) contendo `source` e `dataset`. |
| `function formatBytes(n: number): string` | Utilitário interno | Converte bytes em string legível (B, KB, MB, GB, TB). |
| `function itemSortKey(item: any): number` | Utilitário interno | Gera chave numérica para ordenação robusta de períodos (suporta “Atual”, ISO‑date, mês e ano). |
| `function ChevronLeftIcon({ className })` | Componente interno | Ícone SVG usado no link de retorno ao catálogo. |

Nenhum outro módulo importa explicitamente este arquivo.

---

## 4. Dependências e acoplamentos
| Origem | Tipo | Motivo |
|--------|------|--------|
| `next/link` | **Framework** | Navegação cliente para a página de catálogo. |
| `next/navigation` (`notFound`) | **Framework** | Redireciona para 404 quando o dataset não existe. |
| `@/lib/openData/catalog` (`OPEN_DATA_DATASETS`) | **Domínio** | Fonte de metadados estáticos do catálogo. |
| `@/lib/openData/types` (`OpenDataManifest`) | **Domínio** | Tipo TypeScript que descreve a estrutura do manifesto. |
| `@/lib/openData/publicUrls` (`getPublicObjectUrl`, `withDownload`) | **Utilitário** | Constrói URLs públicas e adiciona cabeçalho `download`. |
| `@/components/open-data/DownloadAllButton` | **Componente UI** | Botão que dispara download em lote. |

Não há dependências externas adicionais (ex.: bibliotecas de terceiros para formatação de datas).  

**Acoplamento**: O módulo depende fortemente da forma do objeto `manifest` (campo `items`, `meta`, `generated_at`). Caso o contrato mudar, a página precisará ser ajustada.

---

## 5. Leitura guiada do código (top‑down)

1. **Imports** – traz os módulos listados acima.  
2. **`formatBytes`** – converte número de bytes em string legível; retorna “‑” para valores não‑numéricos.  
   ```tsx
   function formatBytes(n: number) {
     if (!Number.isFinite(n)) return "-";
     const units = ["B", "KB", "MB", "GB", "TB"];
     …
     return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
   }
   ```
3. **`itemSortKey`** – normaliza o campo `period` para ordenação decrescente.  
   * “Atual” → `Infinity` (sempre o mais recente).  
   * ISO‑date (`YYYY-MM-DD` ou `YYYY-MM`) → cálculo linear `y*400 + m*32 + d`.  
   * Ano (`YYYY`) → `y*400`.  
   * Caso não reconheça → `-Infinity`.  
4. **`ChevronLeftIcon`** – componente SVG simples usado no link de retorno.  
5. **`OpenDataDatasetPage`** (export default)  
   * **Parâmetros** – `params` é uma `Promise` resolvida para `{ source, dataset }`.  
   * **Busca do dataset** – filtra `OPEN_DATA_DATASETS` por `source_id` e `slug`. Se não encontrar, chama `notFound()`.  
   * **Obtenção do manifesto** –  
     ```tsx
     const url = getPublicObjectUrl(ds.manifest_path);
     const res = await fetch(url, { cache: "no-store" });
     if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar manifest (${ds.id})`);
     const manifest = (await res.json()) as OpenDataManifest;
     ```
     *`cache: "no-store"` garante que a requisição sempre obtenha a versão mais recente.*  
   * **Renderização** – estrutura principal (`<main>`).  
     * **Header** – link de volta, título, descrição, botão “Download all”.  
     * **Faixa de informações** – data de geração, link da fonte oficial, link opcional para dicionário de dados (`manifest.meta?.filename && manifest.meta?.public_url`), e badge de “Último release” se disponível.  
     * **Tabela de arquivos** – itera `manifest.items`, ordena usando `itemSortKey`, exibe:  
       - Período (`it.period`)  
       - Título ou filename (`it.title || it.filename`)  
       - Filename (monoespaçado)  
       - Tamanho formatado (`formatBytes(it.size_bytes)`)  
       - Botão de download que usa `withDownload(it.public_url, it.filename)`.  

6. **Comportamento de fallback** – Caso campos opcionais (`meta.filename`, `meta.last_release_iso`) estejam ausentes, os blocos correspondentes são omitidos, evitando erros de tempo de execução.

---

## 6. Fluxo de dados / estado / eventos
| Etapa | Origem | Transformação | Destino |
|------|--------|---------------|---------|
| **Parâmetros de rota** | Next.js (URL) | `await params` | Variáveis `source`, `dataset`. |
| **Catálogo** | Constante `OPEN_DATA_DATASETS` | `find` por `source_id`/`slug` | Objeto `ds`. |
| **Manifest** | URL pública (`getPublicObjectUrl`) | `fetch` → JSON → tipado como `OpenDataManifest` | Variável `manifest`. |
| **Renderização** | `manifest` | Mapeamento (`items.map`) → JSX | UI da tabela. |
| **Ações do usuário** | Clique nos links de download | Navegação para URL com cabeçalho `download` (via `withDownload`) | Navegador inicia download. |

Não há estado interno (nenhum `useState`/`useEffect`). Todo o processamento ocorre no servidor (React Server Component).

---

## 7. Conexões com outros arquivos do projeto
| Arquivo | Tipo de vínculo | Comentário |
|---------|----------------|------------|
| `src/lib/openData/catalog.ts` | Importação de `OPEN_DATA_DATASETS` | Lista estática de datasets; usado para validar a rota. |
| `src/lib/openData/types.ts` | Importação de `OpenDataManifest` | Define a forma esperada do manifesto JSON. |
| `src/lib/openData/publicUrls.ts` | Importação de `getPublicObjectUrl`, `withDownload` | Funções auxiliares para gerar URLs de objetos públicos e forçar download. |
| `src/components/open-data/DownloadAllButton.tsx` | Importação de componente UI | Botão que aceita array de `{ url, name }` e gera download em lote. |
| `src/app/open-data/page.tsx` (não mostrado) | Possível página de catálogo | O link “Voltar para o catálogo” aponta para `/open-data`. |

> **Nota:** Não há importações internas adicionais; o módulo é autônomo dentro da camada de rotas.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Área | Observação | Ação sugerida |
|------|------------|---------------|
| **Tipagem de `item`** | Função `itemSortKey` recebe `any`; a estrutura de `manifest.items` não está tipada explicitamente. | Definir interface `ManifestItem` (ex.: `{ period: string; title?: string; filename: string; size_bytes: number; public_url: string; }`) e usar no código. |
| **Validação de manifesto** | O código assume que `manifest.items` e `manifest.generated_at` existem. Falha de rede ou JSON inesperado lançará exceção genérica. | Implementar validação defensiva (ex.: `zod` ou checagens de propriedades) e fallback amigável. |
| **Cache** | `fetch` usa `cache: "no-store"` → sempre solicita o manifesto. Pode gerar carga desnecessária. | Avaliar política de cache (e.g., `revalidate` ou `stale-while-revalidate`) conforme requisitos de frescor. |
| **Acessibilidade** | Links de download não possuem `aria-label` descrevendo o arquivo. | Adicionar `aria-label` como `Download ${it.filename}`. |
| **Internacionalização** | Datas são formatadas com `toLocaleDateString("pt-BR")`. Caso a aplicação suporte outros idiomas, isso será limitante. | Centralizar formatação de data em utilitário configurável por locale. |
| **Ordenação de períodos** | Algoritmo `itemSortKey` usa multiplicadores arbitrários (400, 32). Funciona para os formatos atuais, mas pode falhar com novos padrões (ex.: trimestre). | Documentar claramente a lógica e considerar uso de biblioteca de data (`date-fns`) para maior robustez. |
| **SEO** | Página é um Server Component, mas não define `<title>` ou meta tags. | Incluir `metadata` export (`export const metadata = { title: ds.title, description: ds.description }`). |
| **Testabilidade** | Funções auxiliares (`formatBytes`, `itemSortKey`) não têm testes unitários. | Criar testes unitários (Jest) cobrindo casos limites (bytes = 0, valores não‑numéricos, períodos “Atual”, formatos inválidos). |

--- 

*Documentação gerada em conformidade com as diretrizes solicitadas.*
