import type { Locale } from "@/i18n/dictionaries";

export type DocSource = {
  slug: string;
  locale: Locale;
  markdown: string;
  publicMarkdownPath: string;
};
