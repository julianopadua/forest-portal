import BlogIndexTile from "@/components/blog/BlogIndexTile";
import { getAllPosts } from "@/lib/blog/loadPost";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-3 py-10 sm:px-4">
      <header className="w-full border-b border-[color:var(--border)] pb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">
          Publicações / Blog
        </p>

        <h1 className="mt-3 w-full text-3xl font-black tracking-tight text-[color:var(--foreground)] md:text-5xl">
          Notas do fundador
        </h1>

        <div className="mt-6 w-full space-y-4 text-base leading-relaxed text-[color:var(--muted)]">
          <p>
            Este espaço reúne textos explicativos, ideias sobre dados abertos, automação, meio ambiente e o método por
            trás do Forest Portal.
          </p>
        </div>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        {posts.map((post, index) => (
          <BlogIndexTile
            key={post.slug}
            href={`/blog/${post.slug}`}
            categoryTitle="Blog"
            authorLine={post.frontmatter.author}
            title={post.frontmatter.title}
            excerpt={post.frontmatter.excerpt}
            heroImageSrc={post.frontmatter.cardImage}
            publishedAt={post.frontmatter.publishedAt}
            tags={post.frontmatter.tags}
            priorityImage={index === 0}
          />
        ))}
      </section>
    </main>
  );
}
