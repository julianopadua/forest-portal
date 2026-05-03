# Instituto Forest Portal

Repositório oficial do portal web do Instituto Forest. O sistema consolida presença institucional, acesso a dados abertos, publicação de relatórios analíticos e fluxos de autenticação com perfil de usuário, sobre uma base técnica em Next.js (App Router), TypeScript e Supabase.

## Sumário

- [Objetivos](#objetivos)
- [Visão do sistema](#visão-do-sistema)
- [Pilha tecnológica](#pilha-tecnológica)
- [Arquitetura e fluxos principais](#arquitetura-e-fluxos-principais)
- [Rotas e módulos](#rotas-e-módulos)
- [Internacionalização](#internacionalização)
- [Landing page e página institucional](#landing-page-e-página-institucional)
- [Temas e tokens de interface](#temas-e-tokens-de-interface)
- [Dados abertos e pipeline externo](#dados-abertos-e-pipeline-externo)
- [Relatórios analíticos](#relatórios-analíticos)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Documentação de código](#documentação-de-código)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Execução local](#execução-local)
- [Build e produção](#build-e-produção)
- [Implantação](#implantação)
- [Evolução planejada](#evolução-planejada)
- [Contribuição e licença](#contribuição-e-licença)

## Objetivos

O portal visa oferecer experiência unificada para:

- Educação e conteúdo aplicado (incluindo rotas dedicadas a educação e exploração).
- Comunidade e engajamento (com âncoras na landing e rotas de entrada).
- Distribuição de dados abertos (catálogo, metadados e downloads alinhados ao Storage).
- Área autenticada (perfil, sessão e ações de servidor para atualização de dados do usuário).

## Visão do sistema

A aplicação é um monólito frontend desacoplado de jobs de extração e transformação de dados. O Next.js entrega páginas e rotas de API leves; o Supabase fornece autenticação, banco relacional e armazenamento de objetos para arquivos públicos. O middleware renova cookies de sessão em cada requisição compatível com o matcher, mantendo coerência entre cliente e servidor. Componentes de interface seguem tokens CSS centralizados e padrão responsivo com navegação principal fixa e menu lateral em viewports reduzidos.

## Pilha tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 (`@import "tailwindcss"` em `globals.css`) |
| Autenticação e backend gerenciado | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Compilação React | React Compiler habilitado em `next.config.ts` |
| Runtime local | Node.js (LTS recomendado), npm |

Configuração de build: consulte [doc/src/next.config/next.config.md](doc/src/next.config/next.config.md).

## Arquitetura e fluxos principais

1. **Solicitação HTTP**: `src/middleware.ts` delega a [atualização de sessão Supabase](doc/src/src/lib/supabase/middleware/middleware.md) antes de servir rotas aplicáveis.
2. **Renderização**: o [layout raiz](doc/src/src/app/layout/layout.md) aplica fonte, provedor de i18n, cabeçalho e rodapé; o conteúdo roteado ocupa a área principal.
3. **Autenticação**: rotas de API [login](doc/src/src/app/api/auth/login/route/route.md) e [cadastro](doc/src/src/app/api/auth/signup/route/route.md) utilizam o cliente adequado; o [callback OAuth](doc/src/src/app/auth/callback/route/route.md) troca o código por sessão e redireciona com validação de `next` interno.
4. **Dados do usuário**: [ações de servidor para perfil](doc/src/src/app/actions/profile/profile.md) atualizam tabelas como `profiles` com revalidação de cache.
5. **Dados abertos**: catálogo e URLs públicas derivam de variáveis e convenções de bucket; ver biblioteca em [catalog](doc/src/src/lib/openData/catalog/catalog.md) e [publicUrls](doc/src/src/lib/openData/publicUrls/publicUrls.md).

Documentação do middleware de borda: [doc/src/src/middleware/middleware.md](doc/src/src/middleware/middleware.md).

## Rotas e módulos

Cada rota principal possui nota técnica em `doc/` quando indexada em [doc/INDEX.md](doc/INDEX.md).

| Rota | Descrição | Documentação |
|------|-----------|--------------|
| `/` | Landing institucional baseada em MDX (`content/home/{en-US,pt-BR}.mdx`) com hero do Cerrado e logo animado | [page.md (marketing)](doc/src/src/app/(marketing)/page/page.md) |
| `/explore` | Exploração de conteúdo | [explore/page.md](doc/src/src/app/explore/page/page.md) |
| `/join` | Entrada para cadastro e autenticação | [join/page.md](doc/src/src/app/join/page/page.md) |
| `/education` | Educação | [education/page.md](doc/src/src/app/education/page/page.md) |
| `/commodities` | Commodities | [commodities/page.md](doc/src/src/app/commodities/page/page.md) |
| `/open-data` | Catálogo de dados abertos | [open-data/page.md](doc/src/src/app/open-data/page/page.md) |
| `/open-data/[source]/[dataset]` | Detalhe de conjunto de dados | [dataset page.md](doc/src/src/app/open-data/[source]/[dataset]/page/page.md) |
| `/reports` | Listagem de relatórios | [reports/page.md](doc/src/src/app/reports/page/page.md) |
| `/reports/[report]` | Relatório dinâmico (manifest JSON, seções) | Implementação em `src/app/reports/[report]/page.tsx` (documentação granular pendente no índice) |
| `/settings` | Configurações e perfil | [settings/page.md](doc/src/src/app/settings/page/page.md) |

A navegação da landing utiliza âncoras (por exemplo `#missao`, `#programas`). O [Header](doc/src/src/components/layout/Header/Header.md) concentra tema, idioma, autenticação e links responsivos; o [SidebarSheet](doc/src/src/components/layout/SidebarSheet/SidebarSheet.md) atende ao menu em telas estreitas.

## Internacionalização

Textos são organizados via [I18nProvider](doc/src/src/i18n/I18nProvider/I18nProvider.md) e [dicionários](doc/src/src/i18n/dictionaries/dictionaries.md). O componente [LanguageSwitcher](doc/src/src/components/ui/LanguageSwitcher/LanguageSwitcher.md) altera o idioma da interface conforme a estratégia definida no provedor.

## Landing page e página institucional

A rota raiz (`/`) e a rota `/quem-somos` compartilham o mesmo padrão visual e de autoria de conteúdo: ambas carregam um arquivo MDX por idioma e renderizam-no usando os componentes em `src/components/about/`. Isso permite que o conteúdo seja revisado como texto, sem reabrir páginas React.

**Arquivos de conteúdo**:

```txt
content/home/en-US.mdx          Landing em inglês
content/home/pt-BR.mdx          Landing em português
content/about/en-US.mdx         "Quem somos" em inglês
content/about/pt-BR.mdx         "Quem somos" em português
```

A escolha do idioma é feita pelo `useI18n()` em `src/app/(marketing)/page.tsx` e `src/app/quem-somos/page.tsx`.

**Componentes reutilizáveis** (em `src/components/about/`):

| Componente | Uso |
|------------|-----|
| `AboutHero` | Hero de tela cheia com imagem de fundo, gradiente para o `--background`, título e subtítulo. A landing usa `public/images/landingpage/cerrado.png`. |
| `AboutSection` | Bloco de texto com título opcional, com variantes `contentWidth="default"` e `wide`; suporta uma ou duas imagens laterais. |
| `AboutDivider` | Divisor horizontal sutil em gradiente. |
| `AboutQuote` | Citação destacada. |
| `AboutPersonInline` | Foto + biografia para a seção de inspirações. |
| `AboutSpinningLogo` | Logo girando com tipografia "INSTITUTO" + palavra cíclica em efeito máquina de escrever (ver abaixo). |

### Logo animado da landing (`AboutSpinningLogo`)

O componente combina três animações:

1. **Rotação contínua** do logo (`forest-marketing-logo-spin`, 14s linear).
2. **Ciclo de cores** via `filter` (`forest-marketing-logo-hue`, 24s, `ease-in-out`): azul (padrão) → vermelho → verde → cinza-claro/branco → preto → azul.
3. **Tipografia cíclica** (typewriter): a palavra "INSTITUTO" permanece estática e a palavra abaixo dela é digitada, mantida, apagada e substituída pela próxima da lista.

**Lista de palavras cíclicas** — definida em [src/components/about/aboutSpinningLogoConfig.ts](src/components/about/aboutSpinningLogoConfig.ts). Para adicionar, remover ou reordenar palavras, edite apenas esse arquivo:

```ts
export const SPINNING_LOGO_CYCLING_WORDS: string[] = [
  "FOREST",
  "FINANCE",
  "FIRE",
  "FUTURE",
  "FIELD",
  "FAUNA",
  "FLORA",
  "FORECAST",
  "OPEN SOURCE",
  "OPEN DATA",
  "CLIMATE",
];

export const SPINNING_LOGO_STATIC_WORD = "INSTITUTO";
```

Recomendações:

- Mantenha entradas curtas (≈ 3 a 12 caracteres) — a maior palavra reserva a largura da linha para evitar saltos durante o ciclo.
- A ordem é preservada em runtime; o ciclo é simples (incremento módulo `length`).
- Sobrescritas ad hoc são possíveis via props (`<AboutSpinningLogo cyclingWords={[...]} staticWord="..." />`), úteis para variações por página.

**Reduced motion**: tanto a rotação quanto o cursor piscante respeitam `prefers-reduced-motion: reduce` (`src/app/globals.css`).

## Temas e tokens de interface

Tokens e paletas light e dark estão em [globals.md](doc/src/src/app/globals/globals.md). O modo pode seguir `prefers-color-scheme` ou classes `theme-light` / `theme-dark` no elemento `html`, com persistência em `localStorage` sob a chave `fp_theme`. Superfícies e sombras seguem variáveis como `--surface`, `--border` e `--shadow-float`.

Componentes base: [Button](doc/src/src/components/ui/Button/Button.md), [Modal](doc/src/src/components/ui/Modal/Modal.md). Layout: [Footer](doc/src/src/components/layout/Footer/Footer.md).

## Dados abertos e pipeline externo

O portal lista metadados e expõe downloads; a ingestão pesada (ETL), agregações e geração de arquivos permanece fora deste repositório, em linha com separação de responsabilidades e custos de execução. Tipos e contratos: [types.md](doc/src/src/lib/openData/types/types.md). Esquema SQL de apoio ao projeto (quando aplicável): [doc/supabase/docSQL.md](doc/supabase/docSQL.md).

Componentes de catálogo e página: [OpenDataCatalog](doc/src/src/components/open-data/OpenDataCatalog/OpenDataCatalog.md), [OpenDataPageClient](doc/src/src/components/open-data/OpenDataPageClient/OpenDataPageClient.md), [DownloadAllButton](doc/src/src/components/open-data/DownloadAllButton/DownloadAllButton.md).

## Relatórios analíticos

Relatórios são descritos por catálogo em `src/lib/reports/catalog.ts` (entradas com `slug`, caminhos de manifest e de dados estáveis no Storage). A listagem documentada encontra-se em [reports/page.md](doc/src/src/app/reports/page/page.md). Visualizações e seções residem em `src/components/reports/` e na rota dinâmica `src/app/reports/[report]/page.tsx`.

## Estrutura do repositório

Visão resumida (pastas principais):

```txt
doc/                    Documentação por arquivo-fonte e índice
public/                 Ativos estáticos e imagens
src/
  app/                  Rotas App Router, API routes, Server Actions
  components/           UI, layout, auth, open-data, reports, settings
  hooks/                Hooks (ex.: sessão Supabase no cliente)
  i18n/                 Provedor e dicionários
  lib/                  Utilitários, Supabase, openData, reports, tipos gerados
middleware.ts         Sessão Supabase na borda
```

Tipos gerados do banco: [database.types.md](doc/src/src/lib/database.types/database.types.md). Utilitário de classes: [cn.md](doc/src/src/lib/cn/cn.md).

Clientes Supabase: [client](doc/src/src/lib/supabase/client/client.md), [server](doc/src/src/lib/supabase/server/server.md), [admin](doc/src/src/lib/supabase/admin/admin.md).

## Documentação de código

O índice canônico que mapeia cada arquivo implementado para o respectivo `.md` está em **[doc/INDEX.md](doc/INDEX.md)**. Recomenda-se consultá-lo antes de alterações amplas para localizar a nota técnica correspondente.

Referência rápida por domínio:

- **Autenticação (UI)**: [AuthModal](doc/src/src/components/auth/AuthModal/AuthModal.md), [AuthForm](doc/src/src/components/auth/AuthForm/AuthForm.md)
- **Sessão no cliente**: [useSupabaseUser](doc/src/src/hooks/useSupabaseUser/useSupabaseUser.md)
- **Perfil (settings)**: [ProfileForm](doc/src/src/components/settings/ProfileForm/ProfileForm.md)

Arquivos sem entrada dedicada no índice (por exemplo módulos somente em `src/lib/reports/` ou `src/components/reports/`) devem ser interpretados a partir do código-fonte até eventual inclusão no gerador de documentação.

## Variáveis de ambiente

Crie `.env.local` na raiz do repositório. Os nomes abaixo refletem o uso atual no código.

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase (obrigatória para auth e URLs de dados abertos) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publicável do Supabase (anon ou publishable, conforme painel) |
| `SUPABASE_SERVICE_ROLE_KEY` | Operações privilegiadas no servidor (por exemplo cliente admin); não exponha ao cliente |
| `NEXT_PUBLIC_OPEN_DATA_BUCKET` | Nome do bucket de dados abertos (padrão `open-data` se omitido) |
| `NEXT_PUBLIC_PORTFOLIO_URL` | URL opcional para CTA de portfólio na landing |

Variáveis listadas em documentos antigos mas não referenciadas no código-fonte atual não devem ser assumidas como obrigatórias até serem introduzidas explicitamente na aplicação.

## Execução local

**Pré-requisitos**: Node.js em versão LTS atual ou compatível com Next.js 16; npm incluso ou instalado separadamente.

**Instalação de dependências**:

```bash
npm install
```

**Configuração**: copie ou crie `.env.local` e preencha pelo menos `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` para exercitar autenticação e fluxos que dependem do Supabase. Para downloads de dados abertos conforme implementação, a URL pública e o bucket devem estar coerentes com o ambiente.

**Servidor de desenvolvimento**:

```bash
npm run dev
```

A aplicação atende em `http://localhost:3000` por padrão do Next.js.

**Análise estática**:

```bash
npm run lint
```

## Build e produção

```bash
npm run build
npm run start
```

O comando `build` gera a saída otimizada; `start` serve a build em modo produção local. Valide variáveis de ambiente no mesmo formato esperado em produção antes de implantar.

## Implantação

Arquitetura típica: hospedagem do frontend Next.js em provedor compatível (por exemplo Vercel) e projeto Supabase para Auth, Postgres e Storage. Configure as variáveis no painel do provedor de hospedagem de forma espelhada a `.env.local`, sem commitar segredos. Revise políticas de Row Level Security e buckets conforme [doc/supabase/docSQL.md](doc/supabase/docSQL.md) e a documentação oficial do Supabase.

## Evolução planejada

Direções plausíveis incluem: fórum e moderação; expansão do catálogo de relatórios e documentação automática de novos componentes; APIs públicas para metadados; painel administrativo; consolidação de `CONTRIBUTING.md` e arquivo `LICENSE` quando a política institucional estiver definida.

## Contribuição e licença

Padrões de branch, revisão e licença de código ainda podem ser formalizados em `CONTRIBUTING.md` e `LICENSE`. Até lá, alinhe mudanças à estrutura existente e à documentação em `doc/`.
