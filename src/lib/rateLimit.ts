//src/lib/rateLimit.ts
//
//shared in-memory IP rate limiter for auth and suggest routes.
//cloudflare workers re-instantiate the module per isolate, so this is
//best-effort: a determined attacker hitting many cf colos around the
//world bypasses it. it does stop unsophisticated bursts and is good
//enough until we move to a durable-object backed limiter.

type Bucket = {
  count: number;
  windowStart: number;
};

const BUCKETS = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * Returns true if the request is within the limit; false if it should be
 * 429'd. Caller is responsible for emitting the 429 response.
 */
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = BUCKETS.get(key);
  if (!bucket || now - bucket.windowStart >= windowMs) {
    BUCKETS.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

/** Convenience wrapper: scope a limit by route + IP. */
export function allowFor(route: string, req: Request, max: number, windowMs: number): boolean {
  return allow(`${route}:${clientIp(req)}`, max, windowMs);
}
