// src/app/reports/page.tsx

import Link from "next/link";
import { REPORTS_CATALOG } from "@/lib/reports/catalog";
import { fetchStableReport } from "@/lib/reports/fetch";

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
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
        };
      }
    })
  );

  return cards;
}

export default async function ReportsPage() {
  const cards = await loadCards();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[var(--shadow-float)] md:p-10">
        <div className="max-w-4xl">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
            Publicações / Relatórios
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[color:var(--foreground)] md:text-5xl">
            Relatórios analíticos
          </h1>

          <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
            Esta seção reúne páginas analíticas permanentes, atualizadas a partir de pipelines
            de dados e publicadas como artefatos leves consumidos diretamente pelo portal.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={`/reports/${card.slug}`}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-float)] transition hover:-translate-y-0.5 hover:bg-[color:var(--surface-2)]"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
              {card.categoryTitle} / {card.sourceTitle}
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-[color:var(--foreground)]">
              {card.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
              {card.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-[11px] font-medium text-[color:var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
              <div>
                <span className="opacity-60">Atualizado:</span>{" "}
                <span className="text-[color:var(--foreground)]">
                  {card.generatedAt ? formatDateOnly(card.generatedAt) : "-"}
                </span>
              </div>

              {card.yearRange ? (
                <div>
                  <span className="opacity-60">Cobertura:</span>{" "}
                  <span className="text-[color:var(--foreground)]">{card.yearRange}</span>
                </div>
              ) : null}

              {card.latestYear ? (
                <div>
                  <span className="opacity-60">Ano:</span>{" "}
                  <span className="text-[color:var(--foreground)]">{card.latestYear}</span>
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}