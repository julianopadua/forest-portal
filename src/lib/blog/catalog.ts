/**
 * Slugs publicados, em ordem de exibição no índice (mais recente primeiro).
 * Ao adicionar um post: criar `content/blog/{slug}.md`, depois incluir o slug aqui.
 */
export const BLOG_POST_SLUGS = ["blog-000"] as const;

export type BlogSlug = (typeof BLOG_POST_SLUGS)[number];

export function isBlogSlug(value: string): value is BlogSlug {
  return (BLOG_POST_SLUGS as readonly string[]).includes(value);
}
