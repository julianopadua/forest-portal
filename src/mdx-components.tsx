import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
      <p className="mb-4 last:mb-0 leading-relaxed text-[color:var(--muted)]" {...props}>
        {children}
      </p>
    ),
    a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
      <a
        href={href}
        className="font-medium text-[color:var(--accent)] underline decoration-[color:var(--accent)]/35 underline-offset-4 transition-colors hover:text-[color:var(--accent-hover)] hover:decoration-[color:var(--accent-hover)]/50"
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-[color:var(--muted)] last:mb-0" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5 text-[color:var(--muted)] last:mb-0" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-[color:var(--foreground)]" {...props}>
        {children}
      </strong>
    ),
  };
}
