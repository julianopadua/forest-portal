// src/app/(marketing)/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 backdrop-blur-xl md:p-10"
          style={{ boxShadow: "var(--shadow-float)" }}
        >
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
            <p className="mt-2 text-[color:var(--muted)]">{subtitle}</p>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function MarketingHome() {
  const { dict } = useI18n();

  const cards = dict.marketing.hero.cards;
  const gridCols = cards.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"; // mantém Tailwind feliz (classes explícitas)

  return (
    <div>
      {/* HERO */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div
            className="rounded-3xl border border-[color:var(--border)] bg-gradient-to-b from-[color:var(--surface-2)] to-[color:var(--surface)] p-8 backdrop-blur-xl md:p-12"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              {dict.marketing.hero.title}
            </h1>

            <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
              {dict.marketing.hero.subtitle}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/join">
                <Button>{dict.marketing.hero.ctaJoin}</Button>
              </Link>

              <Link href="/explore">
                <Button variant="ghost">{dict.marketing.hero.ctaExplore}</Button>
              </Link>
            </div>

            <div className={`mt-10 grid gap-3 ${gridCols}`}>
              {cards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5"
                >
                  <div className="font-semibold">{c.title}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DADOS ABERTOS */}
      <Section
        id={dict.marketing.sections.mission.id}
        title={dict.marketing.sections.mission.title}
        subtitle={dict.marketing.sections.mission.subtitle}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {dict.marketing.sections.mission.bullets.map((text) => (
            <div
              key={text}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5 text-sm text-[color:var(--muted)]"
            >
              {text}
            </div>
          ))}
        </div>
      </Section>

      {/* MERCADOS */}
      <Section
        id={dict.marketing.sections.programs.id}
        title={dict.marketing.sections.programs.title}
        subtitle={dict.marketing.sections.programs.subtitle}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {dict.marketing.sections.programs.cards.map((x) => (
            <div
              key={x}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5"
            >
              <div className="font-semibold">{x}</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                {dict.marketing.sections.programs.cardDesc}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* RELATÓRIOS */}
      <Section
        id={dict.marketing.sections.contents.id}
        title={dict.marketing.sections.contents.title}
        subtitle={dict.marketing.sections.contents.subtitle}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {dict.marketing.sections.contents.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-xs text-[color:var(--foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
            <div className="font-semibold">{dict.marketing.sections.contents.ctaTitle}</div>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {dict.marketing.sections.contents.ctaDesc}
            </p>

            <div className="mt-4">
              <Button
                onClick={() => alert("Depois liga o fluxo de newsletter (email)")}
              >
                {dict.marketing.sections.contents.ctaButton}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* EDUCAÇÃO */}
      <Section
        id={dict.marketing.sections.community.id}
        title={dict.marketing.sections.community.title}
        subtitle={dict.marketing.sections.community.subtitle}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {dict.marketing.sections.community.cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5"
            >
              <div className="font-semibold">{c.title}</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">{c.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/join">
            <Button>{dict.marketing.sections.community.ctaJoin}</Button>
          </Link>

          <Link href="/explore">
            <Button variant="ghost">{dict.marketing.sections.community.ctaExplore}</Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
