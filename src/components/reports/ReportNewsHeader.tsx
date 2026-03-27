// src/components/reports/ReportNewsHeader.tsx
import Image from "next/image";
import type { Locale } from "@/lib/reports/types";

function formatDateTime(iso: string, locale: Locale) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(locale === "en" ? "en-US" : "pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function ReportNewsHeader({
  locale,
  categoryTitle,
  sourceTitle,
  title,
  generatedAt,
  heroImageSrc,
  heroImageCredit,
}: {
  locale: Locale;
  categoryTitle: string;
  sourceTitle: string;
  title: string;
  generatedAt: string;
  heroImageSrc?: string;
  heroImageCredit?: string;
}) {
  return (
    <header className="border-b border-[color:var(--border)] pb-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">
        {categoryTitle}
        <span className="text-[color:var(--border)]"> · </span>
        {sourceTitle}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight text-[color:var(--foreground)] md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-[color:var(--muted)]">
        {locale === "en" ? "Published" : "Publicado"}: {formatDateTime(generatedAt, locale)}
      </p>

      {heroImageSrc ? (
        <figure className="mt-8 overflow-hidden border border-[color:var(--border)] bg-black/5">
          <div className="relative aspect-[21/9] w-full max-h-[min(420px,50vh)]">
            <Image
              src={heroImageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1152px) 100vw, 896px"
              priority
            />
          </div>
          {heroImageCredit ? (
            <figcaption className="border-t border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-left text-[11px] leading-snug text-[color:var(--muted)]">
              {heroImageCredit}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </header>
  );
}
