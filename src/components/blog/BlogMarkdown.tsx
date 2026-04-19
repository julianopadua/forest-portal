import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  if (src.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- URLs externas sem dimensões conhecidas
      <img src={src} alt={alt ?? ""} className="my-8 h-auto w-full rounded-xl" loading="lazy" />
    );
  }
  return (
    <figure className="my-10">
      <div className="relative h-[min(70vh,520px)] w-full overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 42rem"
        />
      </div>
      {alt ? (
        <figcaption className="mt-3 text-center text-sm text-[color:var(--muted)]">{alt}</figcaption>
      ) : null}
    </figure>
  );
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  if (!href) return <span>{children}</span>;
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[color:var(--primary)] underline decoration-[color:var(--primary)]/35 underline-offset-[3px] transition hover:decoration-[color:var(--primary)]"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="font-medium text-[color:var(--primary)] underline decoration-[color:var(--primary)]/35 underline-offset-[3px] transition hover:decoration-[color:var(--primary)]"
    >
      {children}
    </Link>
  );
}

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none text-[color:var(--foreground)] prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[color:var(--foreground)] prose-h2:mt-12 prose-h2:text-2xl prose-h3:mt-8 prose-p:leading-relaxed prose-p:text-[color:var(--muted)] prose-li:text-[color:var(--muted)] prose-blockquote:border-[color:var(--primary)]/40 prose-blockquote:text-[color:var(--muted)] prose-code:rounded-md prose-code:bg-[color:var(--surface-2)] prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:text-[color:var(--foreground)] prose-pre:bg-[color:var(--surface-2)] prose-pre:border prose-pre:border-[color:var(--border)] prose-hr:border-[color:var(--border)] prose-strong:text-[color:var(--foreground)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} />,
          a: ({ href, children }) => (
            <MarkdownLink href={typeof href === "string" ? href : undefined}>{children}</MarkdownLink>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
