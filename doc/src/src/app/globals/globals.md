## 1️⃣ Visão geral e responsabilidade  

`src/app/globals.css` define **variáveis CSS (tokens de design)** e **estilos globais** que são consumidos por toda a aplicação.  
Ele centraliza paletas de cores, sombras, escalas tipográficas e mapeia esses tokens para o tema do Tailwind v4, permitindo que componentes e utilitários acessem valores consistentes via `var(--nome‑token)`.

---

## 2️⃣ Posicionamento na arquitetura  

| Camada / Domínio | Tipo | Comentário |
|------------------|------|------------|
| **UI – camada de apresentação** | **Estilos globais** | Arquivo de nível raiz que afeta o *document* inteiro ( `<html>` / `<body>` ). Não contém lógica de negócio nem código de aplicação. |

Ele está fora de qualquer módulo de domínio ou de utilitários; funciona como **infra‑estrutura de UI**.

---

## 3️⃣ Interfaces e exports  

CSS não possui *exports* explícitos. O “contrato” do arquivo consiste nas **variáveis CSS** declaradas em `:root` (e nas suas versões *light* / *dark*). Qualquer componente que importe este stylesheet pode usar:

```css
color: var(--primary);
background: var(--surface);
```

Não há `@export` nem `module.exports`.

---

## 4️⃣ Dependências e acoplamentos  

| Tipo | Detalhe |
|------|---------|
| **Externa** | `@import "tailwindcss";` – traz o runtime do Tailwind v4, necessário para que a diretiva `@theme inline` funcione. |
| **Interna** | Nenhuma importação de arquivos do projeto. |
| **Acoplamento** | Fortemente acoplado ao **tema Tailwind** (variáveis `--color‑*` são mapeadas para os tokens do Tailwind). Qualquer mudança na API de temas do Tailwind pode exigir ajustes aqui. |

---

## 5️⃣ Leitura guiada do código (top‑down)  

1. **Importação do Tailwind** – garante que as diretivas de tema sejam reconhecidas.  
2. **`:root` – tokens padrão (modo claro)**  
   - Cores de fundo, texto, superfícies, bordas, anéis, cores de marca, acentos e status.  
   - `--shadow-float` e `--fp-font-scale` (escala tipográfica controlada por provider).  
   - `color-scheme: light;` informa ao navegador que o esquema padrão é claro.  
3. **Escala tipográfica global** – `html { font-size: calc(16px * var(--fp-font-scale)); }` permite ajuste dinâmico via provider.  
4. **Media query `prefers-color-scheme: dark`** – sobrescreve todos os tokens para o modo escuro, incluindo sombras e `color-scheme: dark`.  
5. **Classes manuais `html.theme-light` / `html.theme-dark`** – permitem forçar o tema via classe no `<html>`, replicando os valores das media queries.  
6. **`@theme inline`** – mapeia os tokens definidos acima para as variáveis de tema esperadas pelo Tailwind (`--color-background`, `--color-primary`, etc.). Comentário importante: não redefinir `--shadow-float` nem `--font-sans` aqui para evitar referência circular.  
7. **Estilos base do `body`** – aplica cor de fundo, cor de texto e família tipográfica (herdada de `--font-sans` definido em `layout.tsx` via `next/font`).  

**Invariantes**  
- Cada token tem exatamente **uma definição** por modo (claro/escuro) e por classe de tema.  
- `color-scheme` sempre reflete o modo ativo, garantindo que o navegador ajuste barras de rolagem e controles nativos.  

**Decisões de implementação**  
- Uso de **variáveis CSS** para permitir troca de tema em tempo de execução sem recarregar a página.  
- Separação explícita entre *tokens* e *mapeamento Tailwind* para manter a camada de design independente da camada de utilitários.  

---

## 6️⃣ Fluxo de dados / estado / eventos  

Não há fluxo de dados nem eventos neste arquivo. O “estado” consiste nas **variáveis CSS** que podem ser alteradas por:  

- **Preferência do usuário** (`prefers-color-scheme`).  
- **Classe manual** (`html.theme-light` / `html.theme-dark`).  
- **Provider de fonte** que modifica `--fp-font-scale`.  

Qualquer mudança reflete imediatamente nos componentes que consomem as variáveis.

---

## 7️⃣ Conexões com outros arquivos do projeto  

- **`src/app/layout.tsx`** (ou equivalente) – define `--font-sans` via `next/font` e possivelmente controla a classe `theme‑light`/`theme‑dark` no `<html>`.  
- **Componentes Tailwind** – utilizam as variáveis `--color-*` mapeadas por `@theme inline`.  

> **Nota:** Não há importações diretas nem referências explícitas a este arquivo em outros módulos; ele é incluído globalmente pelo bundler (ex.: `import "./globals.css"` no ponto de entrada da aplicação).

---

## 8️⃣ Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Acoplamento ao Tailwind v4** | Quebra de compatibilidade caso o projeto migre para outra versão ou framework. | Documentar a dependência e, se possível, isolar o mapeamento em um arquivo separado (`tailwind-theme.css`). |
| **Duplicação de valores entre media query e classes** | Manutenção duplicada (mesmo conjunto de tokens aparece duas vezes). | Extrair valores comuns para um bloco `:root` e sobrescrever apenas as diferenças nas media queries / classes. |
| **Escala tipográfica fixa (`16px`)** | Pode gerar inconsistências em dispositivos com configurações de fonte diferentes. | Considerar usar `rem` baseado no `font-size` do usuário (`html { font-size: 100%; }`) e aplicar escala via `--fp-font-scale` apenas quando necessário. |
| **Variáveis de sombra (`--shadow-float`) não mapeadas para Tailwind** | Não aproveita o sistema de utilities do Tailwind para sombras. | Avaliar a inclusão de `--shadow-float` no `@theme inline` ou criar utility customizada (`shadow-float`). |
| **Ausência de fallback para `--font-sans`** | Se o provider falhar, o `font-family` pode ficar incompleto. | Definir fallback explícito (`var(--font-sans, system-ui)`). |

Implementar as melhorias acima reduzirá a dívida técnica e facilitará futuras migrações ou extensões de tema.
