/**
 * 메모리 기반 로그인 rate limiter
 * IP 기반으로 일정 시간 내 시도 횟수 제한
 */
import type { Context, Next } from "hono";

import type { LoggerEnv } from "./logging.js";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15분
const MAX_ATTEMPTS = 10; // 15분 당 최대 10회

const store = new Map<string, RateLimitEntry>();

// 만료된 엔트리 주기적 정리 (메모리 누수 방지)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60_000);
cleanupTimer.unref();

function getClientIp(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}

export async function loginRateLimit(
  c: Context<LoggerEnv>,
  next: Next,
): Promise<Response | void> {
  const logger = c.get("logger");
  const ip = getClientIp(c);
  const key = `login:${ip}`;
  const now = Date.now();

  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }

  entry.count++;

  if (entry.count > MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);

    logger.warn(
      { ip, attempts: entry.count, retryAfterSeconds },
      "login rate limit exceeded",
    );

    c.header("Retry-After", String(retryAfterSeconds));
    return c.json(
      { ok: false, message: "Too many login attempts. Please try again later." },
      429,
    );
  }

  await next();
}
