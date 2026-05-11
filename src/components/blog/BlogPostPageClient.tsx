"use client";

import Link from "next/link";
import { useMemo } from "react";
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import TableOfContents from "@/components/blog/TableOfContents";
import { useI18n } from "@/i18n/I18nProvider";
import { extractHeadings } from "@/lib/blog/extractHeadings";
import type { BlogPost } from "@/lib/blog/types";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function BlogPostPageClient({
  single,
  bilingual,
}: {
  single: BlogPost | null;
  bilingual: { pt: BlogPost; en: BlogPost } | null;
}) {
  const { locale, dict } = useI18n();
  const post = single ?? (locale === "en" ? bilingual!.en : bilingual!.pt);
  const headings = useMemo(() => extractHeadings(post.content), [post.content]);
  const backLabel = dict.blogsPage.backToBlog;
  const tocTitle = dict.blogsPage.tocLabel;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 xl:grid-cols-[1fr_260px] xl:gap-16">
        <div className="min-w-0">
          <BlogArticleLayout post={post} />
        </div>
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-28 pt-2">
              <TableOfContents headings={headings} title={tocTitle} />
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
