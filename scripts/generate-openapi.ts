// Generates public/api/v1/openapi.json from the Zod schemas in
// src/lib/api/v1/. Runs at prebuild so the static spec served by
// /api/v1/openapi.json is always in sync with the route handlers.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildOpenApiDocument } from "../src/lib/api/v1/openapi";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

const doc = buildOpenApiDocument();
const outDir = join(repoRoot, "public/api/v1");
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "openapi.json"), JSON.stringify(doc, null, 2));
console.log("[openapi] wrote public/api/v1/openapi.json");
