import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Locale } from "@/i18n/dictionaries";
import type { DocSource } from "@/lib/docs/types";
import bundledDocs from "./docs.generated.json";

export type { DocSource } from "@/lib/docs/types";

const DOCS_DIR = join(process.cwd(), "content/docs");

type DocsBundleEntry = { pt: string; en: string };
type DocsBundle = Record<string, DocsBundleEntry>;

const DOCS_BUNDLE = bundledDocs as DocsBundle;

async function readFilesystemMarkdown(slug: string, locale: Locale): Promise<string> {
  const filename = `${slug}.${locale}.md`;
  return readFile(join(DOCS_DIR, filename), "utf-8");
}

function readBundledMarkdown(slug: string, locale: Locale): string {
  const entry = DOCS_BUNDLE[slug];
  if (!entry) {
    throw new Error(`doc ausente no bundle de build: ${slug}`);
  }
  const markdown = entry[locale];
  if (!markdown) {
    throw new Error(`doc sem locale ${locale} no bundle: ${slug}`);
  }
  return markdown;
}

async function loadMarkdown(slug: string, locale: Locale): Promise<string> {
  try {
    return await readFilesystemMarkdown(slug, locale);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return readBundledMarkdown(slug, locale);
    }
    throw error;
  }
}

export async function loadDoc(slug: string, locale: Locale): Promise<DocSource> {
  const filename = `${slug}.${locale}.md`;
  const markdown = await loadMarkdown(slug, locale);
  return {
    slug,
    locale,
    markdown,
    publicMarkdownPath: `/docs/source/${filename}`,
  };
}
