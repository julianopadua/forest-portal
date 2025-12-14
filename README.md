# Instituto Forest Portal

Repositório do portal web do Instituto Forest.

O objetivo do portal é oferecer uma experiência unificada para:
- Educação gratuita (tecnologia, ENEM e temas aplicados)
- Comunidade (fórum e discussões)
- Distribuição gratuita de dados (ex: queimadas, mercados financeiros, commodities)
- Área logada (progresso, favoritos, recursos avançados e personalização)

## Table of Contents

- [Visão geral](#visão-geral)
- [Escopo](#escopo)
- [Status atual](#status-atual)
- [Stack](#stack)
- [Arquitetura e rotas](#arquitetura-e-rotas)
- [Estrutura do repositório](#estrutura-do-repositório)
- [UI e layout](#ui-e-layout)
- [Temas e estilo](#temas-e-estilo)
- [Dados e pipeline externo](#dados-e-pipeline-externo)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Deploy](#deploy)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão geral

O Instituto Forest é um projeto de longo prazo para organizar conhecimento, estimular aprendizado aplicado e viabilizar acesso aberto a dados e ferramentas.

Este repositório contém o portal do Instituto, implementado com Next.js (App Router), com foco em:
- Design consistente (paleta green-based, estética "floating")
- Base sólida de layout e componentes
- Crescimento modular por rotas e áreas (marketing, explore, join e futura área logada)

## Escopo

Dentro deste repositório:
- Páginas públicas e base do site
- Estrutura de layout (Header, Footer, Sidebar mobile)
- Componentes UI reutilizáveis (Button, Modal)
- Catálogo e navegação do conteúdo (planejado)
- Login e autenticação (planejado)
- Fórum (planejado)
- Portal de dados para download (planejado)

Fora do escopo (recomendado manter separado):
- Scripts e jobs de coleta, limpeza e atualização de dados (ETL)
- Processamento pesado, agregações e geração de datasets
- Treinamento de modelos e notebooks

## Status atual

Implementado (MVP):
- Landing page em `src/app/(marketing)/page.tsx` com seções e CTAs
- Rotas iniciais: `/explore` e `/join`
- Layout base: Header fixo, Footer, menu lateral (mobile)
- Tema light e dark com tokens CSS em `src/app/globals.css`

A implementar (curto prazo):
- Autenticação real (ex: Supabase Auth)
- Integração de rotas protegidas e sessão
- Páginas e modelos iniciais do fórum
- Catálogo e download de datasets

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4, via `@import "tailwindcss"`)
- Node.js e npm (padrão do `create-next-app`)

Planejado:
- Supabase (Auth, Postgres e Storage)
- Deploy na Vercel

## Arquitetura e rotas

O projeto está organizado para crescer como um portal único, com módulos por rota:

- `/` (marketing) em `src/app/(marketing)/page.tsx`
  - Página pública, scrolável, com seções (Missão, Programas, Conteúdos, Comunidade)
  - CTAs apontando para `/join` e `/explore`

- `/explore` em `src/app/explore/page.tsx`
  - Modo visitante (planejado)

- `/join` em `src/app/join/page.tsx`
  - Entrada para criação de conta (planejado)

Observação:
- A navegação da landing page usa âncoras (`#missao`, `#programas`, etc.)
- O Header tem comportamento responsivo: no mobile abre menu lateral e no desktop exibe navegação completa

## Estrutura do repositório

Visão baseada na estrutura atual:

```txt
public/
  images/
src/
  app/
    (marketing)/
      page.tsx
    explore/
      page.tsx
    join/
      page.tsx
    favicon.ico
    globals.css
    layout.tsx
  components/
    layout/
      Footer.tsx
      Header.tsx
      SidebarSheet.tsx
    ui/
      Button.tsx
      Modal.tsx
  lib/
    cn.ts
```

Arquivos importantes:

* `src/app/(marketing)/page.tsx`: landing page com seções e CTAs usando `Link`
* `src/app/globals.css`: tokens de tema, paletas light e dark e mapeamento para Tailwind
* `src/components/layout/Header.tsx`: header fixo, tema e responsividade (desktop vs mobile)
* `src/components/layout/SidebarSheet.tsx`: menu lateral usado no mobile
* `src/components/ui/Button.tsx`: botão base do projeto
* `src/components/ui/Modal.tsx`: modal base (login e outros)

## UI e layout

Layout base:

* Header fixo no topo
* Footer no final
* Menu lateral no mobile (SidebarSheet)
* Componentes com estética "floating" usando:

  * `--surface`, `--surface-2`, `--surface-3`
  * `--border`, `--ring`
  * `--shadow-float`

A landing page está organizada em seções reutilizáveis via componente `Section` dentro de `src/app/(marketing)/page.tsx`.

## Temas e estilo

O tema é baseado em tokens CSS e mapeamento via Tailwind v4 em `src/app/globals.css`.

Paletas:

* Light: branco, verdes e acentos (ex: azul)
* Dark: green-based, fundo escuro, texto claro

Mecanismo:

* Default segue `prefers-color-scheme`
* Pode ser forçado por classe no `<html>`:

  * `html.theme-light`
  * `html.theme-dark`
* O toggle de tema é controlado no client e persiste no `localStorage` (chave `fp_theme`)

## Dados e pipeline externo

Estratégia recomendada (planejada):

* Scripts Python rodam separadamente do portal (ETL fora do Next.js)
* Esses scripts publicam:

  * Metadados no Postgres (Supabase)
  * Arquivos no Storage (Supabase), preferencialmente CSV/Parquet/JSON
* O portal apenas lista, filtra e apresenta os datasets, oferecendo download via Storage

Motivo:

* Evita misturar o ciclo de deploy do frontend com jobs pesados
* Melhor controle de limites, custos e escalabilidade

TODO:

* Criar pasta e especificação para pipeline (fora deste repo ou em repo separado)
* Definir esquema de metadados (dataset, fonte, período, tags, checksum, updated_at, url)

## Como rodar localmente

Pré-requisitos:

* Node.js (LTS recomendado)
* npm

Instalação e dev:

```bash
npm install
npm run dev
```

Build e produção:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

Observação:

* Os scripts acima assumem o padrão do Next.js gerado pelo `create-next-app`.
* Se você alterar scripts no `package.json`, atualize esta seção.

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto.

Planejado para Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

TODO:

* Documentar variáveis obrigatórias por módulo (auth, storage, dados, fórum)
* Incluir instruções de setup do Supabase (Auth, Storage, RLS)

## Deploy

Planejado:

* Vercel para o portal (Next.js)
* Supabase para Auth, Postgres e Storage

TODO:

* Documentar variáveis de ambiente na Vercel
* Definir estratégia de preview deployments e branches

## Roadmap

Curto prazo:

* Consolidar UX mobile do menu lateral (navegação, CTAs e login)
* Conectar `/join` e `/explore` com fluxos reais
* Integrar autenticação (Supabase Auth)
* Definir modelo de dados do catálogo de datasets (metadados)

Médio prazo:

* Fórum (categorias, tópicos, respostas, moderação)
* Portal de dados (catálogo, filtros, download)
* Biblioteca de conteúdos e trilhas com progressão

Longo prazo:

* Pipeline externo para atualização contínua de datasets
* API pública para catálogo e acesso programático
* Painel administrativo para curadoria e moderação

## Contribuição

TODO:

* Adicionar `CONTRIBUTING.md` com padrões de branch, commits e revisão
* Definir checklist de PR (UI, acessibilidade, responsividade, testes)

## Licença

TODO:

* Definir a licença do projeto e adicionar o arquivo `LICENSE`

