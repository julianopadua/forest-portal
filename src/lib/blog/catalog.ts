/**
 * Slugs publicados, em ordem de exibição no índice (mais recente primeiro).
 * Ao adicionar um post: criar `content/blog/{slug}.md`, incluir o slug aqui e
 * regenerar `posts.generated.json` via `npm run build` ou `node scripts/build-blog-bundle.mjs`.
 */
export const BLOG_POST_SLUGS = [
  "intro-pensamento-sistemico",
  "comunidade-open-source",
] as const;

export type BlogSlug = (typeof BLOG_POST_SLUGS)[number];

export function isBlogSlug(value: string): value is BlogSlug {
  return (BLOG_POST_SLUGS as readonly string[]).includes(value);
}
