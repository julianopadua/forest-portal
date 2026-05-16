// src/app/reports/page.tsx

import { cookies } from "next/headers";
import ReportsIndexTile from "@/components/reports/ReportsIndexTile";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import { dictionaries, type Locale } from "@/i18n/dictionaries";
import { getReportsCatalog } from "@/lib/reports/catalog";
import { fetchStableReport } from "@/lib/reports/fetch";
import { getLocaleTag, resolveLocalizedText, resolveNullableLocalizedText } from "@/lib/reports/localize";
import { localizeCatalogItem } from "@/lib/reports/localizeCatalog";
import type { ReportDocument } from "@/lib/reports/types";

function truncateOverview(text: string, maxLen: number) {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const head = lastSpace > 48 ? cut.slice(0, lastSpace) : cut;
  return `${head.trim()}…`;
}

function excerptFromDocument(
  doc: ReportDocument,
  fallbackDescription: string,
  locale: Locale,
): string {
  const fromAnalysis = doc.analysis?.overview
    ? resolveLocalizedText(doc.analysis.overview, locale)
    : "";
  if (fromAnalysis.trim()) return truncateOverview(fromAnalysis, 260);

  const fromSummary = resolveNullableLocalizedText(doc.summary ?? null, locale);
  if (fromSummary?.trim()) return truncateOverview(fromSummary, 260);

  return truncateOverview(fallbackDescription, 260);
}

function formatDateForLocale(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(getLocaleTag(locale));
}

type ReportCardData = {
  slug: string;
  title: string;
  description: string;
  sourceTitle: string;
  categoryTitle: string;
  tags: string[];
  metaParts: string[];
  heroImageSrc?: string;
  excerpt: string;
};

async function loadCards(locale: Locale): Promise<ReportCardData[]> {
  const meta = dictionaries[locale].reports.meta;
  const catalog = await getReportsCatalog();

  const buildMetaParts = (
    generatedAt: string | null,
    yearRange: string | null,
    latestYear: number | null,
  ): string[] => {
    const parts: string[] = [];
    if (generatedAt) parts.push(`${meta.updated} ${formatDateForLocale(generatedAt, locale)}`);
    if (yearRange) parts.push(`${meta.coverage} ${yearRange}`);
    else if (latestYear) parts.push(`${meta.year} ${latestYear}`);
    return parts;
  };

  const cards = await Promise.all(
    catalog.map(async (item) => {
      const localized = localizeCatalogItem(item, locale);
      try {
        const doc = await fetchStableReport(item.stableReportPath);
        return {
          slug: item.slug,
          title: localized.title,
          description: localized.description,
          sourceTitle: localized.sourceTitle,
          categoryTitle: localized.categoryTitle,
          tags: item.tags,
          metaParts: buildMetaParts(
            doc.generated_at ?? null,
            doc.coverage?.year_range ?? null,
            doc.coverage?.latest_year ?? null,
          ),
          heroImageSrc: item.heroImageSrc,
          excerpt: excerptFromDocument(doc, localized.description, locale),
        };
      } catch {
        return {
          slug: item.slug,
          title: localized.title,
          description: localized.description,
          sourceTitle: localized.sourceTitle,
          categoryTitle: localized.categoryTitle,
          tags: item.tags,
          metaParts: [],
          heroImageSrc: item.heroImageSrc,
          excerpt: truncateOverview(localized.description, 260),
        };
      }
    }),
  );

  return cards;
}

export default async function ReportsPage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = rawLocale === "en" ? "en" : "pt";
  const t = dictionaries[locale].reports.index;

  const cards = await loadCards(locale);

  return (
    <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-4">
      <header className="w-full border-b border-[color:var(--border)] pb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">
          {t.eyebrow}
        </p>

        <h1 className="mt-3 w-full text-3xl font-black tracking-tight text-[color:var(--foreground)] md:text-5xl">
          {t.title}
        </h1>

        <div className="mt-6 w-full space-y-4 text-base leading-relaxed text-[color:var(--muted)] text-justify hyphens-auto">
          {t.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        {cards.map((card, index) => (
          <ReportsIndexTile
            key={card.slug}
            href={`/reports/${card.slug}`}
            categoryTitle={card.categoryTitle}
            sourceTitle={card.sourceTitle}
            title={card.title}
            excerpt={card.excerpt}
            heroImageSrc={card.heroImageSrc}
            metaParts={card.metaParts}
            tags={card.tags}
            priorityImage={index === 0}
          />
        ))}
      </section>
    </main>
  );
}
