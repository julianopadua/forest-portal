// src/components/layout/Footer.tsx

"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { dict } = useI18n();

  const missionId = dict.marketing.sections.mission.id;
  const contentsId = dict.marketing.sections.contents.id;
  const communityId = dict.marketing.sections.community.id;

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[color:var(--muted)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-[color:var(--foreground)]">
              {dict.footer.brand}
            </div>
            <div className="text-xs">{dict.footer.tagline}</div>
          </div>

          <div className="flex gap-4 text-xs">
            <a className="hover:text-[color:var(--foreground)]" href={`/#${missionId}`}>
              {dict.footer.links.mission}
            </a>
            <a className="hover:text-[color:var(--foreground)]" href={`/#${contentsId}`}>
              {dict.footer.links.contents}
            </a>
            <a className="hover:text-[color:var(--foreground)]" href={`/#${communityId}`}>
              {dict.footer.links.community}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
