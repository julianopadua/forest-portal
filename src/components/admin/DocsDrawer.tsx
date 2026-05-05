// src/components/admin/DocsDrawer.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ADMIN_DOCS_MARKDOWN } from "@/lib/admin/docs";

export default function DocsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[85]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-[96vw] max-w-2xl overflow-y-auto border-l border-[color:var(--border)] bg-[color:var(--surface)] p-6 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <div className="mb-4 flex items-center justify-between border-b border-[color:var(--border)] pb-3">
          <h2 className="text-lg font-semibold">Docs</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 text-sm hover:bg-[color:var(--surface-3)]"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <article className="prose prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-2 prose-p:my-2 prose-li:my-0.5 prose-a:text-sky-400 hover:prose-a:text-sky-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...rest }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                  {children}
                </a>
              ),
            }}
          >
            {ADMIN_DOCS_MARKDOWN}
          </ReactMarkdown>
        </article>
      </aside>
    </div>
  );
}
