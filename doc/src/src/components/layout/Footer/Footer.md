# Documentação – `src/components/layout/Footer.tsx`

---

## 1. Visão geral e responsabilidade  

O módulo **Footer** exporta um componente React funcional que renderiza o rodapé da aplicação.  
Sua responsabilidade é apresentar, de forma responsiva, a marca, o slogan e um conjunto de links de navegação, todos provenientes do dicionário de internacionalização (`dict`) disponibilizado pelo `I18nProvider`.

---

## 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Descrição |
|------------------|-----------|
| **UI – Layout**  | Faz parte da camada de apresentação, especificamente do layout global da aplicação (rodapé). |
| **Domínio**      | Não contém lógica de domínio; apenas exibe conteúdo estático traduzido. |
| **Util / Infra** | Depende de um provedor de i18n, mas não contém utilitários próprios. |

---

## 3. Interfaces e exports  

```tsx
export default function Footer(): JSX.Element
```

- **Exportação padrão**: o componente `Footer` é exportado como default e pode ser importado em qualquer ponto da árvore de componentes.

---

## 4. Dependências e acoplamentos  

| Tipo | Módulo | Motivo do uso |
|------|--------|---------------|
| **Externa** | `next/link` | Componente de navegação do Next.js, garante pré‑carregamento de rotas. |
| **Interna** | `@/i18n/I18nProvider` (hook `useI18n`) | Fornece o dicionário de traduções (`dict`). |
| **Nenhuma** | — | O componente não depende de estado global, APIs, ou outros serviços. |

O acoplamento é **baixo**: o componente só requer a forma esperada do objeto `dict.footer` (campos `brand`, `tagline` e `links.*`). Qualquer mudança na estrutura do dicionário exigirá atualização aqui.

---

## 5. Leitura guiada do código (top‑down)

1. **Modo cliente** – `"use client"` indica que o componente será renderizado no navegador, permitindo o uso de hooks.  
2. **Importações** – `Link` e `useI18n` são trazidos conforme a tabela acima.  
3. **Hook `useI18n`** – extrai `{ dict }` do contexto de internacionalização.  
4. **Estrutura JSX**  
   - `<footer>`: contêiner com borda superior e cores definidas por variáveis CSS (`--border`, `--surface`).  
   - `<div className="mx-auto …">`: centraliza o conteúdo, define largura máxima (`max-w-6xl`) e espaçamento interno.  
   - **Primeira coluna** – exibe a marca (`dict.footer.brand`) e o slogan (`dict.footer.tagline`).  
   - **Segunda coluna** – lista de links (`Home`, `Open Data`, `Commodities`, `Reports`, `Education`) cujos textos são lidos de `dict.footer.links.*` e cujas rotas são estáticas (`/`, `/open-data`, …). Cada link recebe a classe `hover:text-[color:var(--text)]` para efeito visual.  
5. **Responsividade** – classes Tailwind (`md:flex-row`, `md:items-center`, `md:justify-between`) alteram o layout de coluna para linha em telas médias ou maiores.  

**Invariantes**  
- O componente assume que `dict.footer` e `dict.footer.links` existam; caso contrário, o JSX renderizará `undefined` sem erro, mas exibirá conteúdo vazio.  
- As rotas são hard‑coded; não há lógica condicional.

---

## 6. Fluxo de dados / estado / eventos  

- **Fluxo de dados**: unidirecional. O hook `useI18n` fornece o objeto `dict`, que é consumido diretamente na renderização. Não há estado interno nem eventos emitidos.  
- **Estado**: inexistente (componente puro).  
- **Eventos**: apenas os eventos de navegação padrão dos links do Next.js.

---

## 7. Conexões com outros arquivos do projeto  

| Arquivo | Tipo de relação | Link (documentação) |
|---------|----------------|---------------------|
| `src/i18n/I18nProvider.tsx` | Provider que expõe o hook `useI18n` usado aqui. | `[I18nProvider](/docs/src/i18n/I18nProvider.md)` |
| `next/link` (pacote Next.js) | Componente de link usado para navegação. | `[next/link]` |

> **Observação:** Não há importações ou exportações adicionais que referenciem este módulo.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Acoplamento ao formato do dicionário** | O componente depende da estrutura exata de `dict.footer`. Qualquer alteração no schema de i18n pode quebrar a renderização. | Definir e exportar um **TypeScript interface** (`FooterDict`) e validar a presença dos campos via `zod` ou similar. |
| **Hard‑code de rotas** | As URLs dos links estão fixas no componente, dificultando reutilização ou internacionalização de rotas. | Extrair as rotas para um arquivo de configuração (`routes.ts`) ou para o próprio dicionário. |
| **Acessibilidade** | Links não possuem atributos `aria-label` e o contraste de cores depende de variáveis CSS externas. | Garantir contraste adequado e adicionar `aria-label` quando o texto não for suficientemente descritivo. |
| **Testabilidade** | Não há testes unitários associados. | Criar testes de snapshot com **React Testing Library** para validar a renderização com diferentes dicionários. |
| **Responsividade limitada** | Apenas duas quebras de layout (coluna ↔ linha). | Avaliar necessidade de ajustes adicionais para telas muito pequenas ou muito grandes. |

---
