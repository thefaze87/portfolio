/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Scope and limitations — read before relying on this:
 *   - State lives in the module scope of a single server instance. It does
 *     NOT coordinate across serverless instances or survive a cold start.
 *   - It is therefore a courtesy throttle against casual abuse and accidental
 *     double-submits, not a security control.
 *
 * That's an accepted trade-off at launch volume: it adds no dependency, no
 * network hop, and no third-party script (which the performance budget
 * forbids on critical pages). When contact volume justifies it, replace the
 * backing store with Upstash/Redis or move the limit to the hosting edge —
 * the `checkRateLimit` signature is designed to survive that swap unchanged.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Bound the map so a flood of unique keys can't grow memory without limit. */
const MAX_TRACKED_KEYS = 5_000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the current window resets. 0 when allowed. */
  retryAfter: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      for (const [k, w] of windows) {
        if (w.resetAt <= now) windows.delete(k);
      }
      // Still full of live windows — drop the oldest to bound memory.
      if (windows.size >= MAX_TRACKED_KEYS) {
        const oldest = windows.keys().next();
        if (!oldest.done) windows.delete(oldest.value);
      }
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}
