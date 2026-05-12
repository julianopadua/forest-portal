#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const blogDir = join(root, "content/blog");
const outPath = join(root, "src/lib/blog/posts.generated.json");

const files = readdirSync(blogDir)
  .filter((name) => name.endsWith(".mdx") && !name.includes(".draft."))
  .sort();

const bundle = {};

for (const fileName of files) {
  const slug = fileName.endsWith(".en.mdx") ? fileName.slice(0, -".en.mdx".length) : fileName.slice(0, -".mdx".length);
  const raw = readFileSync(join(blogDir, fileName), "utf8");

  if (fileName.endsWith(".en.mdx")) {
    const current = bundle[slug];
    if (typeof current === "string") {
      bundle[slug] = { bilingual: true, pt: current, en: raw };
    } else if (current && typeof current === "object") {
      bundle[slug] = { ...current, bilingual: true, en: raw };
    } else {
      bundle[slug] = { bilingual: true, pt: "", en: raw };
    }
    continue;
  }

  const current = bundle[slug];
  if (current && typeof current === "object") {
    bundle[slug] = { bilingual: true, pt: raw, en: current.en ?? "" };
  } else {
    bundle[slug] = raw;
  }
}

for (const [slug, entry] of Object.entries(bundle)) {
  if (typeof entry === "object" && entry !== null && "bilingual" in entry && !entry.pt) {
    throw new Error(`post bilingue sem variante PT: ${slug}`);
  }
}

writeFileSync(outPath, `${JSON.stringify(bundle)}\n`, "utf8");
console.log(`build-blog-bundle: ${Object.keys(bundle).length} post(s) -> ${outPath}`);
