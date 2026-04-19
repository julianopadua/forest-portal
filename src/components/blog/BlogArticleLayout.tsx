import Image from "next/image";
import BlogMarkdown from "@/components/blog/BlogMarkdown";
import type { BlogPost } from "@/lib/blog/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogArticleLayout({ post }: { post: BlogPost }) {
  const { frontmatter, content } = post;

  return (
    <article className="mx-auto w-full max-w-3xl">
      <header className="text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] md:text-4xl md:leading-tight">
          {frontmatter.title}
        </h1>
        {frontmatter.subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] md:text-xl">
            {frontmatter.subtitle}
          </p>
        ) : null}
        <p className="mt-6 text-sm text-[color:var(--muted)]">
          <span className="font-medium text-[color:var(--foreground)]">{frontmatter.author}</span>
          <span className="mx-2 text-[color:var(--border)]">·</span>
          <time dateTime={frontmatter.publishedAt}>{formatDate(frontmatter.publishedAt)}</time>
        </p>
      </header>

      <div className="mt-10">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] shadow-[var(--shadow-float)]">
          <Image
            src={frontmatter.mainImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
            priority
          />
        </div>
        {frontmatter.mainImageCaption ? (
          <p className="mt-3 text-center text-sm text-[color:var(--muted)]">{frontmatter.mainImageCaption}</p>
        ) : null}
      </div>

      <div className="mt-14 border-t border-[color:var(--border)] pt-14">
        <BlogMarkdown content={content} />
      </div>
    </article>
  );
}
