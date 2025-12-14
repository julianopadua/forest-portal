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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
            <p className="mt-2 text-zinc-300">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function MarketingHome() {
  const { dict } = useI18n();

  return (
    <div>
      {/* HERO */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 md:p-12 backdrop-blur-xl">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              {dict.marketing.hero.title}
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-300">
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

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {dict.marketing.hero.cards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="font-semibold">{c.title}</div>
                  <div className="mt-1 text-sm text-zinc-300">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 SEÇÕES */}
      <Section
        id={dict.marketing.sections.mission.id}
        title={dict.marketing.sections.mission.title}
        subtitle={dict.marketing.sections.mission.subtitle}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {dict.marketing.sections.mission.bullets.map((text) => (
            <div
              key={text}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300"
            >
              {text}
            </div>
          ))}
        </div>
      </Section>

      <Section
        id={dict.marketing.sections.programs.id}
        title={dict.marketing.sections.programs.title}
        subtitle={dict.marketing.sections.programs.subtitle}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {dict.marketing.sections.programs.cards.map((x) => (
            <div
              key={x}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <div className="font-semibold">{x}</div>
              <div className="mt-1 text-sm text-zinc-300">
                {dict.marketing.sections.programs.cardDesc}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id={dict.marketing.sections.contents.id}
        title={dict.marketing.sections.contents.title}
        subtitle={dict.marketing.sections.contents.subtitle}
      >
        <div className="flex flex-wrap gap-2">
          {dict.marketing.sections.contents.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </Section>

      <Section
        id={dict.marketing.sections.community.id}
        title={dict.marketing.sections.community.title}
        subtitle={dict.marketing.sections.community.subtitle}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
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
