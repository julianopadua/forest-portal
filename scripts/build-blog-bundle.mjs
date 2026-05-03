#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalogPath = join(root, "src/lib/blog/catalog.ts");
const outPath = join(root, "src/lib/blog/posts.generated.json");

function parseBlogSlugs(catalogSrc) {
  const marker = "export const BLOG_POST_SLUGS = [";
  const start = catalogSrc.indexOf(marker);
  if (start === -1) {
    throw new Error(`marcador ${marker} nao encontrado em catalog.ts`);
  }
  const rest = catalogSrc.slice(start + marker.length);
  const end = rest.indexOf("] as const");
  if (end === -1) {
    throw new Error("fim do array BLOG_POST_SLUGS (] as const) nao encontrado");
  }
  const body = rest.slice(0, end);
  const slugs = [...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (slugs.length === 0) {
    throw new Error("nenhum slug encontrado em BLOG_POST_SLUGS");
  }
  return slugs;
}

const catalogSrc = readFileSync(catalogPath, "utf8");
const slugs = parseBlogSlugs(catalogSrc);
const bundle = {};

for (const slug of slugs) {
  const mdPath = join(root, "content/blog", `${slug}.md`);
  if (!existsSync(mdPath)) {
    throw new Error(`markdown ausente para slug catalogado: ${slug} (${mdPath})`);
  }
  bundle[slug] = readFileSync(mdPath, "utf8");
}

writeFileSync(outPath, `${JSON.stringify(bundle)}\n`, "utf8");
console.log(`build-blog-bundle: ${slugs.length} post(s) -> ${outPath}`);
