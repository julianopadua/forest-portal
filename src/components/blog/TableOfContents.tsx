"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog/extractHeadings";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (!headings.length) return;

    const handleScroll = () => {
      const offset = 120;
      const scrollY = window.scrollY + offset;

      let current = headings[0].id;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Sumário do artigo">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">
        Sumário
      </p>
      <ul className="relative space-y-1 pl-3">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[color:var(--border)]"
          aria-hidden="true"
        />
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className={["relative", h.level === 3 ? "pl-3" : ""].join(" ")}>
              {isActive && (
                <div
                  className="pointer-events-none absolute -left-3 inset-y-0 w-0.5 bg-[color:var(--primary)]"
                  aria-hidden="true"
                />
              )}
              <a
                href={`#${h.id}`}
                className={[
                  "block py-1 text-sm leading-snug transition-colors duration-150",
                  isActive
                    ? "font-medium text-[color:var(--primary)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]",
                ].join(" ")}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
