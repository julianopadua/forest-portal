import Link from "next/link";

export type DocsNavItem = {
  href: string;
  label: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export default function DocsSidebar({ sections }: { sections: DocsNavSection[] }) {
  return (
    <nav
      aria-label="Documentation"
      className="hidden w-64 shrink-0 border-r border-[color:var(--border)] py-10 pr-6 lg:block"
    >
      <div className="sticky top-28">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              {section.title}
            </h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-sm leading-snug text-[color:var(--foreground)] hover:text-[color:var(--accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
