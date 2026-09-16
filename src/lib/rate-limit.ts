// src/lib/rate-limit.ts
// Token bucket rate limiting (in-memory + Upstash compatible)

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const memoryStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const record = memoryStore[identifier];

  if (!record || now > record.resetAt) {
    memoryStore[identifier] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (record.count >= limit) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  record.count += 1;
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSeconds: Math.max(1, resetInSeconds),
  };
}
