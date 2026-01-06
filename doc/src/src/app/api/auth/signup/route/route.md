## 1. Visão geral e responsabilidade
Este módulo implementa o endpoint **POST /api/auth/signup**.  
Ele recebe os dados de cadastro (username, email opcional e password), valida‑os, garante unicidade do username, cria o usuário no Supabase Auth (via client com privilégios de *service role*), assegura a presença do registro em `profiles` e, por fim, inicia a sessão retornando os cookies de autenticação.

---

## 2. Onde este arquivo se encaixa na arquitetura
- **Camada:** API (rotas server‑side).  
- **Domínio:** Autenticação / Cadastro de usuários.  
- **Tipo:** *Route handler* do Next.js (arquivo `route.ts` dentro de `src/app/api/...`).  
- **Responsabilidade:** Orquestrar a lógica de signup, interagindo com o Supabase (client SSR e admin client) e com a camada de persistência (`profiles`).

---

## 3. Interfaces e exports
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```
- **Exportação única:** a função `POST` que o Next.js invoca para atender requisições HTTP `POST` na rota correspondente.  
- Não há outras exportações nem tipos públicos; as funções auxiliares (`normalizeUsername`, `makeSyntheticEmail`) são privadas ao módulo.

---

## 4. Dependências e acoplamentos
| Dependência | Tipo | Uso |
|-------------|------|-----|
| `next/server` (`NextRequest`, `NextResponse`) | Externa | Manipulação de request/response HTTP no Next.js. |
| `@supabase/ssr` (`createServerClient`) | Externa | Cliente Supabase configurado para SSR, permite leitura/escrita de cookies. |
| `@/lib/supabase/admin` (`createAdminClient`) | Interna | Cliente Supabase com privilégios de *service role* usado para criar usuários e fazer upsert em `profiles`. |
| `process.env` | Implícita | Variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). |

Não há importações de outros módulos da aplicação além de `createAdminClient`; portanto o acoplamento externo é limitado ao SDK do Supabase.

---

## 5. Leitura guiada do código (top‑down)

1. **Helpers locais**  
   - `normalizeUsername`: remove espaços, converte para minúsculas e elimina caracteres fora do conjunto `[a‑z0‑9._-]`.  
   - `makeSyntheticEmail`: gera um e‑mail fictício `username@noemail.local` quando o usuário não fornece e‑mail.

2. **Assinatura `POST`**  
   - Inicializa `response` como `NextResponse.json({ ok: true })`.  
   - Cria o cliente Supabase SSR (`supabase`) passando as credenciais públicas e um adaptador de cookies que sincroniza as alterações com `response`.

3. **Parsing e validação de payload**  
   - Lê o corpo JSON; se falhar, `body` fica `null`.  
   - Normaliza `username`, obtém `email` (ou string vazia) e `password`.  
   - Valida tamanho mínimo de `username` (≥3) e `password` (≥6); retorna 400 em caso de falha.

4. **Verificação de unicidade**  
   - Consulta a tabela `profiles` por `username`.  
   - Se já existir, responde 409 (conflito).

5. **Criação do usuário no Auth**  
   - Determina `authEmail` (e‑mail fornecido ou sintético).  
   - Usa `admin.auth.admin.createUser` com `email_confirm: true` para evitar fluxo de verificação.  
   - Em caso de erro, retorna 400 com mensagem.

6. **Garantia de registro em `profiles`**  
   - Executa `upsert` na tabela `profiles` usando `id` do usuário recém‑criado; garante que `username` e `full_name` estejam presentes.

7. **Login automático**  
   - Chama `supabase.auth.signInWithPassword` com o mesmo e‑mail e senha.  
   - Caso falhe, responde 400 indicando que o signup ocorreu, mas o signin não.

8. **Retorno final**  
   - Se tudo ocorreu sem erros, devolve o `response` já contendo os cookies de sessão.

**Invariantes importantes**
- `username` sempre está normalizado antes de qualquer operação de banco.  
- O e‑mail usado para Auth nunca é nulo (synthetic fallback).  
- O cliente SSR e o admin client utilizam credenciais distintas (públicas vs. service role), mantendo a separação de privilégios.

---

## 6. Fluxo de dados/estado/eventos
1. **Entrada:** `NextRequest` contendo JSON `{ username, email?, password }`.  
2. **Transformação:** Normalização de `username`; geração de e‑mail sintético se necessário.  
3. **Persistência:**  
   - Consulta `profiles` → verifica existência.  
   - `admin.auth.admin.createUser` → cria registro em Auth.  
   - `admin.from("profiles").upsert` → garante registro em `profiles`.  
4. **Estado de sessão:** `supabase.auth.signInWithPassword` cria sessão; cookies são inseridos em `response` via adaptador de cookies.  
5. **Saída:** `NextResponse` JSON `{ ok: true }` (ou `{ ok: false, error: … }`) com cookies de sessão quando bem‑sucedido.

---

## 7. Conexões com outros arquivos do projeto
- **Importa:** `createAdminClient` de `src/lib/supabase/admin` (documentação interna não fornecida).  
- **Não há importações adicionais** nem arquivos que importem este módulo diretamente (conforme metadados do repositório).  

> **Nota:** Caso existam rotas ou componentes que consumam a resposta deste endpoint, eles não são detectáveis a partir do código apresentado.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Validação de e‑mail** | O fallback sintético permite cadastros sem e‑mail real, o que pode gerar contas “fantasmas”. | Avaliar política de obrigatoriedade de e‑mail ou implementar mecanismo de recuperação. |
| **Exposição de mensagens de erro** | Erros do Supabase são repassados diretamente ao cliente (`cErr?.message`). | Sanitizar mensagens para evitar vazamento de detalhes internos. |
| **Hard‑coded limites** (`username` ≥3, `password` ≥6) | Não configuráveis; podem precisar de ajustes futuros. | Extrair para constantes ou variáveis de configuração. |
| **Uso de `email_confirm: true`** | Contorna fluxo de verificação de e‑mail, potencial risco de contas não verificadas. | Avaliar necessidade de confirmação ou implementar verificação posterior. |
| **Sincronização de cookies** | O adaptador substitui `response` antes de definir cookies; pode gerar perda de cabeçalhos adicionais. | Garantir que nenhum outro cabeçalho seja sobrescrito ou usar `response.clone()` antes da substituição. |
| **Tratamento de exceções genéricas** | Falhas inesperadas (ex.: falha de rede ao Supabase) retornam 400 genérico. | Implementar tratamento de erros mais granular (ex.: 502 para falhas de serviço externo). |
| **Teste de concorrência** | Não há controle explícito de race conditions ao criar usernames simultâneos. | Confiar no `unique` constraint da DB; garantir que a tabela `profiles` possua índice único em `username`. |
| **Dependência de variáveis de ambiente** | `!` (non‑null assertion) pode lançar erro em tempo de execução se variáveis ausentes. | Validar presença das variáveis na inicialização da aplicação. |

Implementar as melhorias acima aumentará a robustez, segurança e manutenibilidade do endpoint de cadastro.
