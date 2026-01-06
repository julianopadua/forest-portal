## 1. Visão geral e responsabilidade  

`SidebarSheet` é um componente **client‑side** que renderiza um painel lateral (sheet) de navegação. Ele exibe:  

* links de navegação principais e âncoras internas;  
* botão de alternância de tema (claro/escuro);  
* controle de idioma;  
* acesso rápido a “Configurações” ou ao modal de autenticação, dependendo da presença de usuário.  

O componente recebe duas props (`open` e `onClose`) que controlam sua visibilidade e encerramento.

---

## 2. Posicionamento na arquitetura  

| Camada / Domínio | Localização | Função |
|------------------|-------------|--------|
| **UI – Layout**  | `src/components/layout/SidebarSheet.tsx` | Estrutura de navegação lateral reutilizável em toda a aplicação. |
| **Apresentação** | Utiliza hooks de contexto (`useI18n`, `useSupabaseUser`) e componentes de UI (`Button`, `AuthModal`). | Não contém lógica de negócio; delega ao provedor de i18n e ao hook de usuário. |

---

## 3. Interfaces e exports  

```tsx
export default function SidebarSheet({
  open,
  onClose,
}: {
  open: boolean;          // controla a renderização do sheet
  onClose: () => void;    // callback para fechar o sheet
}): JSX.Element | null;
```

* **Exportação padrão**: o componente acima.  
* Não há tipos ou funções exportadas adicionalmente.

---

## 4. Dependências e acoplamentos  

| Tipo | Módulo | Motivo |
|------|--------|--------|
| **Externo** | `next/link`, `next/navigation` | Navegação de rotas e atualização de página. |
| **Externo** | `react` (`useEffect`, `useState`) | Gerenciamento de estado e efeitos colaterais. |
| **Interno** | `@/components/ui/Button` | Botão estilizado usado em múltiplas áreas. |
| **Interno** | `@/i18n/I18nProvider` (`useI18n`) | Fornece dicionário de textos e controle de locale. |
| **Interno** | `@/hooks/useSupabaseUser` | Obtém o usuário autenticado via Supabase. |
| **Interno** | `@/components/auth/AuthModal` | Modal de login/registro exibido sob demanda. |

O componente **não** depende de nenhum serviço de tema externo; a lógica de tema manipula diretamente a classe do `<html>` e `localStorage`.

---

## 5. Leitura guiada do código (top‑down)  

1. **Declarações auxiliares** – ícones SVG (`IconX`, `IconMenu`, `SunIcon`, `MoonIcon`, `ChevronDown`, `ChevronRight`). São funções puras que retornam JSX.  
2. **Hook de estado** – `openSettings`, `theme`, `openAuth`.  
3. **Extração de IDs** – valores de `dict` (ex.: `dict.marketing.sections.mission.id`) são armazenados em constantes para compor URLs.  
4. **`useEffect`** – ao abrir o sheet (`open` muda), lê a classe do `<html>` para definir o estado `theme`.  
5. **`toggleTheme`** – inverte o tema, atualiza a classe do `<html>`, persiste em `localStorage` (`fp_theme`) e sincroniza o estado interno.  
6. **Renderização condicional** – se `!open` retorna `null`. Caso contrário, monta:  
   * camada de backdrop que dispara `onClose` ao ser clicada;  
   * `<aside>` contendo cabeçalho, botões de configuração/autenticação, lista de links e seção de ajustes (idioma).  
7. **Botão de idioma** – altera o locale via `setLocale` do provedor i18n.  
8. **`AuthModal`** – controlado por `openAuth`; ao sucesso, fecha o modal, encerra o sheet e força recarregamento da rota (`router.refresh()`).  

Decisões notáveis:  
* **Persistência de tema** apenas via classe HTML e `localStorage`; não há integração com Context API ou CSS‑in‑JS.  
* **Abertura de settings** controla a exibição de um bloco interno, sem efeito colateral externo.  

---

## 6. Fluxo de dados / estado / eventos  

| Fonte | Destino | Evento / Atualização |
|-------|---------|----------------------|
| `open` (prop) | Renderização do sheet | Quando `false` → `null`. |
| `onClose` (prop) | Pai do componente | Invocado ao clicar no backdrop ou no botão X. |
| `useI18n` (`locale`, `setLocale`, `dict`) | Texto exibido e idioma | Botões de idioma chamam `setLocale`. |
| `useSupabaseUser` (`user`) | Condicional de UI (settings vs sign‑in) | Renderiza `Button` ou `Link` conforme presença de usuário. |
| `theme` (state) | Classe `<html>` e ícone exibido | `toggleTheme` altera classe, `localStorage`, e estado. |
| `openAuth` (state) | Visibilidade de `AuthModal` | Botão “Entrar” → `setOpenAuth(true)`. |
| `router.refresh()` | Revalidação de dados da página | Executado após login bem‑sucedido. |

---

## 7. Conexões com outros arquivos  

* **Importado por**: `src/components/layout/Header.tsx` – o header abre o `SidebarSheet` ao clicar no ícone de menu.  
  *Documentação*: [Header.md](src/src/components/layout/Header/Header.md)  
* **Componentes auxiliares**: `Button`, `AuthModal` (mesmo diretório `components/ui` e `components/auth`).  
* **Hooks/Contextos**: `useI18n` (`src/i18n/I18nProvider.tsx` presumido) e `useSupabaseUser` (`src/hooks/useSupabaseUser.ts`).  

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Risco / Observação | Sugestão |
|------|--------------------|----------|
| **Persistência de tema** | Depende de classes globais; mudanças fora do componente podem ficar fora de sincronia. | Centralizar tema em um Context Provider e sincronizar com `localStorage`. |
| **Acesso direto ao DOM** (`document.documentElement`) | Quebra a abstração de React e impede renderização no SSR. | Guardar a lógica de leitura/escrita de tema em um hook reutilizável que verifica a existência de `window`. |
| **Hard‑coded strings de cores** (`var(--border)`, etc.) | Acoplamento visual ao CSS custom properties; alterações exigem mudanças simultâneas no CSS. | Extrair estilos para um tema compartilhado ou usar Tailwind config. |
| **Ausência de tipagem explícita para `dict`** | O tipo de `dict` vem de `useI18n`; mudanças no dicionário podem gerar erros de runtime não detectados. | Exportar e importar um tipo `Dictionary` para garantir consistência. |
| **Re‑renderização completa ao mudar idioma** | Cada clique em botão de idioma força re‑renderização de todo o sheet. | Memoizar partes estáticas ou mover controle de idioma para nível superior. |
| **Teste de acessibilidade** | Botões têm `aria-label`/`title`, mas não há foco gerenciado ao abrir/fechar. | Implementar foco automático no primeiro elemento interativo ao abrir e retorno ao elemento disparador ao fechar. |
| **Responsividade** | Largura fixa (`w-[320px] md:w-[400px]`) pode não atender a telas muito pequenas. | Avaliar uso de `max-w-full` e transição para full‑screen em breakpoints menores. |

---
