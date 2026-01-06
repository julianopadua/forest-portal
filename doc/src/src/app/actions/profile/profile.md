# 📄 Documentação – `src/app/actions/profile.ts`

---

## 1. Visão geral e responsabilidade
Módulo **server‑side** que encapsula a lógica de atualização do perfil de usuário.  
- Recebe os dados enviados por um `<form>` (objeto `FormData`).  
- Persiste as alterações na tabela **`profiles`** do Supabase.  
- Gera um objeto de estado (`ProfileState`) indicando sucesso ou falha.  
- Invalida o cache da rota **`/settings`** para que a UI reflita as mudanças imediatamente.

---

## 2. Onde este arquivo se encaixa na arquitetura
| Camada | Domínio | Comentário |
|--------|---------|------------|
| **Application / Service** | **Perfil de usuário** | Função de ação que orquestra acesso a dados e controle de cache. |
| **Server‑only** | Não expõe UI diretamente, mas é consumido por componentes **Next.js Server Actions**. |
| **Utilitário** | Usa `createClient` (wrapper Supabase) e `revalidatePath` (Next.js). |

---

## 3. Interfaces e exports (o que ele expõe)

```ts
/** Estado retornado pelas actions de perfil. */
export type ProfileState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

/**
 * Action server‑side que atualiza o perfil do usuário autenticado.
 *
 * @param prevState  Estado anterior (não utilizado, mantido por convenção de Server Actions).
 * @param formData   Dados do formulário contendo `fullName`, `username` e `bio`.
 * @returns          Novo `ProfileState` indicando o resultado da operação.
 */
export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState>;
```

- **Exportações públicas:** `ProfileState` e `updateProfile`.

---

## 4. Dependências e acoplamentos

| Tipo | Módulo | Motivo da dependência |
|------|--------|-----------------------|
| **Externa** | `next/cache` (`revalidatePath`) | Invalidação de rotas estáticas após mutação. |
| **Externa** | `@/lib/supabase/server` (`createClient`) | Cria cliente Supabase configurado para ambiente server. |
| **Interna** | Nenhuma importação de código do repositório (apenas utilitários externos). |
| **Acoplamento** | Fortemente acoplado ao esquema da tabela `profiles` (colunas `full_name`, `username`, `bio`, `updated_at`, `id`). Qualquer mudança no schema requer ajuste nesta action. |

---

## 5. Leitura guiada do código (top‑down)

1. **Modo estrito de servidor** – `"use server"` garante que a função só será executada no servidor, evitando vazamento de credenciais.  
2. **Criação do cliente Supabase** – `await createClient()` (assincrono) fornece acesso autenticado ao banco.  
3. **Obtenção do usuário corrente** – `supabase.auth.getUser()`; se `user` for `null`, a ação termina com erro de autenticação.  
4. **Extração dos campos do `FormData`** – `fullName`, `username`, `bio` são convertidos para `string`. Não há validação adicional; assume‑se que o formulário já sanitizou os valores.  
5. **Persistência** – `supabase.from("profiles").update({...}).eq("id", user.id)`.  
   - Atualiza `full_name`, `username`, `bio` e `updated_at`.  
   - `updated_at` recebe timestamp ISO gerado no servidor.  
6. **Tratamento de erro** – Se `error` for retornado, loga no console e devolve `status: 'error'`.  
7. **Revalidação de cache** – `revalidatePath("/settings")` força a regeneração da página de configurações na próxima requisição.  
8. **Retorno de sucesso** – Estado final com `status: 'success'` e mensagem amigável.

**Decisões de implementação relevantes**
- O parâmetro `prevState` não é usado; mantido para compatibilidade com a assinatura padrão de Server Actions do Next.js.  
- Não há tratamento de exceções inesperadas (ex.: falha de rede); a ação depende exclusivamente do objeto `error` retornado pelo Supabase.  
- O timestamp é gerado com `new Date().toISOString()`, garantindo consistência de fuso horário (UTC).

---

## 6. Fluxo de dados / estado / eventos

```
FormData (client) ──► updateProfile (server) ──► Supabase (DB)
      │                                            │
      └─► revalidatePath("/settings") ◄────────────┘
```

- **Entrada:** `FormData` contendo os campos do perfil.  
- **Saída:** `ProfileState` (status + mensagem).  
- **Evento colateral:** Invalidação de cache da rota `/settings`.

---

## 7. Conexões com outros arquivos do projeto

| Arquivo | Tipo de vínculo | Comentário |
|---------|----------------|------------|
| `src/lib/supabase/server.ts` | Importação (`createClient`) | Wrapper que configura o cliente Supabase com credenciais de servidor. |
| Qualquer componente Next.js que invoque `updateProfile` via **Server Action** (ex.: `src/app/settings/page.tsx`) | Consumo implícito | Não há importação direta; a ação é referenciada no atributo `action` de um `<form>`. |
| Nenhum outro módulo importa explicitamente `profile.ts`. |

*(Links para a documentação interna podem ser inseridos nos campos “Arquivo” acima quando disponíveis.)*

---

## 8. Pontos de atenção, riscos e melhorias recomendadas

| Área | Risco / Problema | Recomendações |
|------|------------------|---------------|
| **Validação de entrada** | Não há sanitização ou verificação de comprimento/formato. | Aplicar validação (ex.: Zod, Yup) antes de chamar a action ou dentro dela. |
| **Tratamento de exceções** | Apenas o `error` do Supabase é considerado; falhas de rede ou exceções inesperadas podem gerar rejeição não capturada. | Envolver a chamada ao Supabase em `try/catch` e mapear exceções para `ProfileState`. |
| **Acoplamento ao schema** | Campos da tabela são hard‑coded. | Extrair nomes de colunas para constantes ou usar tipagem gerada a partir do schema. |
| **Revalidação de caminho** | Caminho fixo (`/settings`). Caso a rota mude, a ação ficará desatualizada. | Tornar o caminho configurável ou usar `revalidateTag` se houver múltiplas páginas dependentes. |
| **Uso de `prevState`** | Parâmetro inutilizado pode confundir desenvolvedores. | Remover ou documentar explicitamente que o parâmetro é ignorado por compatibilidade. |
| **Logging** | Apenas `console.error` é usado; em produção pode ser insuficiente. | Integrar com sistema de logging estruturado (ex.: Sentry, Winston). |
| **Testabilidade** | Função depende diretamente de `createClient`; dificulta mocks. | Injetar o cliente Supabase como dependência (ex.: parâmetro opcional) para facilitar testes unitários. |

--- 

*Esta documentação reflete o estado do código no momento da análise. Qualquer alteração futura deve ser acompanhada de atualização correspondente.*
