# Security Policy

Instituto Forest welcomes responsible security reports.

Do not report secrets or vulnerabilities publicly if the report includes sensitive technical details, credentials, private tokens, service-role keys, or information that could help abuse the project.

For security issues, contact the maintainer privately at contato@institutoforest.org.

## Notes

- The public `/api/v1` API is read-only and metadata-oriented.
- Secrets must never be committed to the repository.
- Supabase service-role keys must never be exposed to browser or client code.
- Environment variables and deployment credentials should live only in local environment files, CI secrets, or hosting provider secrets.

This project does not claim to be fully audited or fully secure.
