import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import BlogPostPageClient from "@/components/blog/BlogPostPageClient";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import type { Locale } from "@/i18n/dictionaries";
import { BLOG_POST_SLUGS } from "@/lib/blog/catalog";
import { getBilingualPostsIfAny, getPostBySlug } from "@/lib/blog/loadPost";

function readLocaleFromCookies(jar: Awaited<ReturnType<typeof cookies>>): Locale {
  const v = jar.get(LOCALE_COOKIE_NAME)?.value;
  return v === "en" ? "en" : "pt";
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
  const jar = await cookies();
  const loc = readLocaleFromCookies(jar);

  const pair = await getBilingualPostsIfAny(slug);
  const post = pair ? (loc === "en" ? pair.en : pair.pt) : await getPostBySlug(slug, loc);
  if (!post) return { title: "Blog" };

  const { title, excerpt, mainImage } = post.frontmatter;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const ogImage =
    mainImage && siteUrl ? new URL(mainImage, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString() : mainImage;

  const withImages =
    ogImage && mainImage
      ? {
          openGraph: {
            title,
            description: excerpt,
            type: "article" as const,
            publishedTime: post.frontmatter.publishedAt,
            images: [{ url: ogImage, alt: title }],
          },
          twitter: {
            card: "summary_large_image" as const,
            title,
            description: excerpt,
            images: [ogImage],
          },
        }
      : {
          openGraph: {
            title,
            description: excerpt,
            type: "article" as const,
            publishedTime: post.frontmatter.publishedAt,
          },
          twitter: {
            card: "summary" as const,
            title,
            description: excerpt,
          },
        };

  return {
    title: `${title} · Blog`,
    description: excerpt,
    ...withImages,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const pair = await getBilingualPostsIfAny(slug);
  if (pair) {
    return <BlogPostPageClient single={null} bilingual={pair} />;
  }

  const post = await getPostBySlug(slug, "pt");
  if (!post) notFound();

  return <BlogPostPageClient single={post} bilingual={null} />;
}
