import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Locale } from "@/i18n/dictionaries";

const DOCS_DIR = join(process.cwd(), "content/docs");

export type DocSource = {
  slug: string;
  locale: Locale;
  markdown: string;
  publicMarkdownPath: string;
};

export async function loadDoc(slug: string, locale: Locale): Promise<DocSource> {
  const filename = `${slug}.${locale}.md`;
  const fullPath = join(DOCS_DIR, filename);
  const markdown = await readFile(fullPath, "utf-8");
  return {
    slug,
    locale,
    markdown,
    publicMarkdownPath: `/docs/source/${filename}`,
  };
}
