# AGENTS.md — forest-portal

## Purpose

Next.js 16 App Router web portal for Instituto Forest. Provides institutional pages, a filterable open-data catalog, interactive analytical reports, a blog, and user authentication. All dynamic data (datasets, reports) is fetched from Supabase Storage via `manifest.json` files written by `forest-open-data-pipelines`. The portal is a pure consumer — it never writes to Storage.

---

## Architecture

```
Browser Request
    │
    ▼
Next.js Edge Middleware          ← Supabase session renewal on every request
    │
    ▼
Server Component                 ← fetch manifest / catalog from Supabase Storage
    │                               (revalidate: 3600 — hourly cache)
    ▼
Client Component                 ← interactive filters, auth state, animations
    │
    ├── Supabase Auth            ← session management (SSR + browser client)
    └── Supabase Postgres        ← user profiles (RLS-governed)
```

**Data flow**: Supabase Storage is read-only from the portal's perspective. No portal code writes to Storage.

---

## Manifest-Driven Data Architecture

The portal renders datasets and reports generically from manifests. It never hardcodes file lists, catalog arrays, or data content.

**How it works**:
1. The **catalog envelope** is fetched from Supabase Storage (`catalog/open_data_catalog.json`, `catalog/reports_catalog.json`). It lists what's available.
2. The dynamic route (`/reports/[report]`, `/open-data/[source]/[dataset]`) fetches the item's `manifest.json` from Storage.
3. Components render based on manifest structure — no per-dataset rendering logic.

Catalog fetching lives in `src/lib/openData/catalog.ts` (`getOpenDataCatalog`, `getOpenDataDatasets`) and `src/lib/reports/catalog.ts` (`getReportsCatalog`, `getReportBySlug`). Both use the shared `fetchJsonFromStorage` helper in `src/lib/storageFetch.ts`, which falls back to `public/<path>` for offline dev.

**Catalog fetching is Server-Component only.** To make the catalog available to Client Components, pages fetch it in their async `page.tsx` and pass it down as a prop (see `src/app/open-data/page.tsx` → `OpenDataPageClient` → `OpenDataCatalog`).

**Adding a new dataset or report to the portal**: do not edit portal source. Add the entry to `forest-open-data-pipelines/configs/catalog/open_data.yml` (or `reports.yml`), then run `forest-pipelines publish-catalog`. The portal picks it up on the next catalog fetch (≤ 1h due to revalidation).

**New section types for reports**: add section-type components in `src/components/reports/` only when a report introduces a section kind not yet supported.

---

## Data Fetching Patterns

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Server Component + `fetch()` | Page-level catalog data, manifests at load time | `reports/page.tsx`, `open-data/page.tsx` |
| `next: { revalidate: 3600 }` | Any Storage fetch (hourly staleness is acceptable) | `fetchReportManifest()` |
| `fetchFromStorageOrLocal()` | All Supabase Storage reads | Used in `src/lib/reports/fetch.ts` |
| Server Action (`"use server"`) | User-initiated mutations | `src/app/actions/profile.ts` |
| API Route (`/api/auth/*`) | Auth flows requiring cookie management | Login, signup |
| `useSupabaseUser()` hook | Client-side auth state display only | Header avatar, gated UI |

Never fetch Supabase Storage URLs directly from Client Components. Always go through the helpers in `src/lib/reports/fetch.ts` or `src/lib/openData/publicUrls.ts`.

---

## Supabase Client Usage — Strict Rules

Violating these rules can expose the service role key to the browser.

| Context | Client to use | Key used |
|---------|--------------|----------|
| Server Components, `generateStaticParams`, `generateMetadata` | `createServerClient()` (`src/lib/supabase/server.ts`) | anon key (cookie-based session) |
| API Routes, Server Actions | `createServerClient()` or `createAdminClient()` | anon or service role |
| Client Components (`"use client"`) | `createBrowserClient()` (`src/lib/supabase/client.ts`) | anon key only |
| Admin operations (user lookup by service role) | `createAdminClient()` (`src/lib/supabase/admin.ts`) | service role — **API routes only, never client-side** |

The admin client must never be imported in any file that has `"use client"` or is in the component tree of a Client Component.

---

## Component Conventions

**Server vs Client**:
- Default to Server Components. Add `"use client"` only when the component needs browser APIs (`window`, `document`), event handlers, or React hooks (`useState`, `useEffect`).
- Keep the `"use client"` boundary as low in the tree as possible.

**File structure**:
- `src/components/<domain>/` — domain matches the route (e.g., `reports/`, `open-data/`, `blog/`, `auth/`).
- `src/components/ui/` — primitive, domain-agnostic components (Button, Modal, LanguageSwitcher).
- `src/components/layout/` — Header, Footer, SidebarSheet.

**Styling**:
- Tailwind CSS utility classes only. No CSS modules. No inline `style` objects for design values.
- Design tokens are CSS custom properties defined in `src/app/globals.css` (prefix `--fp-*`). Always use tokens for colors, spacing, and font sizes — never hardcode values.
- Dark/light mode: CSS classes `theme-light` / `theme-dark` on `<html>`. Do not use `prefers-color-scheme` media queries in component code.
- Font scaling: `--fp-font-scale` CSS variable (5 levels, managed by I18nProvider). Never set `font-size` directly on text elements.

**React Compiler is enabled**: do not add `useMemo`, `useCallback`, or `React.memo` manually. The compiler handles memoization. Add them only if profiling shows a specific regression.

---

## Routing

- App Router only. No `pages/` directory.
- Route groups use `(groupName)/` convention for layout sharing without URL segments.
- Dynamic routes derive slugs from their catalog at build time via `generateStaticParams()`.
- For server-side redirects, use `redirect()` from `next/navigation`. Never use `router.push()` in server code.
- Middleware at `src/middleware.ts` runs on every request. Keep it minimal — only session renewal logic belongs there.

---

## Authentication

- Auth is Supabase-based with username + email support.
- The `useSupabaseUser()` hook (`src/hooks/useSupabaseUser.ts`) is the only way to read auth state in Client Components. It uses `onAuthStateChange` internally.
- Login and signup go through API routes (`/api/auth/login`, `/api/auth/signup`). Do not call `supabase.auth.signIn()` directly from Client Components.
- OAuth callback is handled at `/auth/callback`.
- Session is refreshed by middleware on every request — do not add redundant session refresh calls in components.

---

## Internationalization

- Two locales: `pt` (primary) and `en`.
- Translations live in `src/i18n/dictionaries.ts` as a typed object. Both locales must always be in sync.
- Locale is stored in `localStorage` and managed by `I18nProvider`. There are no URL-based locale prefixes.
- When adding a new UI string: add the key to both `pt` and `en` entries simultaneously.
- Locale-dependent content (report titles, dataset descriptions) is resolved at runtime from the manifest's localized fields.

---

## Content Management

| Content Type | Location | How to Add |
|-------------|----------|-----------|
| Blog post | `content/blog/<slug>.md` | Create Markdown file with frontmatter; add slug to `BLOG_POST_SLUGS` in `src/lib/blog/catalog.ts` |
| Report (catalog + data) | backend: `configs/catalog/reports.yml` + pipeline runner | Edit backend YAML → `forest-pipelines publish-catalog` → `forest-pipelines build-report <id>` |
| Dataset (catalog + manifest) | backend: `configs/catalog/open_data.yml` + dataset runner | Edit backend YAML → `forest-pipelines publish-catalog` → `forest-pipelines sync <id>` |
| Translation | `src/i18n/dictionaries.ts` | Add key to both `pt` and `en` |

**Blog post frontmatter requirements**:
```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
author: "Author Name"
excerpt: "One-sentence summary shown in listings."
---
```

---

## Type Safety

- Strict TypeScript throughout (`"strict": true`). Never use `any`. Use `unknown` and narrow with guards if the type is genuinely unknown.
- **Auto-generated files — do not edit by hand**:
  - `src/lib/database.types.ts` — regenerate with `npx supabase gen types typescript` after Postgres schema changes.
- **Catalog data is not in source**: `OPEN_DATA_DATASETS` / `REPORTS_CATALOG` arrays no longer exist. Both catalogs are fetched from Storage envelopes published by the pipeline's `publish-catalog` command. The legacy `src/lib/openData/anpDatasets.generated.ts` and `scripts/generate-anp-catalog.mjs` are deprecated and unused — ANP categorization now lives in the pipeline (`forest-open-data-pipelines/src/forest_pipelines/catalog/anp_placement.py`).
- Manifest and catalog types are in `src/lib/reports/types.ts` and `src/lib/openData/types.ts`. Update these when the pipeline manifest schema changes (always in sync with backend envelope changes, bumping `schema_version` if the change is breaking).

---

## Testing and Verification

No automated test suite exists. Before marking any task complete, manually verify:

- [ ] `npx tsc --noEmit` — zero TypeScript errors.
- [ ] `npm run lint` — zero ESLint errors.
- [ ] `npm run dev` — dev server starts without errors.
- [ ] Changed route renders correctly in the browser (golden path).
- [ ] Changed route renders correctly in both PT and EN locales.
- [ ] Changed route renders correctly in both light and dark themes.
- [ ] No regressions on adjacent routes (check routes that share layout or components).
- [ ] `next/image` used for all images (no bare `<img>` tags).
- [ ] Auto-generated files were regenerated if the relevant source changed.

---

## Security

| Concern | Rule |
|---------|------|
| Anon key in browser | Safe — Supabase RLS governs all access. It is intentionally public. |
| Service role key | Never in browser code. Only in API routes via `src/lib/supabase/admin.ts`. Set in `.env.local` and hosting env vars only. |
| URL params and form input | Validate server-side before using in queries or Storage path construction. Never trust client-supplied paths. |
| External resources | When adding new external domains (fonts, images, scripts), update CSP headers in `next.config.ts`. |
| Auth validation | Always validate session server-side in Server Components and API routes. Client-side auth state is for display only — it is not a security boundary. |
| Supabase Storage paths | Construct paths using `publicUrls.ts` helpers. Never accept user input as a Storage path segment without sanitization. |

---

## Performance Guidelines

- Use `next/image` for all images. Set explicit `width` and `height`. Use `priority` only for LCP images (hero).
- Videos: set `preload="none"` unless the video is above the fold and plays immediately.
- Large JSON files (`anp_catalog_compact.json`): read server-side only. Never import in Client Components or bundle them.
- Storage fetches: always use `{ next: { revalidate: 3600 } }`. Shorter revalidation periods are not needed given pipeline update frequency.
- Do not add `useMemo` / `useCallback` without a profiling baseline. The React Compiler already handles this.

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Admin client in a Client Component | Service role key exposed to browser | Use browser client in `"use client"` files; admin client only in API routes |
| Hardcoding dataset file names | Portal breaks when pipeline renames files | Read file lists from the manifest `items` array |
| Adding a locale key to only one language | Missing text in the other locale | Always update both `pt` and `en` simultaneously |
| `router.push()` in Server Component | Runtime error (hook not available) | Use `redirect()` from `next/navigation` |
| Bare `<img>` tags | Missing Next.js image optimization | Always use `next/image` |
| Editing auto-generated files | Changes are overwritten on next generation | Edit the source (YAML/JSON) and regenerate |
| Direct Storage URL construction | URL format drift, broken links | Use `publicUrls.ts` helpers or `fetchFromStorageOrLocal()` |
| Importing server-only modules in Client Components | Build error or accidental secret exposure | Check import path; never import from `src/lib/supabase/admin.ts` in client code |

---

## Project Scripts

```bash
npm run dev                   # Start development server (localhost:3000)
npm run build                 # Production build
npm run lint                  # ESLint
npm run generate:anp-catalog  # Regenerate anpDatasets.generated.ts from anp_catalog_compact.json
npx tsc --noEmit              # Type check without emit
npx supabase gen types typescript > src/lib/database.types.ts  # Regenerate DB types
```
