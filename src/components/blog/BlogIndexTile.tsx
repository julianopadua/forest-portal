import Image from "next/image";
import Link from "next/link";

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

export type BlogIndexTileProps = {
  href: string;
  categoryTitle: string;
  authorLine: string;
  title: string;
  excerpt: string;
  heroImageSrc: string;
  publishedAt: string;
  tags: string[];
  priorityImage?: boolean;
};

export default function BlogIndexTile({
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
    <article className="group overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-float)] transition hover:border-[color:var(--primary)]/35 hover:shadow-lg">
      <Link
        href={href}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
      >
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-[color:var(--surface-2)]">
          <Image
            src={heroImageSrc}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priorityImage}
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/85 md:text-[10px]">
              {categoryTitle}
              <span className="text-white/40"> · </span>
              {authorLine}
            </p>
            <h2 className="mt-1 text-balance text-base font-black leading-snug tracking-tight text-white line-clamp-2 md:mt-1.5 md:text-lg">
              {title}
            </h2>
          </div>
        </div>

        <div className="space-y-2 p-3 md:p-4">
          <p className="text-sm leading-snug text-[color:var(--muted)] line-clamp-3">{excerpt}</p>

          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            {formatDateOnly(publishedAt)}
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
