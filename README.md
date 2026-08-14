# Forest Portal

Next.js portal for Instituto Forest. It renders the public open-data catalog, analytical reports, public dataset API, documentation and authenticated portal flows.

## Documentation

Formal documentation is maintained in the workspace wiki:

- [Documentation index](../llm-wiki-forest/documents/README.md)
- [Architecture](../llm-wiki-forest/documents/technical/architecture.md)
- [Backend and data contract](../llm-wiki-forest/documents/backend/backend-and-data-contract.md)
- [Public API, Portuguese](../llm-wiki-forest/documents/backend/api-v1.pt.md)
- [Public API, English](../llm-wiki-forest/documents/backend/api-v1.en.md)

The public API is dataset-only. Reports remain portal functionality and are not public API resources.

## Requirements

- Node.js current LTS
- npm
- Supabase project credentials for local authenticated and Storage-backed flows

## Install and run

```bash
npm ci
cp .env.local.example .env.local
npm run dev
```

The local portal runs at `http://localhost:3000` by default.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run api:openapi
npm run docs:bundle
npm run build
```

`npm run api:openapi` writes `public/api/v1/openapi.json`. `npm run docs:bundle` writes `src/lib/docs/docs.generated.json`. Do not edit either file manually.

## Public API

Base URL: `https://institutoforest.org/api/v1`

| Route | Purpose |
|---|---|
| `GET /health` | Service and schema probe |
| `GET /catalog` | Compact dataset catalog |
| `GET /datasets/{id}` | Dataset manifest |
| `GET /datasets/{id}/items` | Dataset items |
| `GET /sources` | Source agencies and counts |
| `GET /openapi.json` | Generated OpenAPI document |

The API returns metadata only. Use each item `source_url` to download data from its official source.

## Security

- Keep Supabase service-role credentials in server-only environment variables.
- Never expose secrets in browser code, fixtures, logs or generated content.
- Run `forest-api-tests/scripts/run_pentest.sh` before deploying API changes.

## License

See [LICENSE](LICENSE).
