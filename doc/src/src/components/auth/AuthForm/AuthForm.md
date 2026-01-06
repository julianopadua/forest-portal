# 1. Visão geral e responsabilidade  

`AuthForm.tsx` implementa um formulário de autenticação reutilizável que suporta os modos **signin** (login) e **signup** (registro).  
Ele coleta credenciais do usuário, valida‑as de forma mínima (e‑mail, nome de usuário, senha) e envia os dados para as rotas de API `/api/auth/login` e `/api/auth/signup`.  
Em caso de sucesso, dispara `router.refresh()` e opcionalmente chama o callback `onSuccess`. Em falha, exibe mensagem de erro.

---

# 2. Onde este arquivo se encaixa na arquitetura  

- **Camada:** UI – componente de apresentação e interação.  
- **Domínio:** Autenticação (frontend).  
- **Ponto de extensão:** pode ser usado por páginas de login/registro ou por outros componentes que precisem de fluxo de autenticação.  
- **Tipo:** React functional component com hooks, marcado como `"use client"` para execução no cliente Next.js.

---

# 3. Interfaces e exports  

```tsx
export type AuthMode = "signin" | "signup";

export default function AuthForm(props: {
  mode: AuthMode;                // modo atual do formulário
  setMode: (m: AuthMode) => void; // alterna entre signin / signup
  onSuccess?: () => void;        // callback opcional após login ou registro bem‑sucedido
}): JSX.Element;
```

- **`AuthMode`** – tipo discriminado usado externamente para indicar o estado do formulário.  
- **`AuthForm`** – componente padrão exportado; recebe `mode`, `setMode` e `onSuccess`.

---

# 4. Dependências e acoplamentos  

| Origem | Tipo | Motivo |
|--------|------|--------|
| `react` (`useMemo`, `useState`) | Externa | Gerenciamento de estado e memoização. |
| `next/navigation` (`useRouter`) | Externa | Navegação e refresh da página após autenticação. |
| `@/components/ui/Button` | Interna | Botão estilizado reutilizado no formulário. |
| `@/i18n/I18nProvider` (`useI18n`) | Interna | Internacionalização (texto dinâmico por locale). |
| API endpoints (`/api/auth/login`, `/api/auth/signup`) | Implícita | Comunicação com backend; não há importação direta, mas são URLs hard‑coded. |

Não há dependências circulares conhecidas; o componente depende apenas de utilitários de UI e i18n.

---

# 5. Leitura guiada do código (top‑down)  

1. **Imports & tipos auxiliares** – `AuthMode`, `Msg`, funções `isEmailLike` e `normalizeUsername`.  
   - `isEmailLike` verifica presença de “@” e “.”.  
   - `normalizeUsername` remove caracteres inválidos, converte para minúsculas e trim.  

2. **Hook de estado** – `isLoading`, `msg`, `identifier` (login), `username`, `email`, `password`.  

3. **`ui` (useMemo)** – objeto de textos dependente de `locale` e `dict`. Centraliza strings para evitar recomputação.  

4. **`postJSON`** – wrapper genérico para `fetch` POST com tratamento de erro simples (lança `Error` com mensagem do corpo ou “Error”).  

5. **`handleSubmit`** – lógica principal:  
   - Prevê `e.preventDefault()`, ativa loading e limpa mensagens.  
   - **Modo signin:** valida `identifier`, chama `/api/auth/login`, faz `router.refresh()` e dispara `onSuccess`.  
   - **Modo signup:** normaliza `username`, valida tamanho mínimo, verifica e‑mail opcional, chama `/api/auth/signup`, idem refresh/onSuccess.  
   - Em exceção, grava `msg` como erro. Sempre desativa loading no `finally`.  

6. **Renderização JSX** – estrutura condicional por `mode`:  
   - Campos de entrada (`input`) com classes Tailwind‑like.  
   - Mensagem de feedback (`msg`).  
   - Botão `Button` desabilitado enquanto `isLoading`.  
   - Botão secundário que troca o modo, limpando mensagens.  

Decisões notáveis:  
- Validação mínima no cliente (ex.: tamanho de senha, formato de e‑mail).  
- Uso de `router.refresh()` ao invés de redirecionamento explícito, mantendo a página atual.  
- Mensagens de UI são derivadas de `dict` para suporte a múltiplos idiomas.

---

# 6. Fluxo de dados/estado/eventos  

1. **Entrada do usuário** → `onChange` dos `<input>` atualiza os estados locais (`identifier`, `username`, `email`, `password`).  
2. **Envio** → `onSubmit` dispara `handleSubmit`.  
3. **Validação** → funções auxiliares e checagens inline lançam `Error` caso falhem.  
4. **Requisição** → `postJSON` envia payload JSON ao backend.  
5. **Resposta** →  
   - **Sucesso:** `router.refresh()` + `onSuccess` (se fornecido).  
   - **Falha:** `setMsg({type:"error", text: err.message})`.  
6. **Render** → Mudança de `msg`, `isLoading` ou `mode` provoca re‑renderização automática do componente.

---

# 7. Conexões com outros arquivos do projeto  

- **Botão UI:** `import Button from "@/components/ui/Button"` → [Documentação do Button](../ui/Button.md) (link fictício).  
- **I18n Provider:** `import { useI18n } from "@/i18n/I18nProvider"` → [I18nProvider docs](../i18n/I18nProvider.md).  
- **Rotas de API:** `/api/auth/login` e `/api/auth/signup` – endpoints definidos em `src/pages/api/auth/`. Não há importação direta, mas são dependências de contrato.  

Nenhum outro módulo importa `AuthForm` no momento (conforme análise estática).

---

# 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Validação fraca** | Segurança e UX degradadas (e‑mail simples, senha mínima apenas por `minLength`). | Integrar biblioteca de validação (ex.: `zod` ou `yup`) e exibir feedback inline. |
| **Hard‑coded URLs** | Acoplamento ao caminho `/api/auth/*`; mudanças de rota exigem modificação aqui. | Extrair constantes para um módulo `apiRoutes.ts`. |
| **Mensagens de erro genéricas** | Usuário pode receber “Error” sem contexto. | Propagar códigos de erro do backend e mapear para mensagens amigáveis. |
| **Uso de `router.refresh()`** | Recarrega toda a página, potencialmente custoso. | Avaliar redirecionamento (`router.push`) para página pós‑login ou atualização de estado global (ex.: contexto de auth). |
| **Ausência de teste unitário** | Risco de regressão ao alterar lógica. | Criar testes com React Testing Library para fluxos signin/signup e validações. |
| **Acessibilidade** | Falta de `label` associado a inputs; leitores de tela podem ter dificuldade. | Adicionar `<label htmlFor>` ou atributos `aria-label`. |
| **Internacionalização limitada** | Strings fixas para português/inglês; novos idiomas exigiriam duplicação. | Centralizar todas as strings em arquivos de tradução e remover lógica condicional `isPt`. |

Implementar as melhorias acima aumentará a robustez, manutenibilidade e experiência do usuário.
