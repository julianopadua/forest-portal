# 📄 Documentação – `src/components/auth/AuthModal.tsx`

---

## 1. Visão geral e responsabilidade
`AuthModal` é um componente **React** que encapsula a lógica de exibição de um modal de autenticação. Ele controla:
- a abertura/fechamento do modal,
- o modo de operação (`signin` ou `signup`),
- a tradução do título de acordo com o idioma corrente,
- a propagação de eventos de sucesso para o chamador.

O componente não contém lógica de negócio de autenticação; delega essa responsabilidade ao `AuthForm`.

---

## 2. Posicionamento na arquitetura
- **Camada:** UI (apresentação).
- **Domínio:** Autenticação (sub‑domínio de *auth*).
- **Tipo:** Componente de apresentação que orquestra outros componentes de UI (`Modal`, `AuthForm`) e provê integração com o provedor de internacionalização (`useI18n`).

---

## 3. Interfaces e exports
```tsx
export default function AuthModal(props: {
  open: boolean;               // controla a visibilidade do modal
  onClose: () => void;         // callback ao fechar
  initialMode?: AuthMode;      // "signin" (padrão) ou "signup"
  onSuccess?: () => void;      // opcional, disparado após login/cadastro bem‑sucedido
}): JSX.Element;
```
- **Exportação padrão:** a função `AuthModal`.
- **Tipos externos:** `AuthMode` é re‑exportado de `AuthForm` (`"signin" | "signup"`).

---

## 4. Dependências e acoplamentos
| Dependência | Tipo | Motivo |
|-------------|------|--------|
| `react` (`useEffect`, `useMemo`, `useState`) | Externa | Gerenciamento de ciclo de vida e estado. |
| `@/components/ui/Modal` | Interna | Componente genérico de modal. |
| `@/components/auth/AuthForm` | Interna | Formulário de autenticação (recebe `mode`, `setMode`, `onSuccess`). |
| `@/i18n/I18nProvider` (`useI18n`) | Interna | Fornece dicionário de traduções (`dict`). |

Não há dependências circulares conhecidas; o módulo depende apenas de componentes de UI e do provedor de i18n.

---

## 5. Leitura guiada do código (top‑down)

1. **Declaração do componente** – recebe `props` com controle de abertura, callbacks e modo inicial.  
2. **Desestruturação** – `open`, `onClose`, `initialMode` (fallback `"signin"`), `onSuccess`.  
3. **Internacionalização** – `const { dict } = useI18n();` obtém o dicionário corrente.  
4. **Estado local** – `mode` (`AuthMode`) inicializado com `initialMode`.  
5. **Efeito colateral** – `useEffect` sincroniza `mode` sempre que `initialMode` ou `open` mudam, garantindo que o modal sempre abra no modo solicitado.  
6. **Título memoizado** – `useMemo` escolhe a string correta (`dict.common.createAccount` ou `dict.common.signIn`) conforme `mode`.  
7. **Renderização** – `<Modal>` recebe `open`, `onClose` e `title`. Dentro dele, `<AuthForm>` recebe:
   - `mode` e `setMode` (permite troca de modo dentro do formulário),
   - `onSuccess` que primeiro fecha o modal (`onClose`) e depois executa o callback opcional `onSuccess`.

**Decisões de implementação relevantes**
- **Sincronização de `mode` via `useEffect`**: evita que o estado interno fique desatualizado quando o modal é reaberto com um `initialMode` diferente.
- **Uso de `useMemo`**: otimiza a recomposição do título, recalculando apenas quando `dict` ou `mode` mudam.
- **Encadeamento de callbacks**: garante que o fechamento do modal ocorra antes de notificar o chamador de sucesso.

---

## 6. Fluxo de dados / estado / eventos
```
props (open, initialMode) ──► useState(mode) ──► useEffect (sincroniza) ──► AuthForm
          │                                            │
          └─► Modal (open, onClose, title) ◄───────────┘
```
- **Entrada:** `open`, `initialMode`, callbacks.
- **Estado interno:** `mode`.
- **Saída:** `onClose` (quando o usuário fecha ou após sucesso) e `onSuccess` (opcional, disparado após `AuthForm` concluir a operação).

---

## 7. Conexões com outros arquivos do projeto
- **`@/components/ui/Modal`** – componente de modal reutilizável.  
  *Documentação:* [Modal.md](../ui/Modal.md) *(link fictício, substituir pelo caminho real)*
- **`@/components/auth/AuthForm`** – formulário que lida com a lógica de login/cadastro.  
  *Documentação:* [AuthForm.md](../auth/AuthForm.md)
- **`@/i18n/I18nProvider`** – provedor de internacionalização.  
  *Documentação:* [I18nProvider.md](../../i18n/I18nProvider.md)

> **Observação:** Não há importações de módulos externos além de `react`.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Sincronização de `mode`** | Se `initialMode` mudar enquanto o modal está aberto, o `useEffect` ainda o atualiza, podendo gerar mudança inesperada de UI. | Avaliar se a atualização deve ocorrer apenas ao abrir (`open` → `true`). |
| **Dependência de `dict`** | Falha na carga de traduções pode resultar em `undefined` no título. | Garantir fallback seguro (`title ?? ""`). |
| **Acoplamento com `AuthForm`** | O modal depende de `setMode` exposto por `AuthForm`. Qualquer mudança na assinatura de `AuthForm` quebra o contrato. | Definir interface explícita (`AuthFormProps`) em um arquivo de tipos compartilhado. |
| **Teste de acessibilidade** | Modal deve gerenciar foco e aria‑labels. | Incluir testes de acessibilidade (e.g., axe) e validar atributos `aria-*`. |
| **Performance** | `useMemo` é trivial aqui; o ganho é marginal. | Pode ser removido sem prejuízo perceptível, simplificando o código. |

--- 

*Esta documentação foi gerada a partir da análise estática do código-fonte e reflete o comportamento observado. Alterações futuras no código podem requerer atualização desta documentação.*
