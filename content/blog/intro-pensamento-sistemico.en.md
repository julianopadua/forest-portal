---
title: "Systems thinking: a short on-ramp"
subtitle: "Why 'many parts' is not enough, how stocks and flows show up even in elite football research, and how that connects to open data at Forest."
excerpt: "A lightweight introduction to a Meadows-style lens: elements, interconnections, purpose, stocks and flows, with a football example and a bridge to the portal."
publishedAt: "2026-05-11"
author: "Juliano Pádua · Forest Portal"
tags:
  - systems thinking
  - open data
  - Meadows
  - introduction
mainImage: "/images/blog/intro-pensamento-sistemico/front-image.png"
mainImageCaption: "Tactical analysis with data and video (Metrica Sports). Robert Kidd, Forbes, Nov 15, 2020. Source: https://www.forbes.com/sites/robertkidd/2020/11/15/why-this-company-wants-to-change-data-and-video-analysis-in-soccer/"
---

When people say **system**, they often mean “many parts.” Donella Meadows, in *Thinking in Systems*, nudges us further: a system is a set of **interconnected** parts that, over time, produces a **pattern of behavior**. That distinction matters because it changes where we look when things go wrong: the culprit is not always a single actor; often the **structure** (rules, delays, incentives) generates the outcome.

This note collects a **small vocabulary**: **elements**, **links**, **purpose**, plus **stocks** and **flows** where the dynamics move.

## Three simple questions

Before drawing a diagram, three questions keep “a long list of pieces” from being mistaken for a system:

<div class="not-prose my-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 md:p-8">
  <div class="grid gap-4 md:grid-cols-3 md:gap-6">
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Elements</p>
      <p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">Visible or measurable pieces: people, machines, accounts, sensors, files.</p>
    </div>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Interconnections</p>
      <p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">Flows, rules, protocols, contracts: what links one element to another.</p>
    </div>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Purpose</p>
      <p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">What the system tends to maintain or produce, even when nobody states it aloud.</p>
    </div>
  </div>
</div>

Sand scattered on a road is not a “system” in the strong sense: almost no shared function or coupling. A team on the pitch, a reservoir with taps, or a **data catalog** with manifests and public URLs starts to look like a system because **interactions matter as much as lists**.

## Stock, flow, and a bathtub intuition

Another shortcut is **stock** (something that accumulates) and **flows** (in and out). The bathtub metaphor is classic: water level is the stock; tap and drain are flows. Delays between action and effect are why intuitive policies backfire: closing the tap does not fix the level once the stock is full.

<div class="not-prose my-10 flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-6 py-8 md:flex-row md:justify-center md:gap-10">
  <div class="flex flex-col items-center gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Inflow</span>
    <svg class="h-16 w-24 text-[color:var(--primary)]" viewBox="0 0 96 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 8 L88 40 L8 40 Z" fill="currentColor" opacity="0.35" />
      <line x1="48" y1="40" x2="48" y2="56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
    <span class="text-xs text-[color:var(--muted)]">flow in</span>
  </div>
  <div class="relative flex h-36 w-40 items-end justify-center rounded-xl border-4 border-[color:var(--primary)]/50 bg-[color:var(--surface)] px-2 pb-2">
    <div class="absolute bottom-2 left-2 right-2 h-[55%] rounded-md bg-[color:var(--primary)]/25"></div>
    <span class="relative z-10 mb-3 text-xs font-medium text-[color:var(--foreground)]">stock</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Outflow</span>
    <svg class="h-16 w-24 text-[color:var(--primary)]" viewBox="0 0 96 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="12" y="12" width="72" height="40" rx="6" fill="currentColor" opacity="0.2" />
      <line x1="48" y1="8" x2="48" y2="52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
    <span class="text-xs text-[color:var(--muted)]">flow out</span>
  </div>
</div>

The sketch is deliberately minimal: **behavior** emerges from **structure**. The same external push (for example, “hire more analysts”) lands differently depending on flows and delays already wired into the system.

## Elite football as a lab for interdependence

Fernandes et al. (2020), in the *Journal of Human Kinetics*, studied **ball-recovery patterns** in elite teams (2014 World Cup), crossing tactical modelling with context (scoreline, opponent quality, half). The paper treats the match as a **complex system** where space-time interactions generate variability.

**Table 1** of the **Soccer-Defence (SOC-DEF)** observational system lists criteria, categories, and codes for describing defence in a structured way: an example of turning a “messy game” into **named elements** and **observable links**, without pretending complexity disappears.

![Table 1. Soccer-Defence (SOC-DEF). Fernandes et al. (2020), CC BY 4.0.](/images/blog/intro-pensamento-sistemico/fernandes-2020-figure.png)

Reference: Fernandes, T., Camerino, O., Garganta, J., Hileno, R., & Barreira, D. (2020). How do elite soccer teams perform to ball recovery? Effects of tactical modelling and contextual variables on the defensive patterns of play. *Journal of Human Kinetics*, 73, 165-179. [https://doi.org/10.2478/hukin-2019-0141](https://doi.org/10.2478/hukin-2019-0141).

## Forest Portal and public data

Instituto Forest treats environmental and commodity data with engineering seriousness. On the portal, that shows up as a chain where **manifests**, **catalogs**, and **public URLs** form the contract between publishers and readers. There are **elements** (files, JSON, pages), **interconnections** (pipelines, Storage, HTTP requests), and **purpose** (data that is usable, traceable, reproducible).

<div class="not-prose my-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 md:p-8">
  <p class="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">High-level public contract</p>
  <div class="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center md:gap-6">
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Public sources</div>
    <svg class="mx-auto h-8 w-12 shrink-0 text-[color:var(--primary)] md:mx-0 md:h-6 md:w-10 md:rotate-0" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 16 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 10 L44 16 L36 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Pipelines (ingest)</div>
    <svg class="mx-auto h-8 w-12 shrink-0 text-[color:var(--primary)] md:mx-0" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 16 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 10 L44 16 L36 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div class="rounded-xl border border-[color:var(--primary)]/40 bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Supabase Storage<br /><span class="text-xs font-normal text-[color:var(--muted)]">manifests + files</span></div>
    <svg class="mx-auto h-8 w-12 shrink-0 text-[color:var(--primary)] md:mx-0" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 16 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 10 L44 16 L36 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-center text-sm font-medium text-[color:var(--foreground)]">Forest Portal<br /><span class="text-xs font-normal text-[color:var(--muted)]">public read model</span></div>
  </div>
</div>
