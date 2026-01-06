# 📄 Documentação – `src/app/auth/callback/route.ts`

---

## 1. Visão geral e responsabilidade
Este módulo implementa o **handler GET** da rota de callback de autenticação (`/auth/callback`).  
Sua responsabilidade é:

1. Receber o parâmetro `code` retornado pelo provedor OAuth (Supabase).  
2. Trocar esse código por uma sessão autenticada via `supabase.auth.exchangeCodeForSession`.  
3. Redirecionar o usuário para a URL de destino (`next`) ou, em caso de falha, para a página de erro (`/join?error=auth_code_error`).  

O fluxo inclui proteção contra *open‑redirect* ao validar o parâmetro `next`.

---

## 2. Onde este arquivo se encaixa na arquitetura
- **Camada:** *Server‑Side* (API route do Next.js).  
- **Domínio:** *Autenticação* – parte do fluxo OAuth/OIDC.  
- **Tipo:** *Roteador* (endpoint HTTP) que atua como ponte entre o cliente e o serviço de identidade (Supabase).  

---

## 3. Interfaces e exports
```ts
export async function GET(request: Request): Promise<NextResponse>
```
- **Exportação:** Apenas a função `GET`, que segue a convenção de rotas do Next.js (`app/*/route.ts`).  
- **Funções internas (não exportadas):** `safeNext(next: string | null): string`.

---

## 4. Dependências e acoplamentos
| Tipo | Módulo | Motivo do uso |
|------|--------|---------------|
| **Interna** | `@/lib/supabase/server` (exporta `createClient`) | Cria uma instância do cliente Supabase configurada para o ambiente server. |
| **Externa** | `next/server` (exporta `NextResponse`) | Constrói respostas HTTP (redirecionamentos) compatíveis com a API Edge/Serverless do Next.js. |
| **Externa (runtime)** | Supabase JS SDK (acessado via `supabase.auth.exchangeCodeForSession`) | Realiza a troca do *authorization code* por tokens de sessão. |

Não há dependências circulares nem importações de outros módulos da aplicação.

---

## 5. Leitura guiada do código (top‑down)

1. **Importações** – trazem o cliente Supabase e a classe de resposta do Next.js.  
2. **`safeNext`** – garante que o parâmetro `next` seja uma rota interna:  
   - Se `null` ou vazio → `/`.  
   - Se não iniciar com `/` → `/` (previne redirecionamento para domínios externos).  
3. **`GET`** – ponto de entrada da rota.  
   - **Parsing da URL**: `new URL(request.url)` extrai `searchParams` e `origin`.  
   - **Leitura de parâmetros**: `code` (obrigatório para troca) e `next` (destino pós‑login).  
   - **Validação de `code`**: somente prossegue se presente.  
   - **Criação do cliente Supabase**: `await createClient()`.  
   - **Troca do código**: `supabase.auth.exchangeCodeForSession(code)`.  
   - **Redirecionamento de sucesso**: `NextResponse.redirect(`${origin}${next}`)`.  
   - **Redirecionamento de erro**: caso falhe a troca ou `code` esteja ausente, redireciona para `${origin}/join?error=auth_code_error`.  

### Decisões de implementação relevantes
- **Proteção contra open‑redirect** centralizada em `safeNext`.  
- **Uso de `origin`** para garantir que o redirecionamento permaneça no mesmo domínio, evitando vulnerabilidades de *host header injection*.  
- **Retorno imediato** após o primeiro `redirect`, evitando lógica adicional desnecessária.

---

## 6. Fluxo de dados / estado / eventos
```
Request → URL (searchParams) → code & next → safeNext(next) → Supabase client → exchangeCodeForSession(code)
   │                                                                                     │
   └─► Success? ──► Redirect to `${origin}${next}` ──► Browser navigation
   └─► Failure ──► Redirect to `${origin}/join?error=auth_code_error`
```
- **Estado interno:** nenhum (função pura, sem mutação de variáveis globais).  
- **Eventos:** apenas o *HTTP GET* que dispara o fluxo descrito acima.

---

## 7. Conexões com outros arquivos do projeto
- **`@/lib/supabase/server`** – módulo responsável por configurar e exportar `createClient`.  
  - *Link de documentação*: `src/lib/supabase/server.ts` (não fornecido).  

Não há outras importações nem exportações que referenciem este arquivo.

---

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Área | Observação | Recomendações |
|------|------------|--------------|
| **Validação de `next`** | `safeNext` aceita apenas caminhos que começam com `/`. Caso a aplicação precise redirecionar para sub‑domínios confiáveis, a lógica atual bloqueará. | Tornar a lista de domínios permitidos configurável ou usar uma whitelist de URLs. |
| **Tratamento de erros** | O código ignora detalhes do erro retornado por `exchangeCodeForSession`. | Logar `error` (ex.: via `console.error` ou serviço de observabilidade) e, se possível, expor mensagens de erro mais específicas ao usuário. |
| **Segurança** | Não há verificação de *state* ou *PKCE* que normalmente acompanham o fluxo OAuth. | Garantir que o fluxo completo de OAuth (geração e validação de `state`/`code_verifier`) seja implementado em outras partes da aplicação. |
| **Tipagem** | `request: Request` vem do padrão Web API; pode ser refinado para `NextRequest` se necessário. | Importar `NextRequest` de `next/server` para melhorar a tipagem e evitar incompatibilidades. |
| **Testabilidade** | Função `GET` depende de chamadas externas (Supabase). | Injetar o cliente Supabase como parâmetro ou usar mock em testes unitários. |
| **Observabilidade** | Nenhum registro de métricas ou tracing. | Adicionar logs estruturados (ex.: início/fim da troca de código, tempo de resposta). |
| **Performance** | Cada chamada cria um novo cliente Supabase. | Avaliar reutilização de instâncias ou pooling se o custo de criação for significativo. |

---
