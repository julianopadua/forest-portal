import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/dictionaries";

function formatDateOnly(iso: string, locale: Locale) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "pt-BR");
}

export type BlogIndexTileProps = {
  locale: Locale;
  href: string;
  categoryTitle: string;
  authorLine: string;
  title: string;
  excerpt: string;
  heroImageSrc?: string;
  publishedAt: string;
  tags: string[];
  priorityImage?: boolean;
};

export default function BlogIndexTile({
  locale,
  href,
  categoryTitle,
  authorLine,
  title,
  excerpt,
  heroImageSrc,
  publishedAt,
  tags,
  priorityImage,
}: BlogIndexTileProps) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-float)] transition hover:border-[color:var(--primary)]/35 hover:shadow-lg">
      <Link
        href={href}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
      >
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-[color:var(--surface-2)]">
          {heroImageSrc ? (
            <Image
              src={heroImageSrc}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priorityImage}
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/25 via-[color:var(--surface-2)] to-[color:var(--background)]"
              aria-hidden
            />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/85 sm:tracking-[0.16em] md:text-[10px]">
              {categoryTitle}
            </p>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/65 line-clamp-1 sm:tracking-[0.14em] md:text-[10px]">
              {authorLine}
            </p>
            <h2 className="mt-1.5 text-balance break-words text-base font-black leading-snug tracking-tight text-white line-clamp-2 md:mt-2 md:text-lg">
              {title}
            </h2>
          </div>
        </div>

        <div className="space-y-2 p-3 md:p-4">
          <p className="break-words text-sm leading-snug text-[color:var(--muted)] line-clamp-3">{excerpt}</p>

          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            {formatDateOnly(publishedAt, locale)}
          </p>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[color:var(--surface-2)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
