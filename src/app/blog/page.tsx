"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function BlogPage() {
  const { locale } = useI18n();
  const isEn = locale === "en";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
          {isEn ? "Blog" : "Blog"}
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
          {isEn
            ? "We're setting up this area. Soon we'll publish technical articles, notes about open-data pipelines, and implementation guides."
            : "Estamos preparando esta área. Em breve vamos publicar artigos técnicos, notas sobre pipelines de dados abertos e guias de implementação."}
        </p>
      </section>
    </main>
  );
}
