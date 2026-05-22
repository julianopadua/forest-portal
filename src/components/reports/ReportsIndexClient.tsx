"use client";

import ReportsIndexTile from "@/components/reports/ReportsIndexTile";
import { useI18n } from "@/i18n/I18nProvider";
import { getLocaleTag } from "@/lib/reports/localize";
import { localizeCatalogItem } from "@/lib/reports/localizeCatalog";
import type { ReportCatalogItem } from "@/lib/reports/catalog";

function truncateOverview(text: string, maxLen: number) {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const head = lastSpace > 48 ? cut.slice(0, lastSpace) : cut;
  return head.trim();
}

function formatDateForLocale(iso: string, locale: "pt" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(getLocaleTag(locale));
}

export default function ReportsIndexClient({ reports }: { reports: ReportCatalogItem[] }) {
  const { locale, dict } = useI18n();
  const t = dict.reports.index;
  const meta = dict.reports.meta;

  const cards = reports.map((item) => {
    const localized = localizeCatalogItem(item, locale);
    const excerpt =
      locale === "en"
        ? item.excerptEn ?? item.excerpt ?? localized.description
        : item.excerpt ?? localized.description;

    const metaParts: string[] = [];
    if (item.generatedAt) {
      metaParts.push(`${meta.updated} ${formatDateForLocale(item.generatedAt, locale)}`);
    }
    if (item.coverage?.yearRange) {
      metaParts.push(`${meta.coverage} ${item.coverage.yearRange}`);
    } else if (item.coverage?.latestYear) {
      metaParts.push(`${meta.year} ${item.coverage.latestYear}`);
    }

    return {
      slug: item.slug,
      title: localized.title,
      sourceTitle: localized.sourceTitle,
      categoryTitle: localized.categoryTitle,
      tags: item.tags,
      metaParts,
      heroImageSrc: item.heroImageSrc,
      excerpt: truncateOverview(excerpt, 260),
    };
  });

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
