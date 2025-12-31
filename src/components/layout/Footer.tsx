// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { dict } = useI18n();

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[color:var(--muted)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-[color:var(--text)]">{dict.footer.brand}</div>
            <div className="text-xs">{dict.footer.tagline}</div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <Link className="hover:text-[color:var(--text)]" href="/">
              {dict.footer.links.home}
            </Link>
            <Link className="hover:text-[color:var(--text)]" href="/open-data">
              {dict.footer.links.openData}
            </Link>
            <Link className="hover:text-[color:var(--text)]" href="/commodities">
              {dict.footer.links.commodities}
            </Link>
            <Link className="hover:text-[color:var(--text)]" href="/reports">
              {dict.footer.links.reports}
            </Link>
            <Link className="hover:text-[color:var(--text)]" href="/education">
              {dict.footer.links.education}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
