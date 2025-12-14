// src/app/(marketing)/page.tsx

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-16 md:py-24">
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

export default function MarketingHome() {
  const { dict } = useI18n();

  const openData = dict.marketing.sections.mission;
  const commodities = dict.marketing.sections.programs;
  const reports = dict.marketing.sections.contents;
  const education = dict.marketing.sections.community;

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

            <div className="mt-6">
              <Link href={`/${openData.id}`}>
                <Button>{dict.marketing.hero.ctaPrimary}</Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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

      {/* OPEN DATA */}
      <Section title={openData.title} subtitle={openData.subtitle}>
        <div className="grid gap-3 md:grid-cols-2">
          {openData.bullets.map((text) => (
            <div
              key={text}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300"
            >
              {text}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href={`/${openData.id}`}>
            <Button variant="ghost">{openData.cta}</Button>
          </Link>
        </div>
      </Section>

      {/* COMMODITIES */}
      <Section title={commodities.title} subtitle={commodities.subtitle}>
        <div className="grid gap-3 md:grid-cols-3">
          {commodities.cards.map((x) => (
            <div key={x} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">{x}</div>
              <div className="mt-1 text-sm text-zinc-300">{commodities.cardDesc}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href={`/${commodities.id}`}>
            <Button variant="ghost">{commodities.cta}</Button>
          </Link>
        </div>
      </Section>

      {/* REPORTS */}
      <Section title={reports.title} subtitle={reports.subtitle}>
        <div className="flex flex-wrap gap-2">
          {reports.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <Link href={`/${reports.id}`}>
            <Button variant="ghost">{reports.cta}</Button>
          </Link>
        </div>
      </Section>

      {/* EDUCATION */}
      <Section title={education.title} subtitle={education.subtitle}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/${education.id}`}>
            <Button>{education.ctaPrimary}</Button>
          </Link>

          <Link href={`/${education.id}`}>
            <Button variant="ghost">{education.ctaSecondary}</Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
