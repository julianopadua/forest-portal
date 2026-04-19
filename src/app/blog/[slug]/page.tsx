import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import { BLOG_POST_SLUGS } from "@/lib/blog/catalog";
import { getPostBySlug } from "@/lib/blog/loadPost";

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

export async function generateStaticParams() {
  return BLOG_POST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };

  const { title, excerpt, mainImage } = post.frontmatter;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const ogImage = siteUrl ? new URL(mainImage, siteUrl).toString() : mainImage;

  return {
    title: `${title} · Blog`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: post.frontmatter.publishedAt,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Voltar para o blog
        </Link>
      </div>

      <BlogArticleLayout post={post} />
    </main>
  );
}
