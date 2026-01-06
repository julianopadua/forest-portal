# 📄 Documentação – `src/hooks/useSupabaseUser.ts`

---

## 1. Visão geral e responsabilidade
O hook **`useSupabaseUser`** encapsula a lógica de obtenção e monitoramento do usuário autenticado via Supabase.  
Ele fornece, de forma reativa, duas informações essenciais para a camada de UI:

| Valor   | Tipo                     | Significado                                    |
|---------|--------------------------|-----------------------------------------------|
| `user`  | `User \| null`           | Dados do usuário autenticado ou `null` quando inexistente ou em erro. |
| `loading`| `boolean`                | Indica se a verificação inicial ainda está em andamento. |

O hook garante que o estado seja atualizado tanto na carga inicial quanto em mudanças subsequentes de sessão (login, logout, refresh).

---

## 2. Onde este arquivo se encaixa na arquitetura
- **Camada:** *Presentation / UI* – hooks React que expõem estado para componentes.
- **Domínio:** *Autenticação* – centraliza a interação com o serviço de identidade Supabase.
- **Tipo:** *Utilitário de estado* – não contém lógica de negócios, apenas orquestra chamadas ao cliente Supabase.

---

## 3. Interfaces e exports (o que ele expõe)

```ts
export function useSupabaseUser(): {
  user: User | null;
  loading: boolean;
}
```

- **Retorno:** objeto contendo `user` e `loading`. Não há tipos adicionais exportados.

---

## 4. Dependências e acoplamentos

| Dependência | Tipo | Motivo do uso |
|-------------|------|---------------|
| `react` (`useEffect`, `useState`) | Biblioteca externa | Gerenciamento de ciclo de vida e estado do hook. |
| `@supabase/supabase-js` (`User`) | Tipo externo | Tipagem do objeto de usuário retornado por Supabase. |
| `@/lib/supabase/client` (`createClient`) | Módulo interno | Fabrica a instância configurada do cliente Supabase. |

> **Acoplamento:** O hook depende diretamente da assinatura de `supabase.auth.getUser` e `supabase.auth.onAuthStateChange`. Qualquer mudança na API desses métodos exigirá atualização do hook.

---

## 5. Leitura guiada do código (top‑down)

1. **Importações e criação do cliente**  
   ```ts
   import { useEffect, useState } from "react";
   import type { User } from "@supabase/supabase-js";
   import { createClient } from "@/lib/supabase/client";

   const supabase = createClient();
   ```
   - `createClient` devolve uma instância única (ou configurada por ambiente) que será reutilizada durante o ciclo de vida do hook.

2. **Definição de estado local**  
   ```ts
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);
   ```
   - `user` inicia como `null`; `loading` como `true` para sinalizar a verificação assíncrona inicial.

3. **`useEffect` – efeito colateral principal**  
   - **Variável de controle `alive`**: impede atualizações de estado após o componente ser desmontado.
   - **Consulta inicial (`supabase.auth.getUser`)**:  
     ```ts
     const { data, error } = await supabase.auth.getUser();
     ```
     - Em caso de erro, limpa o usuário e encerra o loading.
     - Caso sucesso, popula `user` com `data.user` (ou `null` se ausente) e finaliza o loading.
   - **Assinatura ao evento de mudança de autenticação**:  
     ```ts
     const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
       if (!alive) return;
       setUser(session?.user ?? null);
     });
     ```
     - Atualiza `user` sempre que a sessão mudar (login, logout, refresh). O parâmetro `_event` é ignorado, pois o hook só precisa do usuário final.
   - **Cleanup**:  
     ```ts
     return () => {
       alive = false;
       sub.subscription.unsubscribe();
     };
     ```
     - Marca o hook como “não vivo” e cancela a inscrição para evitar vazamento de memória.

4. **Retorno**  
   ```ts
   return { user, loading };
   ```
   - O objeto retornado pode ser desestruturado nos componentes consumidores.

### Decisões de implementação relevantes
- **Flag `alive`**: evita *state updates on unmounted components*, prática recomendada quando se lida com chamadas assíncronas dentro de `useEffect`.
- **Separação de carga inicial e eventos subsequentes**: a chamada `getUser` garante que o estado reflita a sessão já existente antes de qualquer evento de mudança.
- **Dependência do `supabase` no array de dependências**: garante que, caso a instância seja recriada (ex.: mudança de configuração), o efeito será reexecutado.

---

## 6. Fluxo de dados/estado/eventos

```
[Componente monta] ──► useSupabaseUser()
   │
   ├─► useEffect inicia
   │    ├─► async getUser()
   │    │    ├─► sucesso → setUser(data.user) , setLoading(false)
   │    │    └─► erro   → setUser(null)      , setLoading(false)
   │    └─► onAuthStateChange subscription
   │         └─► evento (login/logout/refresh) → setUser(session?.user)
   │
   └─► retorno { user, loading } disponibilizado ao componente
```

- **Estado `loading`** permanece `true` até que a primeira chamada a `getUser` conclua.
- **Estado `user`** pode mudar múltiplas vezes ao longo da vida do componente, refletindo a sessão atual.

---

## 7. Conexões com outros arquivos do projeto

- **`@/lib/supabase/client`** – módulo responsável por criar e exportar a instância Supabase.  
  Documentação: [src/lib/supabase/client.ts](/src/lib/supabase/client.ts) *(link placeholder)*

> **Nota:** Não há importações ou exportações adicionais; o hook não é consumido por outros módulos dentro do repositório (pelo menos até o momento da análise).

---

## 8. Pontos de atenção, riscos e melhorias recomendadas

| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Gerenciamento de erros** | O hook apenas limpa o usuário e encerra o loading em caso de erro, sem expor a causa. | Propagar o erro (ex.: `error` no retorno) ou registrar em log para facilitar depuração. |
| **Tipagem de evento** | O parâmetro `_event` de `onAuthStateChange` é ignorado, mas pode ser útil para diferenciar `SIGNED_IN`, `SIGNED_OUT`, etc. | Expor o tipo de evento ao consumidor ou usar para lógica condicional mais refinada. |
| **Recriação de cliente** | `createClient` é chamado a cada renderização do hook, embora a implementação provável retorne um singleton. | Garantir que `createClient` seja memoizado ou mover a chamada para fora do hook (ex.: contexto). |
| **Teste unitário** | Não há cobertura de teste explícita para o hook. | Implementar testes com `@testing-library/react-hooks` simulando respostas de `supabase.auth`. |
| **Cancelamento de requisição** | O `alive` flag impede atualizações pós‑desmontagem, mas a requisição HTTP ainda pode ser concluída. | Utilizar `AbortController` (se suportado pela SDK) para abortar a chamada `getUser` no cleanup. |

--- 

*Documentação gerada em conformidade com as diretrizes internas de estilo e estrutura.*
