# 📄 Documentação – `src/i18n/dictionaries.ts`

---

## 1. Visão geral e responsabilidade  

Este módulo centraliza **todos os textos estáticos** (strings) utilizados pela aplicação, organizados por *locale* (`pt` | `en`). Ele define a estrutura tipada (`Dict`) que descreve cada seção de UI (common, footer, marketing, explore, join) e fornece a constante `dictionaries` contendo as traduções reais.  

Objetivo principal: garantir **coerência tipográfica** e **facilidade de manutenção** das mensagens multilíngues, servindo como fonte única de verdade para o provedor de internacionalização (`I18nProvider`).

---

## 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Papel |
|------------------|-------|
| **Camada de Dados / Configuração** | Armazena o *catálogo* de textos (dados de UI) em formato estático. |
| **Domínio de Internacionalização (i18n)** | Fornece o dicionário consumido por `src/i18n/I18nProvider.tsx`. |
| **Utilitário de Tipagem** | Exporta tipos (`Locale`, `Dict`) que são reutilizados por outros módulos para garantir consistência. |

Não contém lógica de UI nem de estado; atua como **recurso de leitura‑apenas**.

---

## 3. Interfaces e exports  

| Export | Descrição |
|--------|-----------|
| `type Locale = "pt" | "en"` | União literal que restringe os idiomas suportados. |
| `type Dict` | Estrutura tipada que descreve todas as chaves de texto da aplicação, subdivididas em blocos (`common`, `footer`, `marketing`, `explore`, `join`). |
| `const dictionaries: Record<Locale, Dict>` | Mapeamento de cada `Locale` para seu respectivo dicionário preenchido. Exportado como padrão de uso. |

Esses tipos são **importados** por `I18nProvider` para validar o conteúdo recebido e por eventuais componentes que desejem tipar explicitamente o dicionário.

---

## 4. Dependências e acoplamentos  

- **Internas**: nenhuma importação de outros módulos (arquivo autossuficiente).  
- **Externas**: depende apenas de recursos da linguagem TypeScript (tipos, `Record`). Não há dependências de bibliotecas de terceiros nem de código de runtime.  

O módulo está **baixo acoplado**: pode ser substituído ou estendido sem impactar outras partes, desde que respeite a assinatura `Dict`.

---

## 5. Leitura guiada do código (top‑down)

1. **Declaração de `Locale`** – restringe os idiomas suportados a `"pt"` e `"en"`.  
2. **Definição de `Dict`** – estrutura hierárquica que reflete a organização visual da aplicação:
   - `common`: textos genéricos (menu, botões, campos de formulário).  
   - `footer`: informações de rodapé e links.  
   - `marketing`: conteúdo das páginas de marketing (hero, seções, sobre, dedicatória, criador).  
   - `explore` e `join`: textos de fluxos de navegação/registro.  
   Cada sub‑objeto contém apenas propriedades do tipo `string` ou arrays de objetos simples, facilitando a **serialização** e a **busca por chave**.
3. **Constante `dictionaries`** – objeto literal que implementa `Record<Locale, Dict>`:
   - Possui duas chaves (`pt`, `en`).  
   - Cada chave contém a implementação completa de `Dict`, obedecendo à tipagem estrita.  
   - Comentários (`// Mantido por compatibilidade`) indicam campos legados que ainda são exportados para evitar quebras em componentes antigos.  
4. **Exportação** – tanto os tipos quanto a constante são exportados, permitindo que outros módulos importem apenas o que necessitam.

### Decisões de implementação relevantes  

- **Compatibilidade retroativa**: campos `cards` (sem `href`) permanecem ao lado de `primaryCards` (com `href`). Isso evita a necessidade de refatorar imediatamente componentes que ainda esperam o formato antigo.  
- **Uso de `Array<{ … }>` ao invés de `Record`**: favorece a ordem de exibição dos cards, importante para UI.  
- **Separação de textos por domínio** (`common`, `footer`, `marketing`, …) reflete a estrutura de componentes React, simplificando a extração de trechos específicos via `useI18n` (ou similar).  

---

## 6. Fluxo de dados / estado / eventos  

O módulo **não possui fluxo de dados ativo**. Ele fornece um objeto estático que é **lido** pelo provedor de i18n no momento da inicialização da aplicação. O provedor seleciona o dicionário correspondente ao locale atual (geralmente armazenado em contexto ou em `localStorage`) e o disponibiliza via React Context para os componentes consumirem. Não há mutação nem eventos internos.

---

## 7. Conexões com outros arquivos do projeto  

- **`src/i18n/I18nProvider.tsx`** – Consome `dictionaries` e os tipos exportados para montar o contexto de internacionalização.  
  - Documentação: [I18nProvider.md](src/src/i18n/I18nProvider/I18nProvider.md)  

Nenhum outro módulo importa diretamente este arquivo, mas qualquer componente que utilize o hook/context de i18n depende indiretamente dele.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Campos legados (`cards`)** | Manutenção de código duplicado; risco de divergência entre `cards` e `primaryCards`. | Avaliar remoção gradual após migração completa dos componentes para `primaryCards`. |
| **Escalabilidade de idiomas** | Atualmente limitado a `pt` e `en`. | Transformar `Locale` em enum ou gerar dinamicamente a partir de arquivos JSON externos, facilitando a adição de novos idiomas. |
| **Acoplamento implícito ao layout** | Estrutura rígida pode exigir alterações em múltiplas partes ao mudar a UI. | Considerar separar *texto* de *estrutura de layout* (ex.: manter apenas strings e deixar a definição de cards (href, ordem) para um arquivo de configuração de UI). |
| **Validação em tempo de execução** | Erros de chave inexistente só são detectados em tempo de compilação ou em runtime se o tipo for contornado. | Implementar testes unitários que percorrem `dictionaries` verificando a presença de todas as chaves esperadas pelos componentes. |
| **Internacionalização de pluralização e formatação** | O dicionário contém apenas strings simples; não cobre casos de plural ou formatação de números/data. | Avaliar a adoção de uma biblioteca como `i18next` ou `formatjs` para recursos avançados, mantendo `dictionaries` como fonte de mensagens base. |

--- 

*Esta documentação segue as diretrizes de estilo solicitadas: escrita direta, tom técnico e uso de Markdown estruturado.*
