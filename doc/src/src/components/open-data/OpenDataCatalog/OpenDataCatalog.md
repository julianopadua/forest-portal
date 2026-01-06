# 📄 Documentação do módulo **src/components/open-data/OpenDataCatalog.tsx**

---

## 1. Visão geral e responsabilidade  

O componente **`OpenDataCatalog`** renderiza, de forma hierárquica, o catálogo de datasets de dados abertos disponibilizados pelo portal.  
Ele:

* Agrupa os datasets por **categoria → sub‑categoria → fonte**.  
* Permite busca textual (`query`) com normalização Unicode e case‑insensitive.  
* Carrega, em paralelo, o *manifest* de cada dataset para exibir a data de geração ou o estado de erro.  
* Oferece interatividade de expansão/contração de categorias e fontes, bem como links para a página de download de cada dataset.

---

## 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Papel |
|------------------|-------|
| **UI / Presentation** | Componente React que compõe a interface de navegação do catálogo. |
| **Domain: Open Data** | Manipula objetos do domínio `OpenDataDataset` e `OpenDataManifest` definidos em `@/lib/openData/*`. |
| **Util / Helpers** | Contém funções auxiliares (`normalize`, `formatDateOnly`, `runWithConcurrency`) usadas apenas neste componente. |

O módulo não contém lógica de negócio complexa nem acesso a serviços externos além da leitura de manifests via `fetch`.

---

## 3. Interfaces e exports  

```tsx
// Export default
export default function OpenDataCatalog({
  query,
}: {
  /** Texto digitado pelo usuário na barra de busca */
  query: string;
}): JSX.Element;
```

*Não há outras exportações nomeadas.*  

O componente aceita apenas a prop `query` (string) e devolve a árvore de UI descrita acima.

---

## 4. Dependências e acoplamentos  

| Origem | Tipo | Motivo |
|--------|------|--------|
| `next/link` | **externa (Next.js)** | Navegação cliente‑side para a página de downloads. |
| `react` (`useEffect`, `useMemo`, `useState`) | **externa (React)** | Gerenciamento de estado e ciclos de vida. |
| `@/lib/openData/catalog` | **interna** | Constante `OPEN_DATA_DATASETS` e tipo `OpenDataDataset` que descrevem os datasets disponíveis. |
| `@/lib/openData/types` | **interna** | Tipo `OpenDataManifest` (estrutura esperada do arquivo JSON remoto). |
| `@/lib/openData/publicUrls` | **interna** | Função `getPublicObjectUrl` que converte o caminho do manifest em URL pública. |

> **Observação:** Não há importações de estilos, contextos ou outros componentes UI.

---

## 5. Leitura guiada do código (top‑down)

1. **Cabeçalho e imports** – habilita o modo cliente (`"use client"`), traz dependências listadas acima.  

2. **Tipos auxiliares**  
   * `DatasetMetaState` – representa o estado de carregamento de cada manifest (`idle`, `loading`, `error`, `ready`).  
   * Estruturas de árvore (`SourceNode`, `SubCategoryNode`, `CategoryNode`) usadas para montar a hierarquia visual.  

3. **Funções utilitárias**  

   ```tsx
   function normalize(s: string) {
     return (s || "")
       .toLowerCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .trim();
   }
   ```

   *Remove acentos, converte para minúsculas e elimina espaços excessivos.*  

   ```tsx
   function formatDateOnly(iso: string) {
     const d = new Date(iso);
     if (Number.isNaN(d.getTime())) return "-";
     return d.toLocaleDateString("pt-BR");
   }
   ```

   *Formata data ISO para `dd/mm/aaaa` ou devolve “-” em caso inválido.*  

   ```tsx
   async function runWithConcurrency<T>(
     items: T[],
     limit: number,
     fn: (item: T) => Promise<void>
   ) {
     const queue = items.slice();
     const workers = Array.from({ length: Math.max(1, limit) }, async () => {
       while (queue.length) {
         const item = queue.shift();
         if (!item) return;
         await fn(item);
       }
     });
     await Promise.all(workers);
   }
   ```

   *Executa `fn` em até `limit` workers simultâneos, garantindo que a carga de manifests seja paralelizada sem sobrecarregar a rede.*  

4. **Constante de ordenação fixa** – `CATALOG_CATEGORIES_ORDER` garante a presença e a ordem desejada das categorias principais.  

5. **Componente `OpenDataCatalog`**  

   * **Estado local**  
     - `openCats` / `openSources`: objetos `Record<string, boolean>` que controlam a expansão de categorias e fontes.  
     - `states`: mapa de `DatasetMetaState` inicializado com `idle` para cada dataset.  

   * **Efeito de carregamento (`useEffect`)**  
     - Executa `runWithConcurrency` com limite 6 para buscar, em paralelo, o manifest de cada dataset.  
     - Atualiza `states` para `loading`, `ready` (com `generated_at`) ou `error` (com mensagem).  
     - Usa flag `cancelled` para evitar atualizações após desmontagem.  

   * **Construção da árvore (`useMemo`)**  
     - Normaliza a `query` e filtra `OPEN_DATA_DATASETS` caso haja busca.  
     - Cria um `Map` tridimensional (`catMap`) para agrupar por categoria → sub‑categoria → fonte.  
     - Converte o mapa em array de `CategoryNode`, ordenando alfabeticamente ou segundo `CATALOG_CATEGORIES_ORDER` quando não há busca.  
     - Insere categorias ausentes (ex.: “Mercado de commodities”) para garantir presença no UI.  

   * **Efeito de expansão automática em busca**  
     - Quando `query` não está vazia, marca todas as categorias e fontes como abertas, facilitando a visualização dos resultados.  

   * **Funções de toggle** – `toggleCat` e `toggleSource` invertem o estado de expansão correspondente.  

   * **Renderização**  
     - Percorre `tree` e gera seções colapsáveis por categoria.  
     - Dentro de cada categoria, exibe sub‑categorias, fontes e, finalmente, a lista de datasets.  
     - Cada dataset mostra título, descrição, data de atualização (ou estado) e um `<Link>` para a página de downloads.  

6. **Fallback** – Caso `tree` esteja vazio, exibe mensagem “Nenhum dataset encontrado”.

---

## 6. Fluxo de dados / estado / eventos  

| Etapa | Origem | Destino | Descrição |
|------|--------|---------|-----------|
| **Inicialização** | `OPEN_DATA_DATASETS` (importado) | `states` (useState) | Cada dataset recebe estado `{status: "idle"}`. |
| **Busca de manifests** | `runWithConcurrency` → `fetch` | `states` | Atualiza para `loading` → `ready` (com `generated_at`) ou `error`. |
| **Filtragem** | `query` (prop) | `tree` (useMemo) | Normaliza e filtra datasets; agrupa em árvore. |
| **Expansão automática** | `query` + `tree` | `openCats` / `openSources` | Marca todas as chaves como `true` quando há busca. |
| **Interação do usuário** | Clique em botões de categoria/fonte | `openCats` / `openSources` | Alterna booleanos, disparando re‑render. |
| **Renderização** | Estado React (`tree`, `openCats`, `openSources`, `states`) | JSX | Produz a UI final. |

Os efeitos (`useEffect`) são dependentes apenas de `query` (para expansão) e da montagem inicial (para carregamento dos manifests). Não há ciclos de atualização recursivos.

---

## 7. Conexões com outros arquivos do projeto  

| Arquivo | Tipo de vínculo | Comentário |
|---------|----------------|------------|
| `@/lib/openData/catalog.ts` | **Importação** – fornece `OPEN_DATA_DATASETS` e o tipo `OpenDataDataset`. |
| `@/lib/openData/types.ts` | **Importação** – define `OpenDataManifest`. |
| `@/lib/openData/publicUrls.ts` | **Importação** – exporta `getPublicObjectUrl` usado para construir a URL do manifest. |
| `pages/open-data/[source_id]/[slug].tsx` (ou similar) | **Link de navegação** – o `<Link>` gerado aponta para esta rota. |
| `components/...` (nenhum importado) | **Isolamento** – o componente não depende de outros componentes UI. |

> **Nota:** Não há exportações que outros módulos consumam diretamente deste arquivo.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Área | Observação | Recomendações |
|------|------------|---------------|
| **Concurrência de fetch** | `runWithConcurrency` usa `Array.from` para criar workers; se `OPEN_DATA_DATASETS` crescer muito, a fila pode consumir memória. | Considerar uso de `AbortController` por request e limitar ainda mais o número de workers dinamicamente (ex.: baseado em `navigator.hardwareConcurrency`). |
| **Tratamento de erros** | O erro capturado é convertido em string genérica (`e?.message`). Não há fallback visual específico além de “Erro”. | Exibir tooltip ou mensagem mais detalhada; possibilitar retry individual. |
| **Cache** | `fetch` usa `{ cache: "no-store" }`, forçando recarregamento a cada montagem. | Avaliar uso de `cache: "force-cache"` ou `stale-while-revalidate` para melhorar performance, respeitando a necessidade de dados atualizados. |
| **Acessibilidade** | Botões usam `aria-expanded`, mas não há `aria-controls` nem IDs associados. | Adicionar `id` nos painéis colapsáveis e referenciá‑los via `aria-controls` para leitores de tela. |
| **Internacionalização** | Strings fixas em português (ex.: “Nenhum dataset encontrado”). | Centralizar textos em um arquivo de i18n para facilitar futuras traduções. |
| **Teste unitário** | Funções auxiliares (`normalize`, `runWithConcurrency`) são boas candidatas a testes isolados. | Criar testes Jest/React Testing Library para validar comportamento de filtragem e concorrência. |
| **Separação de responsabilidades** | O componente mistura lógica de carregamento, transformação de dados e UI. | Extrair a construção da árvore (`tree` memo) e o carregamento de manifests para hooks customizados (`useDatasetManifests`, `useCatalogTree`). |
| **Performance de render** | Cada mudança em `states` recria todo o objeto `states` (spread). Pode causar re‑renderizações desnecessárias de toda a árvore. | Utilizar `useReducer` ou `immer` para atualizar apenas a entrada afetada, reduzindo renderizações. |

--- 

*Esta documentação reflete o comportamento observável a partir do código fornecido. Caso haja lógica adicional em módulos importados que altere o fluxo descrito, ela deverá ser incorporada em revisões futuras.*
