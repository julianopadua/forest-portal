# Contributing to Instituto Forest Portal

Thank you for considering a contribution to Instituto Forest.

Instituto Forest is an open-source data intelligence project for environmental and commodity data in Brazil. This repository contains the public web portal, the open-data catalog UI, the read-only HTTP API at `/api/v1`, API documentation, reports UI, blog, and authenticated user flows.

## Welcome contributions

Contributions are welcome when they improve correctness, clarity, maintainability, or public usefulness. Good early-stage contributions include:

- Bug reports with clear reproduction steps.
- Documentation improvements.
- Accessibility and usability improvements.
- Small UI fixes that preserve the existing design language.
- Public API documentation improvements.
- Dataset suggestions with official source information.

Avoid broad rewrites unless they are discussed first.

## Report bugs

Open a GitHub issue with:

- A short description of the problem.
- Steps to reproduce the behavior.
- Expected behavior and actual behavior.
- Browser, operating system, and relevant environment details.
- Screenshots or sanitized logs when useful.

Do not include secrets, private tokens, service-role keys, credentials, or sensitive infrastructure details.

## Suggest datasets

Dataset suggestions may be sent through the public suggestion form on the portal or through a GitHub issue.

Every dataset suggestion should include:

- The official source URL.
- The responsible institution.
- The access method, such as direct file URL, API endpoint, catalog page, or manual download page.
- The update frequency, if known.
- A brief explanation of the dataset's relevance to Instituto Forest.

Instituto Forest does not mirror dataset files by default. Dataset metadata should preserve official source provenance and link back to the original provider.

## Improve documentation

Documentation improvements may target the README, public API docs, blog-adjacent explanatory text, or in-repository technical notes. Keep changes factual, concise, and easy to verify.

If a documentation change describes API behavior, verify that it matches the current implementation under `src/app/api/v1` and the schemas in `src/lib/api/v1`.

## Open pull requests

Before opening a pull request:

1. Use a focused branch with a clear purpose.
2. Keep the diff small and reviewable.
3. Explain what changed and why.
4. Link related issues when applicable.
5. Preserve existing architecture and naming conventions.

Do not hardcode catalog data in the portal. The public catalog is loaded from published metadata, and API contract changes should be explicit and reviewed carefully.

## Validation before submitting

Run fast local checks before opening a pull request:

```bash
npm run lint
npx tsc --noEmit
```

If the change affects Cloudflare deployment, OpenNext output, public API behavior, or Supabase integration, say so in the pull request so the maintainer can run the broader release checks.

## Security

Never commit secrets, service-role keys, credentials, private tokens, `.env` files, or sensitive infrastructure details.

The Supabase service role key must remain server-side. It must never be exposed to browser or client code.

Report sensitive security issues privately. See [SECURITY.md](SECURITY.md).

## Licenses

Source code is licensed under the [MIT License](LICENSE).

Data, content, metadata, and third-party dataset terms are described in [DATA-LICENSING.md](DATA-LICENSING.md).
