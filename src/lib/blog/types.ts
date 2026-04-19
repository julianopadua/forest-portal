export type BlogPostFrontmatter = {
  title: string;
  subtitle: string;
  excerpt: string;
  /** ISO date string */
  publishedAt: string;
  author: string;
  tags: string[];
  /** Imagem do card na listagem /blog — em geral igual a mainImage */
  cardImage: string;
  /** Imagem principal entre cabeçalho e corpo */
  mainImage: string;
  mainImageCaption?: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
};
