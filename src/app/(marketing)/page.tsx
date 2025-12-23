// src/app/(marketing)/page.tsx

"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
            <p className="mt-2 text-zinc-300">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

function LinkCard({
  href,
  title,
  desc,
  badge,
}: {
  href: string;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold">{title}</div>
        {badge ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-sm text-zinc-300">{desc}</div>
    </Link>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="font-semibold text-zinc-100">{title}</div>
      <div className="mt-2 text-sm text-zinc-300">{children}</div>
    </div>
  );
}

export default function MarketingHome() {
  const { dict } = useI18n();

  const openData = dict.marketing.sections.mission;
  const reports = dict.marketing.sections.contents;
  const education = dict.marketing.sections.community;

  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL;

  const primaryCards = [
    {
      href: `/${openData.id}`,
      title: "Dados abertos",
      desc: "Clima, queimadas e decisão no mundo real.",
      badge: "Open data",
    },
    {
      href: `/${reports.id}`,
      title: "Relatórios",
      desc: "Relatórios reprodutíveis, com metodologia e rastreabilidade.",
      badge: "Reports",
    },
    {
      href: `/${education.id}`,
      title: "Educação",
      desc: "Letramento de dados, ciência aplicada e uso responsável.",
      badge: "Educação",
    },
    {
      href: "#sobre-o-instituto",
      title: "Sobre o Instituto",
      desc: "Missão pública, princípios e compromisso open source.",
      badge: "Instituto",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 md:p-12 backdrop-blur-xl">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              {dict.marketing.hero.title}
            </h1>

            <p className="mt-4 max-w-3xl text-zinc-300">
              {dict.marketing.hero.subtitle}
            </p>

            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {primaryCards.map((c) => (
                <LinkCard
                  key={c.href}
                  href={c.href}
                  title={c.title}
                  desc={c.desc}
                  badge={c.badge}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE O INSTITUTO */}
      <Section
        id="sobre-o-instituto"
        title="Instituto Forest"
        subtitle="Organização sem fins lucrativos, open source e orientada à utilidade pública."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <InfoCard title="Propósito institucional">
            <p>
              Fornecer dados abertos, estruturados e auditáveis a partir de fontes relevantes para economia,
              logística, agricultura, saúde e segurança social, com foco em aplicações práticas e decisões no mundo real.
            </p>
            <p className="mt-3">
              O Instituto prioriza transparência metodológica: o dado final deve ser acompanhado do processo que o
              produz, incluindo coleta, validação e transformação.
            </p>
          </InfoCard>

          <InfoCard title="Entrega e método">
            <ul className="list-disc pl-5 space-y-1">
              <li>Catálogo de dados abertos e séries históricas padronizadas.</li>
              <li>Códigos completos de scraping, processamento e geração de relatórios, disponibilizados gratuitamente.</li>
              <li>Reprodutibilidade por versionamento, documentação e trilhas de auditoria.</li>
              <li>Contribuição comunitária por práticas open source.</li>
            </ul>
          </InfoCard>

          <InfoCard title="Compromissos">
            <ul className="list-disc pl-5 space-y-1">
              <li>Uso responsável e orientação a impacto socioambiental.</li>
              <li>Documentação pública como requisito, não como etapa opcional.</li>
              <li>Escalabilidade por automação, modularidade e padrões de dados.</li>
            </ul>
          </InfoCard>

          <InfoCard title="Resultados esperados">
            <p>
              Reduzir assimetrias de informação e custo de acesso a dados, fortalecendo decisões técnicas em políticas públicas,
              cadeias produtivas, logística e proteção socioambiental.
            </p>
          </InfoCard>
        </div>
      </Section>

      {/* DEDICATÓRIA */}
      <Section
        id="dedicatoria"
        title="Dedicatória"
        subtitle="Este projeto reconhece um legado de serviço público, conservação e responsabilidade intergeracional."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <InfoCard title="Mariceia Barbosa Silva Pádua">
            <p>
              Engenheira florestal formada pela Universidade Federal de Lavras, com atuação técnica no serviço público ambiental.
              Seu trabalho se associa à gestão e proteção de unidades de conservação, com ênfase em manejo, monitoramento e
              respostas operacionais a riscos ambientais.
            </p>
            <p className="mt-3">
              Ao assumir responsabilidades de gestão em unidade de conservação estadual, sua trajetória materializa o componente
              menos visível e mais essencial da conservação: a execução contínua, a presença em campo e a disciplina institucional
              que transforma diretrizes em proteção efetiva.
            </p>
            <p className="mt-3">
              Esta dedicatória registra, com respeito, a dimensão pública desse compromisso e o exemplo de rigor técnico aplicado a
              um bem coletivo.
            </p>
          </InfoCard>

          <InfoCard title="Maria Tereza Jorge Pádua">
            <p>
              Engenheira agrônoma, ambientalista e conservacionista amplamente reconhecida pela contribuição decisiva na criação e
              consolidação de parques nacionais e áreas protegidas no Brasil, razão pela qual se tornou conhecida como a mãe dos parques nacionais.
            </p>
            <p className="mt-3">
              Sua atuação abrange a estruturação de políticas e instituições, a construção de redes de conservação e a articulação entre
              ciência, gestão pública e proteção territorial. Entre as homenagens internacionais, recebeu a Medalha John C. Phillips (IUCN),
              uma das mais altas distinções globais em conservação.
            </p>
            <p className="mt-3">
              Esta dedicatória afirma que o acesso aberto ao conhecimento, à evidência e ao método é parte do mesmo projeto civilizatório
              que sustenta a conservação: ampliar capacidades públicas, reduzir arbitrariedades e proteger a vida em escala.
            </p>
          </InfoCard>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300">
          <div className="font-semibold text-zinc-100">Nota de reconhecimento</div>
          <p className="mt-2">
            O Instituto Forest nasce com uma premissa simples e exigente: dados abertos só geram confiança quando o método é público.
            Essa premissa se inspira em trajetórias que combinaram técnica, coragem institucional e serviço ao bem comum.
          </p>
        </div>
      </Section>

      {/* CRIADOR */}
      <Section
        id="criador"
        title="Quem eu sou"
        subtitle="Autoria, responsabilidade e canal de contato."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <InfoCard title="Juliano Pádua">
            <p>
              Criador do Instituto Forest. Esta seção será refinada a partir do currículo, com foco em trajetória técnica, pesquisa aplicada,
              engenharia de dados e compromisso com transparência reprodutível.
            </p>
          </InfoCard>

          <InfoCard title="Contato e portfólio">
            <p>
              {portfolioUrl
                ? "Canal de contato e referências profissionais via portfólio."
                : "Defina NEXT_PUBLIC_PORTFOLIO_URL para habilitar o redirecionamento ao portfólio."}
            </p>

            {portfolioUrl ? (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Abrir portfólio
              </a>
            ) : null}
          </InfoCard>
        </div>
      </Section>
    </div>
  );
}
