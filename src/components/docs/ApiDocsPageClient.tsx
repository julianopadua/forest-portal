"use client";

import CopyMarkdownButton from "@/components/docs/CopyMarkdownButton";
import DocsFeedbackForm from "@/components/docs/DocsFeedbackForm";
import DocsLayout from "@/components/docs/DocsLayout";
import DocsMarkdown from "@/components/docs/DocsMarkdown";
import { API_DOCS_SECTIONS_BY_LOCALE } from "@/components/docs/apiDocsSections";
import { useI18n } from "@/i18n/I18nProvider";
import type { DocSource } from "@/lib/docs/types";

type ApiDocsPageClientProps = {
  docs: Record<"pt" | "en", DocSource>;
};

export default function ApiDocsPageClient({ docs }: ApiDocsPageClientProps) {
  const { locale, dict } = useI18n();
  const t = dict.docs;
  const doc = docs[locale];
  const sections = API_DOCS_SECTIONS_BY_LOCALE[locale];

  return (
    <DocsLayout sections={sections} rightRail={<DocsFeedbackForm context="docs/api/v1" />}>
      <header className="not-prose mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            {t.header.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
            {t.header.title}
          </h1>
        </div>
        <CopyMarkdownButton
          markdown={doc.markdown}
          copyLabel={t.copyMarkdown}
          copiedLabel={t.copied}
        />
      </header>

      <DocsMarkdown key={locale} markdown={doc.markdown} />
    </DocsLayout>
  );
}
