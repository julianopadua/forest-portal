# src/lib/database.types.ts

## 1. Visão geral e responsabilidade  
Este módulo define os tipos TypeScript que descrevem a estrutura de dados persistida no banco de dados da aplicação. Ele contém:

* **`Json`** – tipo recursivo que representa valores JSON válidos.  
* **`Database`** – interface que modela o esquema da camada pública do banco, incluindo tabelas, linhas, e os contratos de *insert* e *update*.

Essas definições são usadas para garantir tipagem estática nas interações com o banco (por exemplo, ao construir queries ou ao validar payloads).

---

## 2. Onde este arquivo se encaixa na arquitetura  
- **Camada:** *Data Access / Persistence* (parte da camada de infraestrutura).  
- **Domínio:** Não pertence a um domínio de negócio específico; descreve o contrato genérico do banco de dados.  
- **Tipo:** Utilitário de tipagem (type definitions) compartilhado entre repositórios, serviços e, eventualmente, camada de API.

---

## 3. Interfaces e exports (o que ele expõe)

| Export | Descrição |
|--------|-----------|
| `type Json` | União recursiva que aceita todos os valores válidos em JSON, incluindo objetos e arrays. |
| `interface Database` | Estrutura tipada que reflete o esquema da base de dados pública, contendo a tabela `profiles` com sub‑tipos `Row`, `Insert` e `Update`. |

Esses exports são **named** e podem ser importados individualmente:

```ts
import { Json, Database } from '@/lib/database.types';
```

---

## 4. Dependências e acoplamentos  

| Tipo | Detalhe |
|------|---------|
| **Internas** | Nenhuma importação de outros módulos. O arquivo é autônomo. |
| **Externas** | Depende apenas de tipos nativos do TypeScript (`string`, `number`, `boolean`, `null`). Não há dependências de bibliotecas de terceiros. |
| **Acoplamento** | Baixo acoplamento: a interface descreve apenas a forma dos dados, sem lógica de acesso ou implementação. |

---

## 5. Leitura guiada do código (top‑down)

1. **Tipo `Json`**  
   ```ts
   export type Json =
     | string
     | number
     | boolean
     | null
     | { [key: string]: Json | undefined }
     | Json[];
   ```
   - **Recursividade:** permite objetos aninhados e arrays de valores JSON.  
   - **`undefined`** incluído nos valores de objeto para suportar propriedades opcionais ao serializar.

2. **Interface `Database`**  
   ```ts
   export interface Database {
     public: {
       Tables: {
         profiles: {
           Row: { … };
           Insert: { … };
           Update: { … };
         };
       };
     };
   }
   ```
   - **Namespace `public`** reflete o schema padrão do Supabase/PostgreSQL (ou similar).  
   - **`Tables.profiles`** contém três sub‑tipos:
     * **`Row`** – representação completa de uma linha retornada pelo SELECT; todas as colunas são obrigatórias, exceto `updated_at` que pode ser `null`.
     * **`Insert`** – contrato para criação de registros; `id` é obrigatório, demais campos são opcionais (`?`) e aceitam `null`.
     * **`Update`** – contrato para atualização parcial; todas as propriedades são opcionais, permitindo *patch* de campos específicos.

   - **Decisão de implementação:** usar tipos separados para *insert* e *update* evita que o compilador exija campos que não são necessários em operações parciais, reduzindo erros de tipagem.

---

## 6. Fluxo de dados/estado/eventos (se aplicável)  
O módulo não contém lógica de execução; ele apenas descreve a forma dos dados que circulam entre:

1. **Camada de repositório** – ao chamar `insert`, `update` ou `select` contra a base.  
2. **Camada de serviço** – ao validar ou transformar payloads antes de persistir.  
3. **Camada de API** – ao tipar respostas JSON enviadas ao cliente.

Assim, o fluxo de dados depende exclusivamente dos consumidores desses tipos.

---

## 7. Conexões com outros arquivos do projeto  

- **Importado por:** *(nenhum arquivo atualmente importa este módulo; pode ser usado por repositórios ou serviços que interajam com o banco).*  
- **Exporta para:** qualquer módulo que precise tipar interações com a base de dados, por exemplo `src/lib/repositories/profile.repository.ts` (hipotético).  

> **Observação:** Caso novos módulos passem a consumir `Database`, adicione links de documentação aqui, seguindo o padrão `src/lib/repositories/profile.repository.ts`.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Ausência de documentação de campos** | Dificulta a compreensão de semântica (ex.: diferença entre `username` e `full_name`). | Incluir comentários JSDoc em cada propriedade, descrevendo restrições de negócio. |
| **Tipos `null` vs `undefined`** | Mistura pode gerar ambiguidade ao validar payloads. | Padronizar uso (ex.: `null` para valores explicitamente vazios, `undefined` apenas para campos ausentes). |
| **Escalabilidade do schema** | Atualmente cobre apenas a tabela `profiles`. | Estruturar o arquivo para suportar múltiplas tabelas (ex.: criar sub‑namespace `Tables.{nome}`) ou gerar automaticamente a partir de migrações. |
| **Sincronização com o banco real** | Alterações no schema do DB não refletidas aqui podem gerar erros de compilação ou runtime. | Automatizar geração de tipos a partir do introspection do banco (ex.: `supabase gen types typescript`). |
| **Exportação única** | Exporta dois símbolos; pode ser conveniente agrupar em um único namespace (`export namespace DB { … }`). | Avaliar conveniência de namespace para melhorar organização em projetos maiores. |

---
