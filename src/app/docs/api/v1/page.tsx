import type { Metadata } from "next";
import { cookies } from "next/headers";

import CopyMarkdownButton from "@/components/docs/CopyMarkdownButton";
import DocsFeedbackForm from "@/components/docs/DocsFeedbackForm";
import DocsLayout from "@/components/docs/DocsLayout";
import DocsMarkdown from "@/components/docs/DocsMarkdown";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import { dictionaries, type Locale } from "@/i18n/dictionaries";
import { loadDoc } from "@/lib/docs/loadDoc";

export const metadata: Metadata = {
  title: "Open Data API v1 - Forest",
  description: "Public, read-only HTTP API for the Instituto Forest open-data catalog.",
};

function readLocaleFromCookies(jar: Awaited<ReturnType<typeof cookies>>): Locale {
  const v = jar.get(LOCALE_COOKIE_NAME)?.value;
  return v === "en" ? "en" : "pt";
}

const SECTIONS_BY_LOCALE = {
  pt: [
    {
      title: "API de Dados Abertos v1",
      items: [
        { href: "#visao-geral", label: "Visão geral" },
        { href: "#autenticacao", label: "Autenticação" },
        { href: "#versionamento", label: "Versionamento" },
        { href: "#cache", label: "Cache" },
        { href: "#erros", label: "Erros" },
        { href: "#especificacao-openapi", label: "Especificação OpenAPI" },
      ],
    },
    {
      title: "Endpoints",
      items: [
        { href: "#get-health", label: "GET /health" },
        { href: "#get-catalog", label: "GET /catalog" },
        { href: "#get-catalogreports", label: "GET /catalog/reports" },
        { href: "#get-datasetsid", label: "GET /datasets/{id}" },
        { href: "#get-datasetsiditems", label: "GET /datasets/{id}/items" },
        { href: "#get-reportsid", label: "GET /reports/{id}" },
        { href: "#get-sources", label: "GET /sources" },
      ],
    },
    {
      title: "SDK",
      items: [{ href: "#sdk-python", label: "SDK Python" }],
    },
  ],
  en: [
    {
      title: "Open Data API v1",
      items: [
        { href: "#overview", label: "Overview" },
        { href: "#authentication", label: "Authentication" },
        { href: "#versioning", label: "Versioning" },
        { href: "#caching", label: "Caching" },
        { href: "#errors", label: "Errors" },
        { href: "#openapi-specification", label: "OpenAPI specification" },
      ],
    },
    {
      title: "Endpoints",
      items: [
        { href: "#get-health", label: "GET /health" },
        { href: "#get-catalog", label: "GET /catalog" },
        { href: "#get-catalogreports", label: "GET /catalog/reports" },
        { href: "#get-datasetsid", label: "GET /datasets/{id}" },
        { href: "#get-datasetsiditems", label: "GET /datasets/{id}/items" },
        { href: "#get-reportsid", label: "GET /reports/{id}" },
        { href: "#get-sources", label: "GET /sources" },
      ],
    },
    {
      title: "SDK",
      items: [{ href: "#python-sdk", label: "Python SDK" }],
    },
  ],
} as const;

export default async function ApiDocsPage() {
  const jar = await cookies();
  const locale = readLocaleFromCookies(jar);
  const t = dictionaries[locale].docs;

  const doc = await loadDoc("api-v1", locale);
  const sections = SECTIONS_BY_LOCALE[locale];

  return (
    <DocsLayout
      sections={[...sections]}
      rightRail={<DocsFeedbackForm context="docs/api/v1" />}
    >
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

      <DocsMarkdown markdown={doc.markdown} />
    </DocsLayout>
  );
}
