// src/app/reports/page.tsx

import ReportsIndexTile from "@/components/reports/ReportsIndexTile";
import { REPORTS_CATALOG } from "@/lib/reports/catalog";
import { fetchStableReport } from "@/lib/reports/fetch";
import { resolveLocalizedText, resolveNullableLocalizedText } from "@/lib/reports/localize";
import type { ReportDocument } from "@/lib/reports/types";

function truncateOverview(text: string, maxLen: number) {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const head = lastSpace > 48 ? cut.slice(0, lastSpace) : cut;
  return `${head.trim()}…`;
}

function excerptFromDocument(doc: ReportDocument, fallbackDescription: string): string {
  const fromAnalysis = doc.analysis?.overview
    ? resolveLocalizedText(doc.analysis.overview, "pt")
    : "";
  if (fromAnalysis.trim()) return truncateOverview(fromAnalysis, 260);

  const fromSummary = resolveNullableLocalizedText(doc.summary ?? null, "pt");
  if (fromSummary?.trim()) return truncateOverview(fromSummary, 260);

  return truncateOverview(fallbackDescription, 260);
}

type ReportCardData = {
  slug: string;
  title: string;
  description: string;
  sourceTitle: string;
  categoryTitle: string;
  tags: string[];
  generatedAt: string | null;
  yearRange: string | null;
  latestYear: number | null;
  heroImageSrc?: string;
  excerpt: string;
};

async function loadCards(): Promise<ReportCardData[]> {
  const cards = await Promise.all(
    REPORTS_CATALOG.map(async (item) => {
      try {
        const doc = await fetchStableReport(item.stableReportPath);
        return {
          slug: item.slug,
          title: item.title,
          description: item.description,
          sourceTitle: item.sourceTitle,
          categoryTitle: item.categoryTitle,
          tags: item.tags,
          generatedAt: doc.generated_at ?? null,
          yearRange: doc.coverage?.year_range ?? null,
          latestYear: doc.coverage?.latest_year ?? null,
          heroImageSrc: item.heroImageSrc,
          excerpt: excerptFromDocument(doc, item.description),
        };
      } catch {
        return {
          slug: item.slug,
          title: item.title,
          description: item.description,
          sourceTitle: item.sourceTitle,
          categoryTitle: item.categoryTitle,
          tags: item.tags,
          generatedAt: null,
          yearRange: null,
          latestYear: null,
          heroImageSrc: item.heroImageSrc,
          excerpt: truncateOverview(item.description, 260),
        };
      }
    }),
  );

  return cards;
}

export default async function ReportsPage() {
  const cards = await loadCards();

  return (
    <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-4">
      <header className="w-full border-b border-[color:var(--border)] pb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">
          Publicações / Relatórios
        </p>

        <h1 className="mt-3 w-full text-3xl font-black tracking-tight text-[color:var(--foreground)] md:text-5xl">
          Relatórios analíticos
        </h1>

        <div className="mt-6 w-full space-y-4 text-base leading-relaxed text-[color:var(--muted)]">
          <p>
            Esta seção mostra o que dados públicos e automação conseguem fazer quando o método é aberto: páginas
            analíticas que se atualizam a partir de pipelines reproduzíveis, com apoio de inteligência artificial na
            redação e na organização do conteúdo — sempre sobre as mesmas bases que você pode auditar no catálogo de
            dados abertos.
          </p>
          <p>
            O objetivo é informar e, ao mesmo tempo, dar visibilidade ao poder da automação e ao ecossistema
            open-source que torna isso possível. Cada relatório traz notícias e leituras de apoio escolhidas para
            contextualizar o tema: elas têm peso próprio — use-as para ir além do que está publicado aqui e não se
            baseie só neste resumo automatizado.
          </p>
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
            generatedAt={card.generatedAt}
            yearRange={card.yearRange}
            latestYear={card.latestYear}
            tags={card.tags}
            priorityImage={index === 0}
          />
        ))}
      </section>
    </main>
  );
}
