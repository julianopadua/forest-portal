export type BlogPostFrontmatter = {
  title: string;
  subtitle: string;
  excerpt: string;
  /** ISO date string */
  publishedAt: string;
  author: string;
  tags: string[];
  /** Imagem do card na listagem /blog; omitir se o post for só texto */
  cardImage?: string;
  /** Imagem principal entre cabeçalho e corpo; omitir se não houver */
  mainImage?: string;
  mainImageCaption?: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
};

export type BlogIndexItem =
  | { kind: "single"; slug: string; post: BlogPost }
  | { kind: "bilingual"; slug: string; pt: BlogPost; en: BlogPost };

export function pickPostForLocale(item: BlogIndexItem, locale: "pt" | "en"): BlogPost {
  if (item.kind === "single") return item.post;
  return locale === "en" ? item.en : item.pt;
}
