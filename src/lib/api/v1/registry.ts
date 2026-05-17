import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

export { API_VERSION, API_BASE_PATH } from "./constants";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();
export { z };
