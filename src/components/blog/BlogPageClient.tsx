"use client";

import BlogIndexTile from "@/components/blog/BlogIndexTile";
import { useI18n } from "@/i18n/I18nProvider";
import type { BlogIndexItem } from "@/lib/blog/loadPost";
import { pickPostForLocale } from "@/lib/blog/loadPost";

export default function BlogPageClient({ items }: { items: BlogIndexItem[] }) {
  const { locale, dict } = useI18n();
  const copy = dict.blogsPage;

  return (
    <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-4">
      <header className="w-full border-b border-[color:var(--border)] pb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">{copy.eyebrow}</p>

        <h1 className="mt-3 w-full text-3xl font-black tracking-tight text-[color:var(--foreground)] md:text-5xl">
          {copy.title}
        </h1>

        <div className="mt-6 w-full space-y-4 text-base leading-relaxed text-[color:var(--muted)]">
          <p>{copy.intro}</p>
        </div>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        {items.map((item, index) => {
          const post = pickPostForLocale(item, locale);
          return (
            <BlogIndexTile
              key={item.slug}
              href={`/blog/${item.slug}`}
              categoryTitle={copy.categoryLabel}
              authorLine={post.frontmatter.author}
              title={post.frontmatter.title}
              excerpt={post.frontmatter.excerpt}
              heroImageSrc={post.frontmatter.cardImage ?? post.frontmatter.mainImage}
              publishedAt={post.frontmatter.publishedAt}
              tags={post.frontmatter.tags}
              priorityImage={index === 0}
            />
          );
        })}
      </section>
    </main>
  );
}
