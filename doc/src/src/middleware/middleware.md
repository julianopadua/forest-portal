# src/middleware.ts

## 1. Visão geral e responsabilidade
Este módulo define o **middleware** global da aplicação Next.js. Sua única responsabilidade, conforme implementado, é delegar a atualização da sessão do Supabase (Auth) para a função `updateSession` e expor a configuração de *matcher* que determina quais rotas o middleware será executado.

---

## 2. Onde este arquivo se encaixa na arquitetura
- **Camada:** *Infraestrutura / Edge* – o middleware roda na camada de borda (Edge Runtime) antes da renderização das páginas.
- **Domínio:** Autenticação (gerenciamento de sessão) e, potencialmente, internacionalização (i18n) conforme a anotação no comentário.
- **Tipo de artefato:** *Entrypoint* de middleware do Next.js, não um componente UI nem um utilitário genérico.

---

## 3. Interfaces e exports (o que ele expõe)

| Export | Tipo | Descrição |
|--------|------|-----------|
| `middleware` | `async function (request: NextRequest): Promise<NextResponse>` | Função de middleware chamada pelo runtime do Next.js. Recebe o objeto `NextRequest` e devolve um `NextResponse` (já construído por `updateSession`). |
| `config` | `object` | Configuração estática exigida pelo Next.js. Define a propriedade `matcher` que especifica as rotas nas quais o middleware será aplicado. |

---

## 4. Dependências e acoplamentos

| Origem | Tipo | Motivo da dependência |
|--------|------|-----------------------|
| `next/server` (`type NextRequest`) | **Externa** (framework) | Tipo de request usado pelo runtime do Next.js. |
| `@/lib/supabase/middleware` (`updateSession`) | **Interna** | Função responsável por atualizar a sessão do Supabase; encapsula a lógica de autenticação. |

> **Observação:** Não há outras dependências nem importações de módulos auxiliares.

---

## 5. Leitura guiada do código (top‑down)

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
```
- Importa apenas o tipo necessário (`NextRequest`) e a função de atualização de sessão.

```ts
export async function middleware(request: NextRequest) {
  // 1. Atualiza a sessão do Supabase (Auth)
  return await updateSession(request);
  // NOTA: Se você tiver lógica de i18n, ela deve ser combinada aqui.
  // O retorno do updateSession já é um NextResponse que o i18n poderia usar.
}
```
- **Entrada:** `request` – objeto de requisição da Edge Runtime.
- **Processo:** delega imediatamente a `updateSession(request)`. Não há lógica adicional; a função é *transparent*.
- **Saída:** o `NextResponse` retornado por `updateSession`. Comentário indica que, caso exista lógica de internacionalização, ela deve ser inserida antes do `return`.

```ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```
- **Objetivo:** aplicar o middleware a **todas** as rotas, exceto:
  - arquivos estáticos do Next (`_next/static`, `_next/image`);
  - `favicon.ico`;
  - recursos de imagem com extensões listadas.
- A expressão regular usa *negative lookahead* para excluir esses padrões.

### Decisões de implementação
- **Delegação única:** centraliza a lógica de sessão em `updateSession`, facilitando manutenção e testes unitários.
- **Configuração de matcher explícita:** evita execução desnecessária em assets estáticos, reduzindo latência.
- **Comentário de i18n:** deixa a porta aberta para futuras extensões sem alterar a assinatura da função.

---

## 6. Fluxo de dados / estado / eventos
1. **Evento de requisição** – o runtime do Next.js invoca `middleware` com um `NextRequest`.
2. **Passagem de controle** – o objeto `request` é passado para `updateSession`.
3. **Manipulação de sessão** – `updateSession` (fora deste arquivo) lê/atualiza cookies ou headers do Supabase e devolve um `NextResponse`.
4. **Resposta** – o middleware retorna esse `NextResponse`, que será usado para continuar o pipeline de roteamento.

Não há estado interno ao módulo; todo o estado reside nos cookies/headers manipulados por `updateSession`.

---

## 7. Conexões com outros arquivos do projeto
- **`@/lib/supabase/middleware`** – responsável por `updateSession`.  
  [Documentação de `updateSession`](#) *(link placeholder para a documentação interna)*

> Não há importações de outros módulos nem exportações consumidas por outros arquivos, conforme análise estática.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Ausência de tratamento de erros** | Se `updateSession` lançar exceção, o middleware propagará o erro, possivelmente resultando em respostas 500 não controladas. | Envolver a chamada em `try/catch` e retornar um `NextResponse` de erro padronizado. |
| **Acoplamento direto a Supabase** | Trocar o provedor de autenticação exigirá alterações em `updateSession` e possivelmente neste middleware. | Definir uma interface de *session manager* e injetá‑la via dependência (ex.: `const sessionManager = getSessionManager();`). |
| **Comentário de i18n não implementado** | Caso a aplicação precise de internacionalização, a ausência de integração pode gerar comportamento inesperado. | Implementar um wrapper que combine `updateSession` e a lógica de i18n antes de retornar. |
| **Regex de matcher complexa** | Manutenção difícil; alterações nos caminhos estáticos do Next.js podem exigir atualização da expressão. | Substituir por configuração baseada em `exclude` ou usar a API `matcher` do Next.js com arrays de strings mais explícitos. |
| **Tipagem limitada** | O retorno de `middleware` depende da tipagem de `updateSession`; se mudar, o tipo pode ficar desatualizado. | Exportar o tipo `NextResponse` explicitamente ou usar `ReturnType<typeof updateSession>` para garantir consistência. |

--- 

*Documentação gerada em conformidade com as diretrizes internas de estilo e estrutura.*
