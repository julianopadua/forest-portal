# 📄 Documentação – `src/i18n/I18nProvider.tsx`

---

## 1️⃣ Visão geral e responsabilidade  

O módulo **`I18nProvider`** implementa o provedor de contexto de internacionalização (i18n) da aplicação.  
Ele centraliza:

* a seleção de **locale** (`pt` ou `en`);
* o dicionário de traduções correspondente (`dictionaries[locale]`);
* o controle de **tamanho de fonte** (nível de -2 a +2) e a exposição da escala resultante (`fontScale`);
* a persistência dessas preferências em `localStorage`;
* a aplicação das configurações ao elemento `<html>` (atributo `lang` e CSS custom property `--fp-font-scale`).

O provedor garante que todo o UI possa consumir essas informações via o hook `useI18n`.

---

## 2️⃣ Posicionamento na arquitetura  

| Camada / Domínio | Descrição |
|------------------|-----------|
| **UI – Context / Provider** | O arquivo está na camada de apresentação, fornecendo um *React Context* que será consumido por componentes de UI. |
| **Util – Persistência simples** | Usa `localStorage` para manter estado entre sessões, mas não depende de abstrações de armazenamento mais avançadas. |
| **i18n (Domínio de internacionalização)** | Centraliza a lógica de seleção de idioma e ajustes de acessibilidade tipográfica. |

> **Observação:** Não há importações de camadas de domínio de negócio ou de infraestrutura; o módulo é autocontido dentro do namespace `i18n`.

---

## 3️⃣ Interfaces e exports  

| Export | Tipo | Descrição |
|--------|------|-----------|
| `I18nProvider` | **React.FC** (`{ children: React.ReactNode }`) | Componente que encapsula a árvore de componentes e fornece o contexto i18n. |
| `useI18n` | **Hook** (`() => I18nContextValue`) | Hook de conveniência para acessar o contexto; lança erro se usado fora de `I18nProvider`. |
| `I18nContextValue` (type) | **Tipo** | Estrutura do valor exposto pelo contexto: `locale`, `dict`, funções de mutação e propriedades de fonte. |
| `FontLevel` (type) | **Tipo** | Enumeração restrita de `-2 | -1 | 0 | 1 | 2`. |

> Não são exportados `I18nContext`, `LOCALE_STORAGE_KEY`, `FONT_STORAGE_KEY` ou funções auxiliares (`clampFontLevel`). Elas permanecem privadas ao módulo.

---

## 4️⃣ Dependências e acoplamentos  

| Origem | Tipo | Motivo |
|--------|------|--------|
| `react` | **Externa** | Hooks (`useState`, `useEffect`, `useMemo`, `createContext`, `useContext`). |
| `./dictionaries` | **Interna** | Tipos `Dict`, `Locale` e objeto `dictionaries` que contém os textos traduzidos. |
| `localStorage` / `document.documentElement` | **API do navegador** | Persistência e manipulação de atributos/variáveis CSS globais. |

**Acoplamento interno:** O provedor depende diretamente da forma como `dictionaries` está estruturado (chave por `locale`). Qualquer mudança na assinatura de `dictionaries` exigirá ajuste aqui.

**Acoplamento externo:** Nenhum outro módulo importa este arquivo (conforme a lista de importadores), portanto ele não gera dependências circulares.

---

## 5️⃣ Leitura guiada do código (top‑down)

1. **Modo cliente** – ` "use client"; ` indica que o módulo será executado no navegador (Next.js).  
2. **Imports** – React, tipos e dicionário.  
3. **Tipos auxiliares**  
   ```tsx
   type FontLevel = -2 | -1 | 0 | 1 | 2;
   type I18nContextValue = { … };
   ```
   Definem a API pública do contexto.  
4. **Criação do contexto**  
   ```tsx
   const I18nContext = createContext<I18nContextValue | null>(null);
   ```
   Valor inicial `null` força a verificação de presença no hook.  
5. **Constantes de armazenamento** – chaves usadas em `localStorage`.  
6. **Mapeamento de nível → escala**  
   ```tsx
   const FONT_LEVEL_TO_SCALE: Record<FontLevel, number> = {
     "-2": 0.8, "-1": 0.9, "0": 1.0, "1": 1.1, "2": 1.2,
   };
   ```
   Define a relação linear entre nível e fator de escala.  
7. **Função `clampFontLevel`** – garante que o nível permaneça no intervalo `[-2, 2]`.  
8. **Componente `I18nProvider`**  
   * Estado local: `locale` (inicial `"pt"`), `fontLevel` (inicial `0`).  
   * **`useEffect` #1** – ao montar, lê valores persistidos de `localStorage` e os converte, usando `clampFontLevel` para a fonte.  
   * **`useEffect` #2** – sincroniza `locale` com `localStorage` e define o atributo `lang` do `<html>` (`pt-BR` ou `en`).  
   * **`useEffect` #3** – converte `fontLevel` em escala, grava a propriedade CSS `--fp-font-scale` e persiste o nível.  
   * **`useMemo`** – cria o objeto de contexto (`value`) contendo:  
     - `locale`, `dict` (lookup em `dictionaries`), `setLocale`;  
     - `fontLevel`, `fontScale`, `setFontLevel`;  
     - helpers `increaseFont`, `decreaseFont`, `resetFont`.  
   * Renderiza `<I18nContext.Provider>` com `value` e `children`.  
9. **Hook `useI18n`** – consome o contexto, lança erro caso o provedor não esteja presente.

---

## 6️⃣ Fluxo de dados / estado / eventos  

| Evento | Origem | Efeito | Atualização de estado |
|--------|--------|--------|-----------------------|
| **Montagem do Provider** | React | Lê `localStorage` → `locale` / `fontLevel` | `setLocaleState`, `setFontLevelState` |
| **Alteração de `locale`** | `setLocale` (ex.: seletor UI) | Persiste em `localStorage`; atualiza atributo `lang` do `<html>` | `useEffect` dependente de `[locale]` |
| **Alteração de `fontLevel`** | `setFontLevel`, `increaseFont`, `decreaseFont`, `resetFont` | Persiste em `localStorage`; atualiza CSS custom property `--fp-font-scale` | `useEffect` dependente de `[fontLevel]` |
| **Re-render** | Qualquer mudança de estado acima | `useMemo` recalcula `value` (inclui `dict` e `fontScale`) | Propaga novo contexto para consumidores. |

O estado é **local ao Provider**, mas é exposto globalmente via contexto, permitindo que componentes leiam e modifiquem as preferências sem acoplamento direto.

---

## 7️⃣ Conexões com outros arquivos do projeto  

| Arquivo | Tipo de vínculo | Comentário |
|---------|----------------|------------|
| `src/i18n/dictionaries.ts` | **Importação de tipos e dados** | Fornece `Dict`, `Locale` e o objeto `dictionaries` usado para resolver traduções. Documentação: [dictionaries.md](src/src/i18n/dictionaries/dictionaries.md) |
| (Nenhum) | **Importado por** | O Provider ainda não é consumido por outros módulos (pelo menos no momento da análise). |

> Caso novos componentes precisem de i18n, eles deverão envolver a árvore raiz com `<I18nProvider>` e usar `useI18n`.

---

## 8️⃣ Pontos de atenção, riscos e melhorias recomendadas  

| Item | Risco / Impacto | Recomendações |
|------|-----------------|---------------|
| **Persistência em `localStorage`** | Falha silenciosa (catch vazio) pode deixar o usuário sem preferência salva. | Logar erros (ex.: `console.warn`) ou fallback explícito. |
| **Hard‑coded locales** (`"pt"` / `"en"`) | Adição de novos idiomas requer alterações em múltiplos pontos (tipo `Locale`, validação, dicionário). | Centralizar lista de locales em `dictionaries.ts` e reutilizar (`Object.keys(dictionaries) as Locale[]`). |
| **Escala de fonte fixa** | Não há suporte a valores intermediários ou a unidades diferentes (ex.: `rem`). | Expor API para definir escala arbitrária ou mapear níveis dinamicamente via configuração. |
| **Acesso direto ao DOM** (`document.documentElement`) | Quebra de renderização no ambiente server‑side (SSR) se o Provider for usado fora de `"use client"`; já está marcado como client‑only, mas pode gerar confusão. | Documentar claramente a restrição de uso apenas no cliente. |
| **Teste de unidade** | Não há cobertura de testes para lógica de carregamento e persistência. | Implementar testes unitários (Jest + React Testing Library) para `clampFontLevel`, efeitos de `useEffect` e hook `useI18n`. |
| **Tipagem de `localStorage`** | `localStorage.getItem` pode retornar `null`; a conversão para `Locale` assume apenas `"pt"` ou `"en"`. | Utilizar guardas de tipo mais robustas ou criar função `parseLocale`. |
| **Performance** | `useMemo` depende apenas de `[locale, fontLevel]`; porém `dictionaries[locale]` pode ser um objeto grande. | Avaliar se a memoização profunda é necessária ou se o dicionário pode ser carregado sob demanda (code‑splitting). |

---  

*Esta documentação segue as diretrizes de clareza, concisão e referência cruzada exigidas para a base de conhecimento interna.*
