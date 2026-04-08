"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function QuemSomosPage() {
  const { locale, dict } = useI18n();
  const isEn = locale === "en";
  const creator = dict.marketing.creator;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-9">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
          {dict.common.aboutUs}
        </h1>
        <p className="mt-3 max-w-3xl text-[color:var(--muted)]">
          {isEn
            ? "A brief presentation of the people and principles behind Forest Institute."
            : "Uma apresentação breve das pessoas e dos princípios por trás do Instituto Forest."}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
            <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{creator.authorCard.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{creator.authorCard.body}</p>
          </article>

          <article className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
            <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{creator.contactCard.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{creator.contactCard.withoutUrl}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
