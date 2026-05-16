"use client";

import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { slugify } from "@/lib/blog/extractHeadings";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return "";
}

function makeHeading(Tag: "h2" | "h3") {
  const sizeClass = Tag === "h2" ? "text-2xl mt-10" : "text-xl mt-8";
  return function DocsHeading({ children }: { children?: ReactNode }) {
    const id = slugify(extractText(children));
    return (
      <Tag
        id={id}
        className={`scroll-mt-28 font-semibold tracking-tight text-[color:var(--foreground)] ${sizeClass}`}
      >
        {children}
      </Tag>
    );
  };
}

function DocsLink({ href, children }: { href?: string; children?: ReactNode }) {
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

function DocsCode({ children, className }: { children?: ReactNode; className?: string }) {
  if (className && className.startsWith("language-")) {
    return <code className={className}>{children}</code>;
  }
  return (
    <code className="rounded border border-[color:var(--border)] bg-[color:var(--surface-2)] px-1.5 py-0.5 font-mono text-[0.85em] text-[color:var(--foreground)]">
      {children}
    </code>
  );
}

function DocsPre({ children }: { children?: ReactNode }) {
  const node = Children.only(children);
  return (
    <pre className="not-prose my-6 overflow-x-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-xs leading-relaxed text-[color:var(--foreground)]">
      {node}
    </pre>
  );
}

function DocsTable({ children }: { children?: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

function DocsTh({ children }: { children?: ReactNode }) {
  return (
    <th className="border-b border-[color:var(--border)] py-2 pr-4 text-left font-medium text-[color:var(--muted)]">
      {children}
    </th>
  );
}

function DocsTd({ children }: { children?: ReactNode }) {
  return (
    <td className="border-b border-[color:var(--border)]/60 py-2 pr-4 align-top text-[color:var(--foreground)]">
      {children}
    </td>
  );
}

export default function DocsMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h2: makeHeading("h2"),
        h3: makeHeading("h3"),
        a: DocsLink,
        code: DocsCode,
        pre: DocsPre,
        table: DocsTable,
        th: DocsTh,
        td: DocsTd,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
