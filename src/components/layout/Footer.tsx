// src/components/layout/Footer.tsx

"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { dict } = useI18n();

  const dataId = dict.marketing.sections.mission.id;
  const marketsId = dict.marketing.sections.programs.id;
  const reportsId = dict.marketing.sections.contents.id;
  const educationId = dict.marketing.sections.community.id;

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[color:var(--muted)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-[color:var(--foreground)]">{dict.footer.brand}</div>
            <div className="text-xs">{dict.footer.tagline}</div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <a className="hover:text-[color:var(--foreground)]" href={`/#${dataId}`}>
              {dict.footer.links.data}
            </a>
            <a className="hover:text-[color:var(--foreground)]" href={`/#${marketsId}`}>
              {dict.footer.links.markets}
            </a>
            <a className="hover:text-[color:var(--foreground)]" href={`/#${reportsId}`}>
              {dict.footer.links.reports}
            </a>
            <a className="hover:text-[color:var(--foreground)]" href={`/#${educationId}`}>
              {dict.footer.links.education}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
