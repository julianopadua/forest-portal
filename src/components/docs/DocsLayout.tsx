import type { ReactNode } from "react";

import DocsSidebar, { type DocsNavSection } from "./DocsSidebar";

export default function DocsLayout({
  sections,
  children,
}: {
  sections: DocsNavSection[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-6">
      <DocsSidebar sections={sections} />
      <article className="prose prose-neutral min-w-0 flex-1 py-10 text-[color:var(--foreground)] dark:prose-invert max-w-3xl">
        {children}
      </article>
    </div>
  );
}
