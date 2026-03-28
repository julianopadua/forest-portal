// src/components/reports/ReportNewsSidebar.tsx
import Link from "next/link";
import NoticiasAgricolasRelatedBlock from "@/components/reports/NoticiasAgricolasRelatedBlock";
import ReportHighlights from "@/components/reports/ReportHighlights";
import type { ReportCatalogItem } from "@/lib/reports/catalog";
import type { Locale, ResolvedReportHighlight } from "@/lib/reports/types";

function formatDateTime(iso: string, locale: Locale) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(locale === "en" ? "en-US" : "pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ReportNewsSidebar({
  locale,
  catalogItem,
  generatedAt,
  yearRange,
  latestPeriod,
  highlights,
  relatedAgricolasNews = false,
}: {
  locale: Locale;
  catalogItem: ReportCatalogItem;
  generatedAt: string;
  yearRange?: string | null;
  latestPeriod?: string | null;
  highlights: ResolvedReportHighlight[];
  /** Feed JSON em Storage (Notícias Agrícolas), ex.: relatório BDQueimadas. */
  relatedAgricolasNews?: boolean;
}) {
  const relatedUrl = catalogItem.relatedArticleUrl;
  const relatedLabel =
    locale === "en"
      ? catalogItem.relatedArticleLabelEn ?? catalogItem.relatedArticleLabelPt
      : catalogItem.relatedArticleLabelPt ?? catalogItem.relatedArticleLabelEn;

  return (
    <aside className="space-y-5 border-t border-[color:var(--border)] pt-6 lg:border-t-0 lg:pt-0">
      <ReportHighlights locale={locale} highlights={highlights} variant="sidebar" />

      {relatedAgricolasNews ? <NoticiasAgricolasRelatedBlock locale={locale} /> : null}

      <div className="border border-[color:var(--border)] bg-[color:var(--surface-2)]/50 p-4 text-xs leading-relaxed text-[color:var(--foreground)]">
        <h2 className="border-b border-[color:var(--border)] pb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
          {locale === "en" ? "About this report" : "Sobre este relatório"}
        </h2>
        <dl className="mt-3 space-y-2">
          <div>
            <dt className="font-semibold text-[color:var(--muted)]">
              {locale === "en" ? "Category" : "Categoria"}
            </dt>
            <dd>{catalogItem.categoryTitle}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[color:var(--muted)]">
              {locale === "en" ? "Source" : "Fonte"}
            </dt>
            <dd>{catalogItem.sourceTitle}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[color:var(--muted)]">
              {locale === "en" ? "Updated" : "Atualizado"}
            </dt>
            <dd>{formatDateTime(generatedAt, locale)}</dd>
          </div>
          {yearRange ? (
            <div>
              <dt className="font-semibold text-[color:var(--muted)]">
                {locale === "en" ? "Coverage" : "Cobertura"}
              </dt>
              <dd>{yearRange}</dd>
            </div>
          ) : null}
          {latestPeriod ? (
            <div>
              <dt className="font-semibold text-[color:var(--muted)]">
                {locale === "en" ? "Latest period" : "Último período"}
              </dt>
              <dd>{latestPeriod}</dd>
            </div>
          ) : null}
        </dl>

        {catalogItem.sourcePortalHref ? (
          <p className="mt-3 border-t border-[color:var(--border)] pt-3">
            <Link
              href={catalogItem.sourcePortalHref}
              className="font-medium text-[color:var(--primary)] underline-offset-2 hover:underline"
            >
              {locale === "en" ? "Dataset in Forest Portal" : "Base no Forest Portal"}
            </Link>
          </p>
        ) : null}

        {relatedUrl && relatedLabel ? (
          <p className="mt-2">
            <a
              href={relatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[color:var(--primary)] underline-offset-2 hover:underline"
            >
              {relatedLabel}
            </a>
          </p>
        ) : null}
      </div>
    </aside>
  );
}
