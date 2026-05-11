import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import type { BlogIndexItem, BlogPost, BlogPostFrontmatter } from "./types";
import { pickPostForLocale } from "./types";

const BLOG_CONTENT_DIR = join(process.cwd(), "content/blog");

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

function matterToPost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const frontmatter = parseFrontmatter(data as Record<string, unknown>);
  return {
    slug,
    frontmatter,
    content: content.trim(),
  };
}

async function listBlogFiles(): Promise<string[]> {
  const entries = await readdir(BLOG_CONTENT_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx") && !entry.name.includes(".draft."))
    .map((entry) => entry.name);
}

function fileNameToSlug(fileName: string): string | null {
  if (!fileName.endsWith(".mdx")) return null;
  if (fileName.endsWith(".en.mdx")) return fileName.slice(0, -".en.mdx".length);
  return fileName.slice(0, -".mdx".length);
}

async function readPostSource(fileName: string): Promise<string> {
  return readFile(join(BLOG_CONTENT_DIR, fileName), "utf8");
}

async function getBlogFileMap(): Promise<Map<string, { pt?: string; en?: string }>> {
  const files = await listBlogFiles();
  const map = new Map<string, { pt?: string; en?: string }>();

  for (const fileName of files) {
    const slug = fileNameToSlug(fileName);
    if (!slug) continue;

    const current = map.get(slug) ?? {};
    if (fileName.endsWith(".en.mdx")) {
      current.en = fileName;
    } else {
      current.pt = fileName;
    }
    map.set(slug, current);
  }

  return map;
}

export async function getBlogSlugs(): Promise<string[]> {
  const fileMap = await getBlogFileMap();
  return [...fileMap.keys()].sort();
}

export async function getPostBySlug(slug: string, locale: "pt" | "en" = "pt"): Promise<BlogPost | null> {
  const fileMap = await getBlogFileMap();
  const files = fileMap.get(slug);
  if (!files?.pt) return null;

  if (locale === "en" && files.en) {
    return matterToPost(slug, await readPostSource(files.en));
  }

  return matterToPost(slug, await readPostSource(files.pt));
}

export async function getBilingualPostsIfAny(
  slug: string,
): Promise<{ pt: BlogPost; en: BlogPost } | null> {
  const fileMap = await getBlogFileMap();
  const files = fileMap.get(slug);
  if (!files?.pt || !files.en) return null;

  return {
    pt: matterToPost(slug, await readPostSource(files.pt)),
    en: matterToPost(slug, await readPostSource(files.en)),
  };
}

export async function getBlogIndexItems(): Promise<BlogIndexItem[]> {
  const fileMap = await getBlogFileMap();
  const items: BlogIndexItem[] = [];

  for (const [slug, files] of fileMap) {
    if (!files.pt) continue;

    if (files.en) {
      items.push({
        kind: "bilingual",
        slug,
        pt: matterToPost(slug, await readPostSource(files.pt)),
        en: matterToPost(slug, await readPostSource(files.en)),
      });
      continue;
    }

    items.push({
      kind: "single",
      slug,
      post: matterToPost(slug, await readPostSource(files.pt)),
    });
  }

  return items.sort(
    (a, b) =>
      new Date(pickPostForLocale(b, "pt").frontmatter.publishedAt).getTime() -
      new Date(pickPostForLocale(a, "pt").frontmatter.publishedAt).getTime(),
  );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const items = await getBlogIndexItems();
  return items.map((it) => pickPostForLocale(it, "pt"));
}
