import type { ReactNode } from "react";

import DocsSidebar, { type DocsNavSection } from "./DocsSidebar";

export default function DocsLayout({
  sections,
  rightRail,
  children,
}: {
  sections: readonly DocsNavSection[];
  rightRail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-6">
      <DocsSidebar sections={sections} />
      <article
        className={[
          "forest-docs-prose prose min-w-0 flex-1 max-w-3xl py-10 text-justify hyphens-auto",
          "text-[color:var(--foreground)]",
          "prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-headings:text-[color:var(--foreground)]",
          "prose-h2:mt-10 prose-h2:text-2xl",
          "prose-h3:mt-8 prose-h3:text-xl",
          "prose-p:leading-relaxed prose-p:text-[color:var(--foreground)]",
          "prose-li:text-[color:var(--foreground)]",
          "prose-strong:text-[color:var(--foreground)]",
          "prose-hr:border-[color:var(--border)]",
        ].join(" ")}
      >
        {children}
      </article>
      {rightRail ? (
        <aside className="hidden w-72 shrink-0 py-10 xl:block">
          <div className="sticky top-28">{rightRail}</div>
        </aside>
      ) : null}
    </div>
  );
}
