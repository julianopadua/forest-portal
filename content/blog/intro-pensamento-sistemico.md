---
title: "Pensamento sistêmico: uma porta de entrada"
subtitle: "Por que 'muitas partes' não basta, como estoques e fluxos aparecem até no futebol de elite, e o que isso tem a ver com dados abertos no Forest."
excerpt: "Introdução leve ao olhar sistêmico inspirado em Donella Meadows: elementos, ligações, propósito, estoques e fluxos, com um exemplo de pesquisa em futebol e uma ponte para o portal."
publishedAt: "2026-05-11"
author: "Juliano Pádua · Forest Portal"
tags:
  - pensamento sistêmico
  - sistemas
  - dados abertos
  - Meadows
mainImage: "/images/blog/intro-pensamento-sistemico/front-image.png"
mainImageCaption: "Análise tática com dados e vídeo (Metrica Sports). Fonte: Robert Kidd, Forbes, 15 nov. 2020."
---

Quando alguém diz **sistema**, costuma pensar em “muitas peças”. Em *Pensando em sistemas*, Donella Meadows elucida que um sistema é um conjunto de partes **interligadas** que, ao longo do tempo, produz um **padrão de comportamento**. A distinção importa porque muda onde olhamos quando algo dá errado: nem sempre o culpado é um agente isolado; muitas vezes é a **estrutura** (regras, atrasos, incentivos) que gera o resultado.

Este texto organiza um vocabulário introdutório ao pensamento sistêmico: **elementos**, **ligações**, **propósito**, além de **estoques** e **fluxos**.

## Três perguntas simples

Antes de desenhar um diagrama, três perguntas evitam confundir lista de peças com sistema:

<div class="not-prose my-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 md:p-8">
  <div class="grid gap-4 md:grid-cols-3 md:gap-6">
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center">
      <p class="text-xs font-bold uppercase tracking-wider text-[color:var(--primary)]">Elementos</p>
      <p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">Peças visíveis ou mensuráveis: pessoas, máquinas, contas, sensores, ficheiros.</p>
    </div>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Interligações</p>
      <p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">Fluxos, regras, protocolos, contratos: o que liga um elemento ao outro.</p>
    </div>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Propósito</p>
      <p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">O que o sistema tende a manter ou produzir, mesmo quando ninguém declara isso em voz alta.</p>
    </div>
  </div>
</div>

Um monte de areia na estrada não é “sistema” no sentido forte: quase não há ligações nem função compartilhada. Já uma equipa em campo, um reservatório com torneiras ou um **catálogo de dados** com manifests e URLs públicas começam a parecer-se com sistemas porque as **interações importam tanto quanto as listas**.

## Estoque, fluxo e um banho de intuição

Outro atalho útil é pensar em **estoque** (algo que se acumula) e **fluxos** (entradas e saídas). A metáfora da banheira é clássica: o nível de água é o estoque; a torneira e o ralo são fluxos. Atrasos entre ação e efeito são o que tornam políticas intuitivas perigosas: desligar a torneira já não corrige o nível se o estoque encheu.

<div class="not-prose my-10 flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-6 py-8 md:flex-row md:justify-center md:gap-10">
  <div class="flex flex-col items-center gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Entrada</span>
    <svg class="h-16 w-24 text-[color:var(--primary)]" viewBox="0 0 96 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 8 L88 40 L8 40 Z" fill="currentColor" opacity="0.35" />
      <line x1="48" y1="40" x2="48" y2="56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
    <span class="text-xs text-[color:var(--muted)]">fluxo in</span>
  </div>
  <div class="relative flex h-36 w-40 items-end justify-center rounded-xl border-4 border-[color:var(--primary)]/50 bg-[color:var(--surface)] px-2 pb-2">
    <div class="absolute bottom-2 left-2 right-2 h-[55%] rounded-md bg-[color:var(--primary)]/25"></div>
    <span class="relative z-10 mb-3 text-xs font-medium text-[color:var(--foreground)]">estoque</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Saída</span>
    <svg class="h-16 w-24 text-[color:var(--primary)]" viewBox="0 0 96 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="12" y="12" width="72" height="40" rx="6" fill="currentColor" opacity="0.2" />
      <line x1="48" y1="8" x2="48" y2="52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
    <span class="text-xs text-[color:var(--muted)]">fluxo out</span>
  </div>
</div>

O diagrama é deliberadamente minimalista: o ponto é lembrar que **comportamento** emerge de **estrutura**. O mesmo impulso externo (por exemplo, “contratar mais analistas”) produz efeitos diferentes conforme os fluxos e atrasos já desenhados no sistema.

## Futebol de elite como laboratório de interdependência

Fernandes et al. (2020), no *Journal of Human Kinetics*, estudaram **padrões de recuperação de bola** em equipas de elite (Mundial de 2014), cruzando modelagem tática com variáveis de contexto (resultado, qualidade do adversário, parte do jogo). O trabalho trata o jogo como **sistema complexo** em que interações no espaço-tempo geram variabilidade.

A **Tabela 1** do sistema observacional **Soccer-Defence (SOC-DEF)** resume critérios, categorias e códigos para descrever a fase defensiva de forma estruturada: um exemplo de como se transforma “um jogo confuso” em **elementos nomeáveis** e **ligações observáveis**, sem negar a complexidade.

![Tabela 1. Soccer-Defence (SOC-DEF). Fernandes et al. (2020), licença CC BY 4.0.](/images/blog/intro-pensamento-sistemico/fernandes-2020-figure.png)

Referência: Fernandes, T., Camerino, O., Garganta, J., Hileno, R., & Barreira, D. (2020). How do elite soccer teams perform to ball recovery? Effects of tactical modelling and contextual variables on the defensive patterns of play. *Journal of Human Kinetics*, 73, 165-179. [https://doi.org/10.2478/hukin-2019-0141](https://doi.org/10.2478/hukin-2019-0141).

## Forest Portal e dados públicos

O Instituto Forest trata dados ambientais e commodity com seriedade de engenharia. No portal, isso traduz-se numa cadeia em que **manifests**, **catálogos** e **URLs públicas** funcionam como contrato entre quem publica dados e quem consome. Há **elementos** (ficheiros, JSON, páginas), **interligações** (pipelines, Storage, pedidos HTTP) e **propósito** (dados utilizáveis, rastreáveis, reprodutíveis).

<div class="not-prose my-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 md:p-8">
  <p class="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Esquema de alto nível (contrato público)</p>
  <div class="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center md:gap-6">
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Fontes públicas</div>
    <svg class="mx-auto h-8 w-12 shrink-0 text-[color:var(--primary)] md:mx-0 md:h-6 md:w-10 md:rotate-0" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 16 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 10 L44 16 L36 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Pipelines (ingestão)</div>
    <svg class="mx-auto h-8 w-12 shrink-0 text-[color:var(--primary)] md:mx-0" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 16 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 10 L44 16 L36 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div class="rounded-xl border border-[color:var(--primary)]/40 bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Supabase Storage<br /><span class="text-xs font-normal text-[color:var(--muted)]">manifests + ficheiros</span></div>
    <svg class="mx-auto h-8 w-12 shrink-0 text-[color:var(--primary)] md:mx-0" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 16 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 10 L44 16 L36 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Forest Portal<br /><span class="text-xs font-normal text-[color:var(--muted)]">leitura pública</span></div>
  </div>
</div>
