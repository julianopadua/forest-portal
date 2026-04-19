import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { BLOG_POST_SLUGS, isBlogSlug, type BlogSlug } from "./catalog";
import type { BlogPost, BlogPostFrontmatter } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function parseFrontmatter(data: Record<string, unknown>): BlogPostFrontmatter {
  const title = typeof data.title === "string" ? data.title : "";
  const subtitle = typeof data.subtitle === "string" ? data.subtitle : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
  const publishedAt = typeof data.publishedAt === "string" ? data.publishedAt : "";
  const author = typeof data.author === "string" ? data.author : "";
  const tags = toStringArray(data.tags);
  const cardImage =
    typeof data.cardImage === "string" && data.cardImage.trim() ? data.cardImage.trim() : undefined;
  const mainImage =
    typeof data.mainImage === "string" && data.mainImage.trim() ? data.mainImage.trim() : undefined;
  const mainImageCaption =
    typeof data.mainImageCaption === "string" ? data.mainImageCaption : undefined;

  if (!title || !publishedAt || !author) {
    throw new Error("Frontmatter obrigatório: title, publishedAt, author");
  }

  return {
    title,
    subtitle,
    excerpt: excerpt || title,
    publishedAt,
    author,
    tags,
    cardImage,
    mainImage,
    mainImageCaption,
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isBlogSlug(slug)) return null;

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = parseFrontmatter(data as Record<string, unknown>);

  return {
    slug,
    frontmatter,
    content: content.trim(),
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    (BLOG_POST_SLUGS as readonly BlogSlug[]).map(async (slug) => {
      const post = await getPostBySlug(slug);
      if (!post) throw new Error(`Post ausente: ${slug}`);
      return post;
    }),
  );

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime(),
  );
}
