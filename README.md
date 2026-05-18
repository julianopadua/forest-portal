# Instituto Forest Portal

Official repository of the Instituto Forest web portal. The system unifies the institutional presence, the open-data catalog, the public read-only HTTP API at `/api/v1`, interactive analytical reports, a Markdown-driven blog, public documentation, and authenticated user flows, on top of Next.js 16 (App Router), TypeScript 5 and Supabase.

> **Reading the portal docs vs. consuming the data**: if you only want to **use** Forest open data, you do not need this repository — install the official Python SDK [`forest-data`](https://pypi.org/project/forest-data/) or call the public HTTP API at <https://institutoforest.org/api/v1>. This repository is for portal contributors.

## Table of contents

- [Goals](#goals)
- [System overview](#system-overview)
- [Tech stack](#tech-stack)
- [Architecture and main flows](#architecture-and-main-flows)
- [Public HTTP API (`/api/v1`)](#public-http-api-apiv1)
- [Routes and modules](#routes-and-modules)
- [Internationalization](#internationalization)
- [Landing page and institutional page](#landing-page-and-institutional-page)
- [Themes and UI tokens](#themes-and-ui-tokens)
- [Open data](#open-data)
- [Analytical reports](#analytical-reports)
- [Blog and documentation](#blog-and-documentation)
- [Repository layout](#repository-layout)
- [Code documentation](#code-documentation)
- [Environment variables](#environment-variables)
- [Local development](#local-development)
- [Build and production](#build-and-production)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing and license](#contributing-and-license)

## Goals

The portal offers a unified experience for:

- Education and applied content (dedicated routes for education and exploration).
- Community and engagement (anchors on the landing page and entry routes).
- Open-data distribution (catalog, metadata and downloads aligned with Supabase Storage, plus a public REST API and a Python SDK).
- An authenticated area (profile, session and server actions for updating user data).
- Public technical documentation under `/docs` (including the API reference).
- A Markdown-driven blog with bilingual support.

## System overview

The application is a frontend monolith decoupled from data extraction and transformation jobs. Next.js delivers pages and lightweight API routes; Supabase provides authentication, the relational database and object storage for public files. Middleware refreshes session cookies on every matched request, keeping the client and server in sync. UI components follow centralized CSS tokens and a responsive pattern with a fixed primary navigation and a side menu on narrow viewports.

All dynamic data (datasets, reports, catalogs) is fetched from Supabase Storage via `manifest.json` files written by the sibling repository [`forest-open-data-pipelines`](https://github.com/julianopadua/forest-open-data-pipelines). The portal is a pure consumer of Storage — it never writes to it.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, edge runtime for `/api/v1`) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 (`@import "tailwindcss"` in `globals.css`) |
| Authentication and managed backend | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Schemas and OpenAPI | Zod 4, `@asteasolutions/zod-to-openapi` |
| Content | MDX (`@next/mdx`), `gray-matter`, `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize` |
| React compilation | React Compiler enabled in `next.config.ts` |
| Hosting | Cloudflare via `@opennextjs/cloudflare` (`npm run preview` / `deploy`) |
| Runtime (local) | Node.js (current LTS), npm |

Build configuration: see [doc/src/next.config/next.config.md](doc/src/next.config/next.config.md).

## Architecture and main flows

1. **HTTP request**: `src/middleware.ts` delegates to the [Supabase session refresher](doc/src/src/lib/supabase/middleware/middleware.md) before serving applicable routes.
2. **Rendering**: the [root layout](doc/src/src/app/layout/layout.md) applies fonts, the i18n provider, header and footer; routed content fills the main area.
3. **Authentication**: API routes [login](doc/src/src/app/api/auth/login/route/route.md) and [signup](doc/src/src/app/api/auth/signup/route/route.md) use the appropriate client; the [OAuth callback](doc/src/src/app/auth/callback/route/route.md) exchanges the code for a session and redirects with validation of the internal `next` parameter.
4. **User data**: [server actions for the profile](doc/src/src/app/actions/profile/profile.md) update tables such as `profiles` with cache revalidation.
5. **Open data**: the catalog and public URLs derive from envelopes published by the pipeline; see the libraries in [catalog](doc/src/src/lib/openData/catalog/catalog.md) and [publicUrls](doc/src/src/lib/openData/publicUrls/publicUrls.md).
6. **Public API**: routes under `src/app/api/v1/` expose the same data the UI reads, through the exact same helpers — see [Public HTTP API](#public-http-api-apiv1).

Edge middleware documentation: [doc/src/src/middleware/middleware.md](doc/src/src/middleware/middleware.md).

## Public HTTP API (`/api/v1`)

The portal exposes a public, read-only REST API rooted at `https://institutoforest.org/api/v1`. The same `getOpenDataCatalog`, `getReportsCatalog`, `fetchOpenDataManifest` and `fetchReportManifest` helpers used by the UI back the API — both surfaces read the exact same data through the exact same path. Dataset payload bytes are never served by the portal; each item's `source_url` points to the official source.

| Route | Returns |
|------|---------|
| `GET /api/v1/health` | Service and schema version probe |
| `GET /api/v1/catalog` | Compact dataset list |
| `GET /api/v1/catalog/reports` | Compact report list |
| `GET /api/v1/datasets/{id}` | Full dataset manifest (id or slug) |
| `GET /api/v1/datasets/{id}/items` | Items array only |
| `GET /api/v1/reports/{id}` | Full report manifest |
| `GET /api/v1/sources` | Source agencies and counts |
| `GET /api/v1/openapi.json` | OpenAPI 3.1 spec (generated at build time) |

Conventions enforced by `src/lib/api/v1/`:

- Single response envelope: `schema_version`, `api_version`, `generated_at`, `generation_status`, `warnings[]`, plus the payload key.
- Errors: RFC 7807 `application/problem+json` via `errors.ts` (`not_found`, `bad_request`, `upstream_unavailable`, `internal_error`).
- Caching: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`, weak ETag from `generated_at` + count, supports `If-None-Match`.
- CORS: `*` (public open data). `OPTIONS` handler on every route.
- Edge runtime (`export const runtime = "edge"`).
- Zod schemas in `src/lib/api/v1/schemas.ts`; the OpenAPI spec is regenerated by `npm run api:openapi` (runs at `prebuild`).

The official Python SDK [`forest-data`](https://pypi.org/project/forest-data/) wraps these endpoints; the human-readable reference page lives at [`/docs/api/v1`](https://institutoforest.org/docs/api/v1).

## Routes and modules

Each primary route has a technical note in `doc/` when indexed in [doc/INDEX.md](doc/INDEX.md).

| Route | Description | Documentation |
|------|-----------|--------------|
| `/` | MDX-driven institutional landing (`content/home/{en-US,pt-BR}.mdx`) with the Cerrado hero and animated logo | [page.md (marketing)](doc/src/src/app/(marketing)/page/page.md) |
| `/explore` | Content discovery | [explore/page.md](doc/src/src/app/explore/page/page.md) |
| `/join` | Sign-up and authentication entry | [join/page.md](doc/src/src/app/join/page/page.md) |
| `/education` | Education | [education/page.md](doc/src/src/app/education/page/page.md) |
| `/commodities` | Commodities | [commodities/page.md](doc/src/src/app/commodities/page/page.md) |
| `/quem-somos` | "About us" (bilingual MDX) | (see `src/app/quem-somos/page.tsx`) |
| `/open-data` | Open-data catalog | [open-data/page.md](doc/src/src/app/open-data/page/page.md) |
| `/open-data/[source]/[dataset]` | Dataset detail | [dataset page.md](doc/src/src/app/open-data/[source]/[dataset]/page/page.md) |
| `/reports` | Report listing | [reports/page.md](doc/src/src/app/reports/page/page.md) |
| `/reports/[report]` | Dynamic report (manifest JSON, sections) | `src/app/reports/[report]/page.tsx` |
| `/blog` and `/blog/[slug]` | Markdown blog with bilingual support | `src/app/blog/` |
| `/docs` and `/docs/api/v1` | Public technical docs, including the API reference | `src/app/docs/` |
| `/api/v1/*` | Public read-only HTTP API | see [Public HTTP API](#public-http-api-apiv1) |
| `/api/auth/*`, `/api/suggest-dataset` | Write-side routes (auth, suggestion form) | `src/app/api/` |
| `/admin` | Internal admin area (gated) | `src/app/admin/` |
| `/settings` | Settings and profile | [settings/page.md](doc/src/src/app/settings/page/page.md) |

The landing navigation uses anchors (e.g., `#missao`, `#programas`). The [Header](doc/src/src/components/layout/Header/Header.md) concentrates theme, language, authentication and responsive links; the [SidebarSheet](doc/src/src/components/layout/SidebarSheet/SidebarSheet.md) drives the menu on narrow screens.

## Internationalization

UI strings are organized via [I18nProvider](doc/src/src/i18n/I18nProvider/I18nProvider.md) and [dictionaries](doc/src/src/i18n/dictionaries/dictionaries.md). Two locales are supported: `pt` (primary) and `en`. Locale is persisted in `localStorage` (no URL prefix). Every new key must land in both `pt` and `en` simultaneously. The [LanguageSwitcher](doc/src/src/components/ui/LanguageSwitcher/LanguageSwitcher.md) toggles the active locale.

## Landing page and institutional page

The root route (`/`) and `/quem-somos` share the same visual pattern and authoring model: both load an MDX file per locale and render it with the components in `src/components/about/`. Content can be reviewed as plain text without reopening React pages.

**Content files**:

```txt
content/home/en-US.mdx          Landing (English)
content/home/pt-BR.mdx          Landing (Portuguese)
content/about/en-US.mdx         About us (English)
content/about/pt-BR.mdx         About us (Portuguese)
```

The active locale is resolved via `useI18n()` in `src/app/(marketing)/page.tsx` and `src/app/quem-somos/page.tsx`.

**Reusable components** (in `src/components/about/`):

| Component | Use |
|------------|-----|
| `AboutHero` | Full-screen hero with a background image, gradient to `--background`, title and subtitle. The landing uses `public/images/landingpage/cerrado.png`. |
| `AboutSection` | Text block with optional title, variants `contentWidth="default"` and `wide`, supporting one or two side images. |
| `AboutDivider` | Subtle gradient horizontal divider. |
| `AboutQuote` | Highlighted pull quote. |
| `AboutPersonInline` | Photo + bio for the inspirations section. |
| `AboutSpinningLogo` | Spinning logo with the "INSTITUTO" wordmark and a cyclic typewriter word below (see below). |

### Animated landing logo (`AboutSpinningLogo`)

The component combines three animations:

1. **Continuous rotation** of the logo (`forest-marketing-logo-spin`, 14s linear).
2. **Hue cycle** via `filter` (`forest-marketing-logo-hue`, 24s `ease-in-out`): blue (default) → red → green → light gray/white → black → blue.
3. **Cyclic typography** (typewriter): the word "INSTITUTO" stays static while the word below is typed, held, erased and replaced by the next entry in the list.

**Cyclic word list** — defined in [src/components/about/aboutSpinningLogoConfig.ts](src/components/about/aboutSpinningLogoConfig.ts). To add, remove or reorder words, edit only that file:

```ts
export const SPINNING_LOGO_CYCLING_WORDS: string[] = [
  "FOREST",
  "FINANCE",
  "FIRE",
  "FUTURE",
  "FIELD",
  "FAUNA",
  "FLORA",
  "FORECAST",
  "OPEN SOURCE",
  "OPEN DATA",
  "CLIMATE",
];

export const SPINNING_LOGO_STATIC_WORD = "INSTITUTO";
```

Recommendations:

- Keep entries short (≈ 3 to 12 characters) — the widest word reserves the line width to avoid layout jumps.
- Order is preserved at runtime; the cycle is a simple `length`-modulo increment.
- Ad-hoc overrides are possible via props (`<AboutSpinningLogo cyclingWords={[...]} staticWord="..." />`), useful for page-specific variants.

**Reduced motion**: rotation and the blinking cursor honor `prefers-reduced-motion: reduce` (`src/app/globals.css`).

## Themes and UI tokens

Tokens and light/dark palettes are defined in [globals.md](doc/src/src/app/globals/globals.md). The theme follows `prefers-color-scheme` or the `theme-light` / `theme-dark` classes on the `html` element, persisted in `localStorage` under the `fp_theme` key. Surfaces and shadows use variables such as `--surface`, `--border` and `--shadow-float`.

Tailwind utility classes are the only styling channel — no CSS modules, no inline `style` objects for design values. Font scaling uses `--fp-font-scale` (5 levels, managed by `I18nProvider`); never set `font-size` directly on text elements.

Base components: [Button](doc/src/src/components/ui/Button/Button.md), [Modal](doc/src/src/components/ui/Modal/Modal.md). Layout: [Footer](doc/src/src/components/layout/Footer/Footer.md).

## Open data

The portal lists metadata and exposes downloads; heavy ingestion (ETL), aggregations and file generation live outside this repository in [`forest-open-data-pipelines`](https://github.com/julianopadua/forest-open-data-pipelines), in line with the separation of responsibilities and execution costs.

- **For end users**: install [`forest-data`](https://pypi.org/project/forest-data/) (`pip install forest-data`) or call the [public HTTP API](#public-http-api-apiv1).
- **Adding a dataset to the portal**: do not edit portal source. Add the entry to `forest-open-data-pipelines/configs/catalog/open_data.yml`, then run `forest-pipelines publish-catalog`. The portal picks it up on the next catalog fetch (≤ 1h due to revalidation).
- **Types and contracts**: [types.md](doc/src/src/lib/openData/types/types.md). Supporting SQL schema (when applicable): [doc/supabase/docSQL.md](doc/supabase/docSQL.md).

Catalog and page components: [OpenDataCatalog](doc/src/src/components/open-data/OpenDataCatalog/OpenDataCatalog.md), [OpenDataPageClient](doc/src/src/components/open-data/OpenDataPageClient/OpenDataPageClient.md), [DownloadAllButton](doc/src/src/components/open-data/DownloadAllButton/DownloadAllButton.md).

## Analytical reports

Reports are described in the catalog envelope at `catalog/reports_catalog.json` (published by the pipeline). The listing is documented in [reports/page.md](doc/src/src/app/reports/page/page.md). Visualizations and section types live in `src/components/reports/` and the dynamic route `src/app/reports/[report]/page.tsx`.

To register a new report: edit `forest-open-data-pipelines/configs/catalog/reports.yml` and run `forest-pipelines publish-catalog` + `forest-pipelines build-report <id>`. Add a new section-type component in `src/components/reports/` only when the report introduces a section kind that is not yet supported.

## Blog and documentation

- **Blog** (`/blog`): Markdown files under `content/blog/<slug>.md`, registered in `src/lib/blog/catalog.ts`. An optional `content/blog/<slug>.en.md` bundles a second locale at the same URL. Front-matter requires `title`, `date`, `author`, `excerpt`. The bundler runs at `prebuild` via `npm run blog:bundle`.
- **Public docs** (`/docs`): server-rendered docs in `src/app/docs/`. The API reference at `/docs/api/v1` is a Server Component that reuses `src/components/docs/{DocsLayout, DocsSidebar, EndpointBlock}.tsx`. Doc content is bundled at `prebuild` via `npm run docs:bundle`.

## Repository layout

Top-level summary:

```txt
content/                MDX/Markdown content (home, about, blog, docs)
doc/                    Per-file technical notes and index
public/                 Static assets and images
scripts/                Bundlers for blog/docs/OpenAPI (run at prebuild)
templates/              MDX/HTML templates
src/
  app/                  App Router routes, API routes, server actions
    api/v1/             Public read-only HTTP API (edge runtime)
    docs/               Public technical documentation
    blog/               Blog routes
    admin/              Internal admin area
  components/           UI, layout, auth, open-data, reports, settings, blog, docs, admin
  hooks/                Hooks (e.g., Supabase session on the client)
  i18n/                 Provider and dictionaries
  lib/                  Utilities, Supabase clients, openData, reports, blog, docs, api/v1, generated types
  middleware.ts         Supabase session at the edge
```

Generated database types: [database.types.md](doc/src/src/lib/database.types/database.types.md). Class-name helper: [cn.md](doc/src/src/lib/cn/cn.md).

Supabase clients: [client](doc/src/src/lib/supabase/client/client.md), [server](doc/src/src/lib/supabase/server/server.md), [admin](doc/src/src/lib/supabase/admin/admin.md).

## Code documentation

The canonical index that maps each implemented file to its `.md` note is in **[doc/INDEX.md](doc/INDEX.md)**. Consult it before broad changes to locate the corresponding technical note. The full contributor contract (Supabase client rules, manifest-driven rendering, security, common pitfalls) lives in [AGENTS.md](AGENTS.md).

Quick reference by domain:

- **Authentication (UI)**: [AuthModal](doc/src/src/components/auth/AuthModal/AuthModal.md), [AuthForm](doc/src/src/components/auth/AuthForm/AuthForm.md)
- **Client-side session**: [useSupabaseUser](doc/src/src/hooks/useSupabaseUser/useSupabaseUser.md)
- **Profile (settings)**: [ProfileForm](doc/src/src/components/settings/ProfileForm/ProfileForm.md)

Files without a dedicated index entry (for example modules only in `src/lib/reports/` or `src/components/reports/`) should be read from source until included by the documentation generator.

## Environment variables

Create `.env.local` at the repository root. Names below reflect the current code usage.

| Variable | Use |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (required for auth and open-data URLs) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (anon or publishable, per the dashboard) |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server operations (e.g., admin client); never expose to the client |
| `NEXT_PUBLIC_OPEN_DATA_BUCKET` | Open-data bucket name (defaults to `open-data` if omitted) |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Optional URL for the portfolio CTA on the landing |

Variables listed in older documents but not referenced by the current code must not be assumed required until they are explicitly introduced into the application.

## Local development

**Prerequisites**: Node.js in a current LTS version compatible with Next.js 16; npm bundled or installed separately.

**Install dependencies**:

```bash
npm install
```

**Configuration**: copy or create `.env.local` and fill in at least `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to exercise auth and flows that depend on Supabase. For open-data downloads to resolve correctly, the public URL and bucket must match the target environment.

**Development server**:

```bash
npm run dev
```

The app listens on `http://localhost:3000` by Next.js default. The `prebuild` scripts (`blog:bundle`, `docs:bundle`, `api:openapi`) run automatically before production builds; you can invoke them manually during dev if you change blog posts, docs content, or the API schema.

**Static analysis**:

```bash
npm run lint
npx tsc --noEmit
```

## Build and production

```bash
npm run build
npm run start
```

`build` produces the optimized output (after `prebuild` regenerates blog/docs bundles and the OpenAPI spec); `start` serves the build locally in production mode. Validate environment variables in the same format expected by production before deploying.

## Deployment

Primary target: Cloudflare via `@opennextjs/cloudflare`.

```bash
npm run preview   # local Cloudflare preview
npm run deploy    # deploy
npm run upload    # upload assets without going live
```

The Supabase project supplies Auth, Postgres and Storage. Mirror `.env.local` in the hosting provider's variables; never commit secrets. Review Row Level Security policies and bucket configuration per [doc/supabase/docSQL.md](doc/supabase/docSQL.md) and the official Supabase documentation.

## Roadmap

Plausible directions include: forum and moderation; expansion of the report catalog and automatic documentation for new components; broader public API surface; admin dashboard; consolidation of `CONTRIBUTING.md` and `LICENSE` once the institutional policy is set.

## Contributing and license

Branch standards, review workflow and source license can still be formalized in `CONTRIBUTING.md` and `LICENSE`. Until then, align changes with the existing structure and the documentation in `doc/` and [AGENTS.md](AGENTS.md).
