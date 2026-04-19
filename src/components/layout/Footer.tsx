// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { dict } = useI18n();

  return (
    <footer className="relative z-10 border-t border-[color:var(--border)] bg-[color:var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[color:var(--muted)]">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-semibold text-[color:var(--text)]">{dict.footer.brand}</div>
            <div className="text-xs">{dict.footer.tagline}</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-[color:var(--text)]">{dict.footer.quickLinks}</div>
            <div className="flex flex-col gap-1">
              <Link className="hover:text-[color:var(--text)]" href="/">
                {dict.footer.links.home}
              </Link>
              <Link className="hover:text-[color:var(--text)]" href="/blog">
                {dict.footer.links.blog}
              </Link>
              <Link className="hover:text-[color:var(--text)]" href="/quem-somos">
                {dict.footer.links.aboutUs}
              </Link>
              <Link className="hover:text-[color:var(--text)]" href="/open-data">
                {dict.footer.links.openData}
              </Link>
              <Link className="hover:text-[color:var(--text)]" href="/reports">
                {dict.footer.links.reports}
              </Link>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-[color:var(--text)]">{dict.footer.contact}</div>
            <a className="hover:text-[color:var(--text)]" href={`mailto:${dict.footer.email}`}>
              {dict.footer.email}
            </a>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-[color:var(--text)]">{dict.footer.social}</div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label={dict.footer.socialLinks.instagram}
                className="inline-flex items-center gap-1 hover:text-[color:var(--text)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
                {dict.footer.socialLinks.instagram}
              </a>
              <a
                href="#"
                aria-label={dict.footer.socialLinks.linkedin}
                className="inline-flex items-center gap-1 hover:text-[color:var(--text)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M8 10v7" />
                  <path d="M8 7h.01" />
                  <path d="M12 17v-4a2 2 0 1 1 4 0v4" />
                  <path d="M12 10v7" />
                </svg>
                {dict.footer.socialLinks.linkedin}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
