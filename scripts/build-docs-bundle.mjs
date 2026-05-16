#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const docsDir = join(root, "content/docs");
const outPath = join(root, "src/lib/docs/docs.generated.json");

const files = readdirSync(docsDir)
  .filter((name) => name.endsWith(".md"))
  .sort();

const bundle = {};

for (const fileName of files) {
  const match = fileName.match(/^(.+)\.(pt|en)\.md$/);
  if (!match) {
    throw new Error(`nome de arquivo de doc invalido (esperado slug.pt.md ou slug.en.md): ${fileName}`);
  }

  const [, slug, locale] = match;
  const raw = readFileSync(join(docsDir, fileName), "utf8");
  const current = bundle[slug] ?? {};
  current[locale] = raw;
  bundle[slug] = current;
}

for (const [slug, entry] of Object.entries(bundle)) {
  if (!entry.pt || !entry.en) {
    throw new Error(`doc incompleto (exige pt e en): ${slug}`);
  }
}

writeFileSync(outPath, `${JSON.stringify(bundle)}\n`, "utf8");
console.log(`build-docs-bundle: ${Object.keys(bundle).length} doc(s) -> ${outPath}`);
