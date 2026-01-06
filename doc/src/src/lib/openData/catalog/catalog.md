## 1. Visão geral e responsabilidade  

O módulo **`src/lib/openData/catalog.ts`** define o contrato de dados (`OpenDataDataset`) que descreve um conjunto de dados abertos disponibilizado pelo projeto e fornece a lista estática `OPEN_DATA_DATASETS` contendo os metadados de todos os datasets suportados. Sua responsabilidade é centralizar a descrição de catálogos (categoria, sub‑categoria, fonte, etc.) e os caminhos de acesso (manifesto no bucket público e URL da fonte oficial), permitindo que outras partes da aplicação consultem esses metadados de forma tipada.

---

## 2. Posicionamento na arquitetura  

- **Camada:** *Domínio / Biblioteca de dados* – o arquivo faz parte da camada de domínio que modela o conceito de “dataset aberto”.  
- **Escopo:** Não contém lógica de UI, nem de infraestrutura (ex.: acesso a rede).  
- **Tipo de módulo:** *Utilitário de catálogo* – fornece apenas tipos e dados estáticos, sem dependências externas.

---

## 3. Interfaces e exports  

| Export | Tipo | Descrição |
|--------|------|-----------|
| `OpenDataDataset` | `type` | Estrutura tipada que representa os metadados de um dataset. Campos: `id`, `category_title`, `subcategory_title`, `source_id`, `source_title`, `slug`, `title`, `description`, `manifest_path`, `source_url`. |
| `OPEN_DATA_DATASETS` | `const` | Array imutável (`readonly`) de objetos que obedecem a `OpenDataDataset`. Cada elemento corresponde a um dataset disponível. |

```ts
export type OpenDataDataset = { /* ... */ };
export const OPEN_DATA_DATASETS: OpenDataDataset[] = [ /* ... */ ];
```

---

## 4. Dependências e acoplamentos  

- **Internas:** Nenhuma importação de outros módulos. O arquivo é autônomo.  
- **Externas:** Não há dependências de bibliotecas de terceiros; utiliza apenas tipos nativos do TypeScript.  
- **Acoplamento:** Baixo – a única ligação externa ocorre quando outros módulos importam `OpenDataDataset` ou `OPEN_DATA_DATASETS`.

---

## 5. Leitura guiada do código (top‑down)  

1. **Definição do tipo `OpenDataDataset`** – descreve todos os atributos necessários para identificar e localizar um dataset.  
   - Comentários inline explicam a finalidade de cada campo (ex.: “Navegação/organização (catálogo)”).  
2. **Declaração de `OPEN_DATA_DATASETS`** – array literal preenchido com objetos que seguem estritamente a interface acima.  
   - Os objetos são agrupados visualmente por categoria/sub‑categoria usando comentários de separação (`// =========================================`).  
   - Cada objeto contém valores de exemplo reais (ex.: `id: "cvm_fi_inf_diario"`).  
3. **Imutabilidade implícita** – embora o array seja declarado como `const`, não há uso de `Object.freeze`; a imutabilidade depende da disciplina de consumo.  

**Decisões de implementação relevantes**  
- Optou‑se por manter os metadados em código fonte ao invés de carregá‑los dinamicamente, garantindo disponibilidade em tempo de compilação e eliminação de I/O.  
- Os campos `manifest_path` e `source_url` são strings absolutas/relativas que permitem a construção de URLs de acesso sem lógica adicional.

---

## 6. Fluxo de dados / estado / eventos  

Não há fluxo de dados ativo nem gerenciamento de estado. O módulo expõe apenas **dados estáticos**; o consumo ocorre por leitura direta (`import { OPEN_DATA_DATASETS } from ".../catalog"`). Não há eventos ou callbacks associados.

---

## 7. Conexões com outros arquivos do projeto  

- **Importado por:** *Nenhum* (não há referências encontradas no código-base atual).  
- **Importa:** *Nenhum* (arquivo autônomo).  

> Caso futuros módulos precisem consultar o catálogo, deverão importar `OPEN_DATA_DATASETS` ou o tipo `OpenDataDataset` a partir deste caminho.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Imutabilidade do array** | O array pode ser modificado em tempo de execução, introduzindo inconsistências. | Exportar como `readonly OpenDataDataset[]` ou aplicar `Object.freeze` ao array e aos objetos internos. |
| **Escalabilidade** | Cada novo dataset exige alteração de código e recompilação. | Considerar migrar os metadados para um arquivo JSON/YAML externo e carregá‑lo dinamicamente (ex.: via `import` ou fetch). |
| **Validação de campos** | Não há verificação automática de integridade (ex.: URLs válidas, caminhos existentes). | Implementar uma função de validação que percorra `OPEN_DATA_DATASETS` e lance erros em caso de valores inválidos. |
| **Documentação de origem** | Comentários explicam apenas exemplos; a origem dos dados pode mudar. | Incluir campo opcional `last_updated?: string` ou `version?: string` para rastrear atualizações. |
| **Testabilidade** | Não há testes unitários que garantam a conformidade da estrutura. | Criar testes que confirmem que todos os objetos satisfazem `OpenDataDataset` e que os caminhos apontam para arquivos existentes no bucket de teste. |

---
