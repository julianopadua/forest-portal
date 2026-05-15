import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();
export { z };

export const API_VERSION = "v1";
export const API_BASE_PATH = `/api/${API_VERSION}`;
