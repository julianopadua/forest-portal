## 1. Visão geral e responsabilidade
O módulo **`src/app/api/auth/login/route.ts`** implementa o endpoint HTTP **POST** responsável por autenticar usuários da aplicação. Ele aceita um payload JSON contendo `identifier` (e‑mail ou nome de usuário) e `password`, resolve o e‑mail quando o identificador for um nome de usuário e, por fim, delega a verificação de credenciais ao Supabase Auth. Em caso de sucesso, a resposta inclui os cookies de sessão gerados pelo Supabase; em falha, retorna erro 400 ou 401 com mensagem apropriada.

---

## 2. Posicionamento na arquitetura
- **Camada:** API (rotas server‑side do Next.js).  
- **Domínio:** Autenticação / Segurança.  
- **Tipo de artefato:** *Route handler* (arquivo `route.ts` que exporta a função `POST` reconhecida pelo roteamento do Next.js).  
- **Interação:** Não expõe UI nem lógica de negócio; atua como adaptador entre a camada de transporte HTTP e os serviços Supabase.

---

## 3. Interfaces e exports
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```
- **Entrada:** `NextRequest` contendo cabeçalhos, cookies e corpo JSON.  
- **Saída:** `NextResponse` JSON com `{ ok: true }` em caso de sucesso ou `{ ok: false, error: string }` em caso de erro, além de possíveis cookies de sessão.

Nenhum outro export é definido.

---

## 4. Dependências e acoplamentos
| Tipo | Pacote / módulo | Motivo do uso |
|------|----------------|---------------|
| **Externa** | `next/server` (`NextRequest`, `NextResponse`) | Manipulação de requisição/ resposta no ambiente Next.js. |
| **Externa** | `@supabase/ssr` (`createServerClient`) | Cliente Supabase configurado para SSR, permite acesso a Auth e ao banco. |
| **Interna** | `@/lib/supabase/admin` (`createAdminClient`) | Cliente Supabase com privilégios de *service role* usado para buscar e‑mail a partir do `id` do usuário. |
| **Nativa** | `process.env` | Variáveis de ambiente contendo URL e chave pública do Supabase. |

O módulo **não** possui dependências circulares e não é importado por outros arquivos (conforme análise estática).

---

## 5. Leitura guiada do código (top‑down)

1. **Função utilitária `isEmailLike`**  
   ```ts
   function isEmailLike(v: string) {
     return v.includes("@") && v.includes(".");
   }
   ```
   - Verifica de forma simples se a string tem formato de e‑mail.  
   - Não valida domínio ou caracteres especiais; serve apenas para decidir se o `identifier` deve ser tratado como nome de usuário.

2. **Declaração da handler `POST`**  
   - Inicializa `response` como `NextResponse.json({ ok: true })`.  
   - Cria o cliente Supabase SSR (`supabase`) configurando callbacks de cookies que delegam leitura ao request e escrita ao objeto `response`.

3. **Parsing do corpo**  
   - `await request.json().catch(() => null)` protege contra payload inválido.  
   - Extrai `identifier` (trim) e `password`, converte ambos para `string`.

4. **Validação de presença**  
   - Se algum campo estiver ausente, responde **400** com erro `"Missing credentials"`.

5. **Resolução de e‑mail**  
   - Se `identifier` não parece e‑mail, consulta a tabela `profiles` (coluna `username`) para obter o `id`.  
   - Caso a consulta falhe ou não encontre `id`, responde **401** `"Invalid credentials"`.  
   - Usa `createAdminClient` (service role) para chamar `admin.auth.admin.getUserById` e obter o e‑mail real do usuário.  
   - Falhas nesta etapa também resultam em **401**.

6. **Autenticação com Supabase**  
   - `supabase.auth.signInWithPassword({ email, password })`.  
   - Se houver erro, responde **401** `"Invalid credentials"`.

7. **Retorno final**  
   - Em caso de sucesso, devolve o objeto `response` já contendo os cookies de sessão definidos pelo Supabase.

**Decisões de implementação relevantes**
- **Uso de cliente admin** apenas quando necessário, evitando exposição de privilégios a chamadas de login padrão.  
- **Manipulação de cookies** via callbacks permite que o Supabase escreva cookies de sessão diretamente na resposta.  
- **Resposta padrão `{ ok: true }`** simplifica o contrato de API; detalhes da sessão são geridos pelos cookies.

---

## 6. Fluxo de dados / estado
1. **Entrada**: JSON `{ identifier, password }` + cookies da requisição.  
2. **Transformação**:  
   - `identifier` → possivelmente `email` (via lookup em `profiles` + admin SDK).  
   - `password` permanece inalterado.  
3. **Saída**:  
   - `NextResponse` JSON (`ok: true/false`).  
   - Cookies de sessão (`supabase.auth`) inseridos na resposta quando a autenticação tem sucesso.  
4. **Estado interno**: apenas variáveis locais (`response`, `email`, `supabase`); não há estado persistente no módulo.

---

## 7. Conexões com outros arquivos do projeto
- **Importa** `createAdminClient` de `@/lib/supabase/admin`.  
  - *Link de documentação*: `../lib/supabase/admin` (arquivo que encapsula a criação do cliente Supabase com credenciais de serviço).  
- **Não há** importações adicionais nem arquivos que importem este route handler (ponto de entrada do Next.js).

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Validação fraca de e‑mail** (`isEmailLike`) | Pode classificar strings inválidas como e‑mail, levando a consultas desnecessárias ou falhas de autenticação. | Substituir por regex RFC‑5322 ou biblioteca de validação. |
| **Exposição de `admin.auth`** | O cliente admin tem permissões de *service role*; uso indevido pode comprometer segurança. | Garantir que `createAdminClient` seja configurado com escopo mínimo e que o código nunca exponha o objeto admin fora deste fluxo. |
| **Tratamento genérico de erros** | Respostas de erro sempre retornam `"Invalid credentials"`; dificulta depuração de falhas internas (ex.: erro de conexão). | Logar detalhes de erro (sem expor ao cliente) usando mecanismo de logging centralizado. |
| **Dependência de variáveis de ambiente** | Falta de fallback pode gerar exceção se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` estiverem ausentes. | Validar presença das variáveis no início da aplicação e lançar erro de configuração claro. |
| **Uso de `maybeSingle`** | Retorna `null` quando não há registro, mas pode lançar erro inesperado se houver múltiplos. | Garantir unicidade de `username` via constraint no banco ou tratar caso de múltiplos explicitamente. |
| **Ausência de tipagem explícita** | Função `POST` retorna `any` implícito. | Definir tipo de retorno `Promise<NextResponse>` e tipar objetos intermediários (`profile`, `uRes`). |

Implementar as melhorias acima aumentará a robustez, a segurança e a manutenibilidade do endpoint de login.
