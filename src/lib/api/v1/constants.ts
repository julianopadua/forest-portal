//runtime-safe constants for the v1 API. no zod, no zod-to-openapi.
//route handlers must import from here, not from registry.ts.
export const API_VERSION = "v1";
export const API_BASE_PATH = `/api/${API_VERSION}`;
