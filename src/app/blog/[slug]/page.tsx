import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPageClient from "@/components/blog/BlogPostPageClient";
import { getBilingualPostsIfAny, getBlogSlugs, getPostBySlug } from "@/lib/blog/loadPost";

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const pair = await getBilingualPostsIfAny(slug);
  const post = pair ? pair.pt : await getPostBySlug(slug, "pt");
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
