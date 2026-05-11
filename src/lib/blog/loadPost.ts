import matter from "gray-matter";
import { BLOG_POST_SLUGS, isBlogSlug, type BlogSlug } from "./catalog";
import type { BlogPost, BlogPostFrontmatter } from "./types";
import type { Locale } from "@/i18n/dictionaries";
import rawPosts from "./posts.generated.json";

export type BlogBundledEntry = string | { bilingual: true; pt: string; en: string };

const POSTS_RAW = rawPosts as Record<string, BlogBundledEntry>;

function isBilingualBundle(v: unknown): v is { bilingual: true; pt: string; en: string } {
  return (
    typeof v === "object" &&
    v !== null &&
    "bilingual" in v &&
    (v as { bilingual?: unknown }).bilingual === true &&
    typeof (v as { pt?: unknown }).pt === "string" &&
    typeof (v as { en?: unknown }).en === "string"
  );
}

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

export type BlogIndexItem =
  | { kind: "single"; slug: string; post: BlogPost }
  | { kind: "bilingual"; slug: string; pt: BlogPost; en: BlogPost };

export function pickPostForLocale(item: BlogIndexItem, locale: Locale): BlogPost {
  if (item.kind === "single") return item.post;
  return locale === "en" ? item.en : item.pt;
}

export async function getPostBySlug(slug: string, locale: Locale = "pt"): Promise<BlogPost | null> {
  if (!isBlogSlug(slug)) return null;

  const raw = POSTS_RAW[slug];
  if (raw === undefined) {
    throw new Error(`Post ausente no bundle gerado: ${slug}. Rode npm run build ou node scripts/build-blog-bundle.mjs`);
  }

  if (typeof raw === "string") {
    return matterToPost(slug, raw);
  }

  if (isBilingualBundle(raw)) {
    return matterToPost(slug, locale === "en" ? raw.en : raw.pt);
  }

  throw new Error(`Formato de bundle inválido para slug: ${slug}`);
}

/** Metadados e corpo PT+EN para páginas que alternam idioma no cliente. */
export async function getBilingualPostsIfAny(
  slug: string,
): Promise<{ pt: BlogPost; en: BlogPost } | null> {
  if (!isBlogSlug(slug)) return null;
  const raw = POSTS_RAW[slug];
  if (raw === undefined || typeof raw === "string") return null;
  if (!isBilingualBundle(raw)) return null;
  return { pt: matterToPost(slug, raw.pt), en: matterToPost(slug, raw.en) };
}

export async function getBlogIndexItems(): Promise<BlogIndexItem[]> {
  const items: BlogIndexItem[] = [];

  for (const slug of BLOG_POST_SLUGS as readonly BlogSlug[]) {
    const raw = POSTS_RAW[slug];
    if (raw === undefined) {
      throw new Error(`Post ausente: ${slug}`);
    }
    if (typeof raw === "string") {
      items.push({ kind: "single", slug, post: matterToPost(slug, raw) });
    } else if (isBilingualBundle(raw)) {
      items.push({
        kind: "bilingual",
        slug,
        pt: matterToPost(slug, raw.pt),
        en: matterToPost(slug, raw.en),
      });
    } else {
      throw new Error(`Formato de bundle inválido para slug: ${slug}`);
    }
  }

  return items.sort(
    (a, b) =>
      new Date(pickPostForLocale(b, "pt").frontmatter.publishedAt).getTime() -
      new Date(pickPostForLocale(a, "pt").frontmatter.publishedAt).getTime(),
  );
}

/** @deprecated Prefer getBlogIndexItems (suporta bilíngue). */
export async function getAllPosts(): Promise<BlogPost[]> {
  const items = await getBlogIndexItems();
  return items.map((it) => pickPostForLocale(it, "pt"));
}
