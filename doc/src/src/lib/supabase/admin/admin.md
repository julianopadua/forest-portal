# 1. Visão geral e responsabilidade  

O módulo **`src/lib/supabase/admin.ts`** encapsula a criação de um cliente Supabase com credenciais de *service role*.  
Ele fornece uma única função, `createAdminClient`, que instancia e devolve um objeto `SupabaseClient` configurado para uso em operações administrativas (ex.: acesso a tabelas com privilégios elevados).  

# 2. Onde este arquivo se encaixa na arquitetura  

- **Camada:** *Infraestrutura / Integração externa*  
- **Domínio:** Acesso a dados persistidos no Supabase.  
- **Tipo:** Utilitário de configuração (não contém lógica de negócio nem UI).  

# 3. Interfaces e exports  

| Export | Tipo | Descrição |
|--------|------|-----------|
| `createAdminClient` | `() => SupabaseClient` | Função que cria e devolve um cliente Supabase configurado com a *service role key* e com sessão não persistente. |

# 4. Dependências e acoplamentos  

| Dependência | Tipo | Motivo |
|-------------|------|--------|
| `@supabase/supabase-js` | Biblioteca externa | Fornece `createClient` e a tipagem `SupabaseClient`. |
| Variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) | Configuração externa | Necessárias para conectar ao endpoint Supabase e autenticar como service role. |

Não há dependências internas ao projeto (nenhum import relativo).  

# 5. Leitura guiada do código (top‑down)  

```ts
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  // 1. Recupera a URL pública do Supabase a partir das variáveis de ambiente.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // 2. Recupera a chave de serviço (service role) – privilégio máximo.
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // 3. Instancia o cliente com opções que desabilitam persistência e renovação automática
  //    de token, evitando estado de sessão entre requisições (adequado para ambientes
  //    server‑side ou funções de backend).
  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

**Decisões de implementação**  
- Uso do operador non‑null assertion (`!`) indica que a aplicação considera essas variáveis obrigatórias; falhas de configuração resultarão em erro de tempo de execução.  
- As opções `persistSession: false` e `autoRefreshToken: false` garantem que o cliente seja *stateless*, adequado para chamadas pontuais em ambientes sem armazenamento de sessão (ex.: API routes, serverless).  

# 6. Fluxo de dados/estado/eventos  

- **Entrada:** Valores das variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).  
- **Processamento:** Criação de um objeto `SupabaseClient` com as credenciais fornecidas.  
- **Saída:** Instância pronta para ser utilizada por outros módulos que necessitem de acesso administrativo ao Supabase.  
Não há gerenciamento interno de estado nem emissão de eventos.  

# 7. Conexões com outros arquivos do projeto  

- **Importado por:** *Nenhum* (não há referências internas no repositório).  
- **Importa:** *Nenhum* módulo interno.  

> **Observação:** Caso futuros módulos precisem de acesso administrativo ao Supabase, deverão importar `createAdminClient` a partir deste caminho.  

# 8. Pontos de atenção, riscos e melhorias recomendadas  

| Item | Impacto | Recomendações |
|------|---------|---------------|
| **Variáveis de ambiente obrigatórias** | Falha em tempo de execução se ausentes. | Validar explicitamente e lançar erro com mensagem clara; considerar fallback ou carregamento tardio. |
| **Chave de service role exposta** | Risco de vazamento se a variável for incluída em builds client‑side. | Garantir que `SUPABASE_SERVICE_ROLE_KEY` nunca seja incluída em bundles front‑end; usar apenas em código server‑side. |
| **Ausência de tipagem explícita** | Reduz a autocompletação e a verificação estática. | Exportar o tipo `SupabaseClient` no signature: `export function createAdminClient(): SupabaseClient`. |
| **Reuso de cliente** | Cada chamada cria uma nova instância, podendo gerar overhead em alta frequência. | Avaliar cache de instância (singleton) quando o cliente for usado repetidamente dentro do mesmo processo. |
| **Configurações de autenticação fixas** | Pode ser insuficiente para casos que requerem renovação automática de token. | Tornar as opções configuráveis via parâmetros ou variáveis de ambiente, se necessário. |

Implementar as recomendações acima aumentará a robustez, a segurança e a manutenibilidade do módulo.
