## 1. Visão geral e responsabilidade  

O módulo **`src/lib/supabase/server.ts`** encapsula a criação de um cliente Supabase configurado para uso em *Server Components* do Next.js.  
Ele expõe a função assíncrona `createClient`, que instancia `createServerClient` com as credenciais do projeto (URL e chave pública) e fornece uma implementação de gerenciamento de cookies compatível com a API de headers do Next.js.

---

## 2. Onde este arquivo se encaixa na arquitetura  

| Camada / Domínio | Propósito |
|------------------|-----------|
| **Infraestrutura / Persistência** | Abstrai a comunicação com o serviço Supabase (BaaS). |
| **Utilitário de servidor** | Disponibiliza um cliente pronto para ser usado em rotas API, *Server Actions* ou *Server Components*. |
| **Dependência de UI** | Não há dependência direta da camada de UI; o cliente pode ser consumido por qualquer camada que necessite de acesso ao banco. |

---

## 3. Interfaces e exports  

| Export | Tipo | Descrição |
|--------|------|-----------|
| `createClient` | `() => Promise<ReturnType<typeof createServerClient>>` | Função assíncrona que devolve uma instância configurada do Supabase Server Client. Não há outras exportações. |

---

## 4. Dependências e acoplamentos  

| Tipo | Pacote | Motivo |
|------|--------|--------|
| **Externa** | `@supabase/ssr` | Fornece `createServerClient`, a API SSR do Supabase. |
| **Externa** | `next/headers` | Exporta `cookies()`, que permite ler e escrever cookies no contexto de um *Server Component*. |
| **Interna** | Nenhuma | O módulo não importa outros arquivos do repositório. |

Acoplamento: o código depende fortemente da interface de cookies do Next.js (`cookies().getAll()` / `cookies().set`). Qualquer mudança nessa API exigirá ajuste no wrapper de cookies.

---

## 5. Leitura guiada do código (top‑down)

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // 1. Obtém o store de cookies do Next.js (await necessário porque a API pode ser async)
  const cookieStore = await cookies();

  // 2. Instancia o cliente Supabase para SSR, passando:
  //    • URL e chave pública (variáveis de ambiente obrigatórias)
  //    • Um adaptador de cookies que delega as operações ao `cookieStore`
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Leitura: devolve todas as cookies presentes na requisição
        getAll() {
          return cookieStore.getAll();
        },
        // Escrita: tenta persistir cada cookie; falha silenciosa em Server Components
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Em Server Components `set` não está disponível.
            // O comentário indica que a falha pode ser ignorada se houver middleware
            // que sincroniza a sessão.
          }
        },
      },
    }
  );
}
```

**Decisões de implementação relevantes**

* **Uso de `!` nas variáveis de ambiente** – Assume que as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` estão definidas em tempo de execução; caso contrário, o código lançará um erro de *runtime*.
* **Wrapper de cookies** – Necessário porque o cliente SSR do Supabase espera um objeto com `getAll`/`setAll`. O wrapper delega diretamente ao `cookieStore` do Next.js, garantindo consistência entre as duas bibliotecas.
* **Tratamento de exceção em `setAll`** – Captura falhas ao chamar `cookieStore.set` em contextos onde a escrita de cookies não é permitida (ex.: Server Components). A estratégia adotada é ignorar o erro, delegando a atualização de sessão a um middleware, se houver.

---

## 6. Fluxo de dados / estado / eventos  

1. **Entrada** – Variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) e o *store* de cookies obtido via `cookies()`.  
2. **Processamento** – Criação do cliente Supabase com o adaptador de cookies.  
3. **Saída** – Instância do Supabase Server Client, que pode ser usada para:
   * Consultas ao banco (SELECT, INSERT, UPDATE, DELETE).  
   * Gerenciamento de autenticação (login, logout, refresh).  
   * Qualquer operação que dependa de cookies para manter a sessão.

Não há eventos explícitos; a única mutação de estado ocorre ao chamar `cookieStore.set` dentro de `setAll`.

---

## 7. Conexões com outros arquivos do projeto  

* **Importado por** – Nenhum módulo do repositório importa este arquivo (conforme análise estática).  
* **Importa** – Não há importações internas; apenas dependências externas (`@supabase/ssr`, `next/headers`).  

> **Observação:** Caso futuros componentes ou rotas precisem de acesso ao Supabase, deverão importar `createClient` a partir deste módulo.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Variáveis de ambiente obrigatórias** (`!`) | Falha em produção se não definidas. | Validar explicitamente no início da função e lançar erro com mensagem clara. |
| **Silenciamento de erro em `setAll`** | Pode mascarar problemas de sincronização de sessão. | Logar o erro (ex.: `console.warn`) ou expor um hook de callback para tratamento opcional. |
| **Acoplamento ao API de cookies do Next.js** | Quebra de compatibilidade em futuras versões do Next.js. | Isolar o wrapper de cookies em um módulo separado (`src/lib/cookiesAdapter.ts`) para facilitar a substituição. |
| **Ausência de tipagem explícita** para o objeto retornado | Reduz a intelisense e a verificação estática. | Exportar um tipo `SupabaseClient = ReturnType<typeof createServerClient>` e utilizá‑lo nas assinaturas. |
| **Teste unitário** – Não há cobertura de teste. | Dificulta a garantia de comportamento em mudanças. | Implementar testes que mockam `cookies()` e verificam que `createServerClient` recebe o adaptador correto. |

Implementar as recomendações acima aumentará a robustez, a manutenibilidade e a observabilidade do módulo.
