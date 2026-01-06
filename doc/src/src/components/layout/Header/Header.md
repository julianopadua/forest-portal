## 1. Visão geral e responsabilidade  

O componente **Header** representa a barra de navegação fixa da aplicação.  
Ele reúne:

* Logotipo responsivo (modo claro/escuro).  
* Botões de abertura do menu lateral (`SidebarSheet`).  
* Links de navegação principais (dados, relatórios, educação) obtidos do dicionário de internacionalização.  
* Controle de autenticação (exibição de `AuthModal` para login/registro).  
* Alternador de tema (claro ↔ escuro) sincronizado com a classe do elemento `<html>` e com `localStorage`.  

O componente não exporta tipos ou funções auxiliares; apenas o componente padrão `Header`.

---

## 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Descrição |
|------------------|-----------|
| **UI – Layout**  | Faz parte do conjunto de componentes de layout que estruturam a interface (ex.: `SidebarSheet`). |
| **Cliente**      | Marca `"use client"` indicando que será executado no navegador, usando hooks do React e da API do Next.js. |
| **Internacionalização** | Consome o provedor `useI18n` para obter textos traduzidos. |
| **Autenticação** | Integração com o hook `useSupabaseUser` e com o modal de autenticação. |

---

## 3. Interfaces e exports  

```tsx
export default function Header(): JSX.Element
```

* **Exportação padrão** – o componente React que pode ser importado como `import Header from ".../Header"`.

Não há outras exportações (tipos, constantes ou funções) neste módulo.

---

## 4. Dependências e acoplamentos  

| Tipo | Módulo | Motivo da dependência |
|------|--------|-----------------------|
| **Next.js** | `next/image`, `next/link`, `next/navigation` | Renderização de imagens, navegação de rotas e acesso a pathname/search‑params. |
| **React** | `useEffect`, `useMemo`, `useState` | Gerenciamento de estado e efeitos colaterais. |
| **UI interno** | `@/components/ui/Button` | Botão estilizado reutilizado no header. |
| **Internacionalização** | `@/i18n/I18nProvider` (`useI18n`) | Recupera o dicionário de textos. |
| **Autenticação** | `@/hooks/useSupabaseUser`, `@/components/auth/AuthModal`, `type { AuthMode }` | Estado do usuário e fluxo de login/registro. |
| **Layout auxiliar** | `./SidebarSheet` | Menu lateral que recebe `open` e `onClose`. |
| **Browser API** | `localStorage`, `window.matchMedia`, `MutationObserver` | Persistência e detecção de tema. |

Todas as dependências são **estáticas** (importadas no topo) e não há carregamento dinâmico.

---

## 5. Leitura guiada do código (top‑down)

1. **Imports** – trazem componentes de UI, hooks de navegação, i18n, autenticação e o `SidebarSheet`.  
2. **Componentes auxiliares** – `IconMenu`, `SunIcon` e `MoonIcon` retornam SVGs simples; são usados apenas para ícones de botão.  
3. **Hook de estado** –  
   * `openMenu` controla a visibilidade do `SidebarSheet`.  
   * `openAuth` e `authMode` controlam o `AuthModal`.  
   * `theme` armazena o modo atual (`light` | `dark`).  
4. **Efeito 1 – Query string `auth`** – ao montar, verifica se `?auth=signin|signup` está presente; abre o modal correspondente e remove o parâmetro da URL via `router.replace`.  
5. **Efeito 2 – Inicialização e sincronização de tema** –  
   * Determina o tema a partir da classe do `<html>` ou da preferência do sistema.  
   * Aplica o tema (classe `theme-dark`/`theme-light`) e persiste em `localStorage`.  
   * Registra um `MutationObserver` para atualizar o estado quando a classe do `<html>` mudar (ex.: mudança externa).  
6. **`toggleTheme`** – inverte o tema, atualiza a classe do `<html>` e grava em `localStorage`.  
7. **Cálculo de variáveis de UI** – `logoSrc` escolhe a imagem do logotipo conforme o tema; `navLinkClass` contém classes CSS reutilizadas.  
8. **Renderização** –  
   * Estrutura fixa (`header`) com duas versões: mobile (visível até `md`) e desktop (a partir de `md`).  
   * Botões de abertura de menu, links de navegação, botão de login/settings e alternador de tema.  
   * Fora do `<header>`, são renderizados `SidebarSheet` e `AuthModal`, controlados pelos estados acima.  

---

## 6. Fluxo de dados/estado/eventos  

| Evento | Manipulador | Efeito colateral |
|--------|-------------|------------------|
| Clique no ícone de menu | `setOpenMenu(true)` | Exibe `SidebarSheet`. |
| Clique no botão de login (quando `!user`) | `setAuthMode("signin"); setOpenAuth(true)` | Abre `AuthModal` em modo *signin*. |
| Clique no botão de tema | `toggleTheme()` | Troca classe do `<html>`, grava em `localStorage` e atualiza `theme`. |
| Mudança de URL contendo `auth=` | `useEffect` (dependência `sp`) | Define `authMode`, abre modal e limpa query string. |
| Sucesso de autenticação (`AuthModal.onSuccess`) | `router.refresh()` | Recarrega a página para refletir novo estado de usuário. |
| Alteração externa da classe `theme-*` | `MutationObserver` | Atualiza estado `theme` para manter UI sincronizada. |

O estado interno (`openMenu`, `openAuth`, `authMode`, `theme`) é **local** ao componente; não há compartilhamento via contexto externo, exceto o `user` e `dict` provenientes de hooks.

---

## 7. Conexões com outros arquivos do projeto  

* **`SidebarSheet`** – componente de menu lateral. Documentação: [src/components/layout/SidebarSheet/SidebarSheet.md](src/src/components/layout/SidebarSheet/SidebarSheet.md)  
* **`Button`** – botão estilizado reutilizado (localização: `src/components/ui/Button`).  
* **`AuthModal`** – modal de autenticação (localização: `src/components/auth/AuthModal`).  
* **`useSupabaseUser`** – hook que fornece o objeto `user` (localização: `src/hooks/useSupabaseUser`).  
* **`useI18n`** – provedor de internacionalização (localização: `src/i18n/I18nProvider`).  

Nenhum outro módulo importa `Header`; ele é um ponto de entrada de UI usado diretamente nas páginas da aplicação.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Acoplamento ao DOM** | O componente manipula diretamente `document.documentElement` e `localStorage`. Em ambientes de renderização estática (SSR) isso pode gerar erros se o código for executado antes do cliente. | Guardar acesso ao `document` dentro de `useEffect` (já está) e garantir que o componente nunca seja renderizado no servidor (já marcado como `"use client"`). |
| **Persistência de tema** | O tema é armazenado em `localStorage` sob a chave `fp_theme`. Não há fallback caso o valor seja corrompido. | Validar o valor lido antes de aplicar (`if (stored !== "dark" && stored !== "light")`). |
| **Observador de mutação** | O `MutationObserver` observa mudanças de classe no `<html>`; pode gerar re‑renderizações frequentes se outras partes da aplicação alterarem classes. | Limitar a frequência de atualização (debounce) ou garantir que apenas alterações de tema disparem o observer. |
| **Hard‑coded IDs de navegação** | Os IDs (`openDataId`, `reportsId`, `educationId`) são extraídos do dicionário, mas não há verificação de existência. | Adicionar checagem de nulidade ou fallback para evitar links quebrados caso o dicionário mude. |
| **Acessibilidade** | Botões têm `aria-label`/`title` corretos; porém, os links de navegação não possuem atributos `aria-current` quando ativos. | Incluir `aria-current="page"` nos links que correspondem ao `pathname`. |
| **Teste unitário** | Não há testes associados ao componente. | Criar testes de renderização (React Testing Library) que verifiquem: troca de tema, abertura de modal via query string, e comportamento do botão de menu. |
| **Separação de responsabilidades** | O componente combina lógica de tema, autenticação e navegação. | Considerar extrair a lógica de tema para um hook (`useTheme`) e a lógica de query‑string para outro (`useAuthQuery`). Isso melhora reutilização e testabilidade. |

---
