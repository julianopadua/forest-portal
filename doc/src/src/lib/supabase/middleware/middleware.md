# src/lib/supabase/middleware.ts

## 1. Visão geral e responsabilidade
O módulo fornece a função **`updateSession`**, responsável por sincronizar o estado de sessão do Supabase entre o cliente e o servidor em rotas **Next.js** que utilizam o middleware de servidor.  
Ele cria um cliente Supabase configurado para ler e escrever cookies a partir do objeto `NextRequest`/`NextResponse`, garante a validade do token chamando `auth.getUser()` e devolve a resposta HTTP já com os cookies atualizados.

## 2. Onde este arquivo se encaixa na arquitetura
- **Camada:** *Infraestrutura / Integração externa*  
- **Domínio:** Integração com o serviço de autenticação Supabase.  
- **Tipo de artefato:** Middleware utilitário que pode ser usado em rotas API ou em `middleware.ts` do Next.js para manter a sessão consistente.

## 3. Interfaces e exports (o que ele expõe)
```ts
export async function updateSession(request: NextRequest): Promise<NextResponse>
```
- **Parâmetro:** `request` – objeto `NextRequest` da rota que invoca o middleware.  
- **Retorno:** Instância de `NextResponse` contendo os cabeçalhos e cookies atualizados.

Nenhum outro export é definido.

## 4. Dependências e acoplamentos
| Tipo | Pacote | Motivo |
|------|--------|--------|
| **Externa** | `@supabase/ssr` (`createServerClient`) | Cria o cliente Supabase configurado para SSR. |
| **Externa** | `next/server` (`NextResponse`, `NextRequest`) | Tipos e utilitários de resposta/solicitação do Next.js. |
| **Interna** | *Nenhuma* | O módulo não importa código interno do repositório. |

Acoplamento direto com a API de cookies de `NextRequest`/`NextResponse` e com a interface de cliente Supabase SSR.

## 5. Leitura guiada do código (top‑down)

1. **Criação da resposta base**  
   ```ts
   let response = NextResponse.next({
     request: { headers: request.headers },
   });
   ```
   - Inicializa `response` com os mesmos cabeçalhos da requisição, permitindo que a função retorne algo mesmo que nenhum cookie seja modificado.

2. **Instanciação do cliente Supabase**  
   ```ts
   const supabase = createServerClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
     { cookies: { … } }
   );
   ```
   - Utiliza variáveis de ambiente (exigidas em tempo de execução).  
   - O objeto `cookies` implementa duas funções:
     - `getAll()` delega ao `request.cookies.getAll()`.
     - `setAll(cookiesToSet)` grava cada cookie tanto no `request` (para que o cliente Supabase os veja imediatamente) quanto no `response` (para que o navegador receba as alterações).  
   - Dentro de `setAll`, a variável `response` é re‑instanciada para garantir que os novos cookies sejam incluídos na resposta final.

3. **Validação/renovação do token**  
   ```ts
   await supabase.auth.getUser();
   ```
   - Força o Supabase a validar o token presente nos cookies. Caso o token esteja expirado, o cliente Supabase atualizará os cookies automaticamente via `setAll`.

4. **Retorno**  
   ```ts
   return response;
   ```
   - A resposta contém os cabeçalhos originais e, possivelmente, novos cookies de sessão.

### Decisões de implementação relevantes
- **Recriação de `response` dentro de `setAll`**: garante que a resposta final reflita todas as alterações de cookie, evitando que cookies adicionados após a primeira criação sejam perdidos.  
- **Uso de `request.cookies.set`**: permite que o cliente Supabase leia os cookies recém‑definidos na mesma execução, mantendo consistência entre leitura e escrita.  
- **Exigência de variáveis de ambiente** (`!`): o código assume que as variáveis estão definidas; falhas de configuração resultarão em erro de tempo de execução.

## 6. Fluxo de dados/estado/eventos
1. **Entrada:** `NextRequest` contendo cabeçalhos e cookies da requisição HTTP.  
2. **Processamento:**  
   - Cookies são lidos via `request.cookies.getAll()`.  
   - `supabase.auth.getUser()` pode gerar novos tokens e, consequentemente, novos cookies.  
   - `setAll` grava esses cookies tanto no objeto de requisição (estado interno) quanto na resposta.  
3. **Saída:** `NextResponse` com cabeçalhos originais e o conjunto final de cookies (possivelmente atualizado).

Não há eventos externos; o fluxo é síncrono/assíncrono dentro da chamada da função.

## 7. Conexões com outros arquivos do projeto
- **Importações externas:** `@supabase/ssr`, `next/server`.  
- **Importações internas:** nenhuma.  
- **Exportações consumidas por outros módulos:** não há referência conhecida no repositório (arquivo não listado como importado). Caso seja usado, a chamada típica seria:
  ```ts
  import { updateSession } from '@/lib/supabase/middleware';
  ```

*(Links para documentação interna não disponíveis, pois não há imports internos.)*

## 8. Pontos de atenção, riscos e melhorias recomendadas
| Item | Descrição | Recomendações |
|------|-----------|---------------|
| **Variáveis de ambiente obrigatórias** | Uso de `!` (non‑null assertion) pode gerar exceção se as variáveis não estiverem definidas. | Validar explicitamente e lançar erro com mensagem clara durante a inicialização. |
| **Recriação de `response`** | Cada chamada a `setAll` cria um novo `NextResponse`, o que pode ser custoso se houver múltiplas iterações. | Avaliar se a criação única antes do loop, seguida apenas de mutações nos cookies, seria suficiente. |
| **Sincronização de cookies entre request e response** | `request.cookies.set` altera apenas o objeto em memória; não afeta o cliente HTTP real. | Documentar que a mutação de `request` serve apenas ao Supabase; a fonte de verdade para o cliente é o `response`. |
| **Teste de cobertura** | Função depende de objetos do Next.js que são difíceis de mockar. | Implementar testes unitários com `@vercel/edge-mock` ou similar, garantindo que `setAll` realmente propaga cookies. |
| **Escalabilidade** | A função é assíncrona e pode ser chamada em alta frequência (ex.: em cada requisição). | Monitorar latência da chamada `supabase.auth.getUser()`; considerar cache de sessão quando apropriado. |

---  
*Documentação gerada por Redator Técnico Sênior – 06/01/2026.*
