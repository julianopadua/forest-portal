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
      <article className="prose prose-neutral min-w-0 flex-1 py-10 text-[color:var(--foreground)] dark:prose-invert text-justify hyphens-auto max-w-3xl">
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
