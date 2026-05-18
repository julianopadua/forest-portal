import Image from "next/image";
import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { blogRehypeSanitizeSchema } from "@/lib/blog/blogRehypeSanitizeSchema";
import { slugify } from "@/lib/blog/extractHeadings";

/**
 * Markdown wraps block images in <p>. We replace <img> with <figure> (block content),
 * which must not sit inside <p>. Unwrap when the paragraph only contains that figure.
 */
function MarkdownParagraph({
  children,
  node,
}: {
  children?: ReactNode;
  node?: {
    children?: Array<{ type?: string; tagName?: string }>;
  };
}) {
  const nodes = Children.toArray(children).filter(
    (n) => !(typeof n === "string" && n.trim() === ""),
  );
  const onlyChild = nodes[0];
  const containsOnlyImageNode =
    node?.children?.length === 1 &&
    node.children[0]?.type === "element" &&
    node.children[0]?.tagName === "img";
  const rendersAsImageFigure =
    nodes.length === 1 &&
    isValidElement(onlyChild) &&
    typeof (onlyChild.props as { src?: unknown })?.src === "string";

  if (containsOnlyImageNode || rendersAsImageFigure) {
    return nodes[0];
  }
  return <p>{children}</p>;
}

function splitSrcAndLayout(src: string): { path: string; intrinsicFit: boolean } {
  const intrinsicFit = /#fit\b/.test(src);
  const path = src.replace(/#fit\b/, "").trim();
  return { path, intrinsicFit };
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  const { path, intrinsicFit } = splitSrcAndLayout(src);
  if (path.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- URLs externas sem dimensões conhecidas
      <img src={path} alt={alt ?? ""} className="my-8 h-auto w-full rounded-xl" loading="lazy" />
    );
  }
  if (intrinsicFit) {
    return (
      <figure className="not-prose my-8 w-fit max-w-full border-0 p-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- dimensões intrínsecas; #fit no URL do markdown */}
        <img
          src={path}
          alt={alt ?? ""}
          className="m-0 block h-auto max-h-[min(85vh,900px)] w-auto max-w-full border-0 p-0 object-contain"
          loading="lazy"
        />
        {alt ? (
          <figcaption className="mt-2 text-center text-sm text-[color:var(--muted)]">{alt}</figcaption>
        ) : null}
      </figure>
    );
  }
  return (
    <figure className="my-10">
      <div className="relative h-[min(70vh,520px)] w-full overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)]">
        <Image
          src={path}
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

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return "";
}

function makeHeading(Tag: "h2" | "h3") {
  return function MarkdownHeading({ children }: { children?: ReactNode }) {
    const id = slugify(extractText(children));
    return <Tag id={id}>{children}</Tag>;
  };
}

function BlogTable({ children }: { children?: ReactNode }) {
  return (
    <div className="not-prose my-6 -mx-1 overflow-x-auto px-1 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[32rem] border-collapse text-sm">{children}</table>
    </div>
  );
}

function BlogTh({ children }: { children?: ReactNode }) {
  return (
    <th className="border-b border-[color:var(--border)] py-2 pr-4 text-left font-medium text-[color:var(--muted)]">
      {children}
    </th>
  );
}

function BlogTd({ children }: { children?: ReactNode }) {
  return (
    <td className="border-b border-[color:var(--border)]/60 py-2 pr-4 align-top text-[color:var(--foreground)]">
      {children}
    </td>
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
    <motion>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, blogRehypeSanitizeSchema]]}
        components={{
          p: MarkdownParagraph,
          h2: makeHeading("h2"),
          h3: makeHeading("h3"),
          table: BlogTable,
          th: BlogTh,
          td: BlogTd,
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
