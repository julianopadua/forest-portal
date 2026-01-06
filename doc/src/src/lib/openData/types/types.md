# 📄 Documentação – `src/lib/openData/types.ts`

---

## 1. Visão geral e responsabilidade
Este módulo define **tipos TypeScript** que descrevem a estrutura dos artefatos produzidos pelos scrapers de dados abertos (open data).  
Ele fornece:

* **`OpenDataItem`** – representação de um arquivo de dados individual.  
* **`OpenDataMeta`** – metadados globais do dataset (arquivo de dicionário ou informações de release).  
* **`OpenDataManifest`** – contrato do arquivo `manifest.json` que agrupa itens e metadados de um dataset.

Esses tipos são usados como contrato de comunicação entre os scrapers, o armazenamento em bucket e eventuais consumidores internos (ex.: geração de relatórios, APIs).

---

## 2. Onde este arquivo se encaixa na arquitetura
| Camada | Domínio | Propósito |
|--------|---------|-----------|
| **Domínio / Core** | *Open Data* | Modela o domínio de datasets abertos, independente de UI ou camada de infraestrutura. |
| **Util / Shared Types** | Compartilhado entre scrapers, jobs de ingestão e serviços que consomem manifests. |

O arquivo **não contém lógica de execução**; ele apenas declara tipos que são importados por outros módulos.

---

## 3. Interfaces e exports (o que ele expõe)

| Export | Descrição |
|--------|-----------|
| `OpenDataItem` | Tipo que descreve um arquivo de dados (nome, hash, tamanho, URLs, período, etc.). |
| `OpenDataMeta` | Tipo que descreve metadados globais; aceita campos opcionais e propriedades arbitrárias (`[key: string]: any`). |
| `OpenDataManifest` | Tipo que representa o manifesto completo de um dataset, contendo `dataset_id`, `title`, `items` e `meta`. |

Todos os três são **exportados** (`export type`) e podem ser importados por qualquer módulo TypeScript do projeto.

---

## 4. Dependências e acoplamentos (internos e externos)

| Tipo | Detalhe |
|------|---------|
| **Internas** | Nenhuma importação de outros módulos (`// (nenhum)`). O arquivo é autônomo. |
| **Externas** | Depende apenas do runtime TypeScript; não há dependências de bibliotecas externas. |
| **Acoplamento** | Baixo acoplamento: os tipos são *plain objects* sem métodos, facilitando a serialização/deserialização (JSON). |

---

## 5. Leitura guiada do código (top‑down)

### 5.1 `OpenDataItem`

```ts
export type OpenDataItem = {
  kind: "data";
  period: string;       // "YYYY-MM", "YYYY", "Atual" ou data ISO
  filename: string;
  sha256: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  source_url: string;
  title?: string;        // opcional – nome amigável
  release_time?: string; // opcional – horário de publicação
};
```

* **Invariantes**  
  * `kind` é sempre a string literal `"data"` – permite *type‑guard* simples.  
  * `period` segue convenções de data (ex.: `"2023-07"`), mas o tipo permanece `string` para flexibilidade.  

* **Decisões de implementação**  
  * Campos de hash (`sha256`) e tamanho (`size_bytes`) são incluídos para verificação de integridade.  
  * URLs são armazenadas tanto para acesso público quanto para referência à origem (`source_url`).  

### 5.2 `OpenDataMeta`

```ts
export type OpenDataMeta = {
  kind: "meta" | "metadata";
  filename?: string;
  sha256?: string;
  size_bytes?: number;
  storage_path?: string;
  public_url?: string;
  source_url?: string;
  last_release_iso?: string;
  next_release_iso?: string;
  week_ending?: string;
  [key: string]: any;   // permite extensões futuras
};
```

* **Invariantes**  
  * `kind` aceita duas literais, facilitando diferenciação entre “meta” (arquivo) e “metadata” (informação textual).  

* **Decisões de implementação**  
  * Todos os campos são opcionais, pois o mesmo tipo cobre diferentes fontes de metadados (dicionário de dados, datas de release, etc.).  
  * O índice de assinatura (`[key: string]: any`) permite que scrapers adicionem atributos específicos sem quebrar a tipagem.

### 5.3 `OpenDataManifest`

```ts
export type OpenDataManifest = {
  dataset_id: string;
  title: string;
  source_dataset_url: string;
  generated_at: string; // ISO8601
  bucket_prefix: string;
  items: OpenDataItem[];
  meta: OpenDataMeta | null;
};
```

* **Invariantes**  
  * `generated_at` deve ser ISO‑8601, garantindo ordenação lexical e compatibilidade com parsers padrão.  
  * `items` é um array de `OpenDataItem`; a presença de pelo menos um item não é imposta pelo tipo, mas costuma ser esperada.  

* **Decisões de implementação**  
  * `meta` pode ser `null` quando não há metadados associados ao dataset.  
  * `bucket_prefix` indica o caminho base no bucket de armazenamento, facilitando a construção de `storage_path` e `public_url` nos itens.

---

## 6. Fluxo de dados / estado / eventos (se aplicável)

1. **Scraper** coleta arquivos e gera objetos que obedecem a `OpenDataItem`.  
2. **Scraper** (ou processo de preparação) cria um objeto `OpenDataMeta` quando houver dicionário ou informações de release.  
3. **Manifest Generator** agrega `items` e `meta` em um `OpenDataManifest`, adiciona metadados de geração (`generated_at`, `bucket_prefix`) e persiste como `manifest.json`.  
4. Consumidores (APIs, jobs de análise) leem `manifest.json`, deserializam para `OpenDataManifest` e utilizam os campos conforme necessidade.

Não há eventos internos ao módulo; ele apenas descreve a forma dos objetos que circulam entre processos.

---

## 7. Conexões com outros arquivos do projeto

- **Nenhum módulo importa este arquivo** no momento (`(nenhum)`), indicando que ele ainda não está integrado ou que as importações são dinâmicas/implícitas em scripts de build.  
- **Potenciais consumidores**: scrapers em `src/lib/openData/scrapers/*`, jobs de ingestão em `src/jobs/*`, APIs em `src/api/*`. Quando integrados, as importações deverão seguir o padrão:

```ts
import type { OpenDataItem, OpenDataMeta, OpenDataManifest } from '@/lib/openData/types';
```

*(Os caminhos acima são exemplos; ajuste conforme alias de módulo configurado no projeto.)*

---

## 8. Pontos de atenção, riscos e melhorias recomendadas

| Item | Descrição | Ação recomendada |
|------|-----------|------------------|
| **Validação de campos** | Todos os campos são tipados como `string` ou `number`, mas não há validação de formato (ex.: `period`, `generated_at`). | Implementar funções de validação (ex.: `isValidISODate`, `isValidPeriod`) nos scrapers ou em um utilitário de validação. |
| **Campos opcionais** | `OpenDataMeta` aceita qualquer chave adicional (`[key: string]: any`). Isso pode mascarar erros de digitação. | Avaliar a necessidade de um tipo genérico mais restrito ou usar `Record<string, unknown>` com validação explícita. |
| **Consistência de `kind`** | `OpenDataItem.kind` é literal `"data"`; `OpenDataMeta.kind` aceita duas literais. | Documentar claramente a diferença semântica entre `"meta"` e `"metadata"` para evitar confusão. |
| **Documentação de unidades** | `size_bytes` está em bytes, mas não há indicação de limites ou conversões. | Incluir comentário de unidade e, se necessário, helper para formatação legível (KB/MB/GB). |
| **Integração futura** | Ausência de importações indica que o módulo ainda não está em uso. | Criar testes unitários que importem os tipos e verifiquem a serialização/deserialização de exemplos reais de manifest. |
| **Versionamento** | Não há campo de versão no manifesto. | Considerar adicionar `manifest_version` para suportar evoluções de esquema. |

--- 

*Esta documentação foi gerada com base exclusivamente no código presente em `src/lib/openData/types.ts`. Qualquer comportamento adicional que dependa de outros módulos não está contemplado aqui.*
