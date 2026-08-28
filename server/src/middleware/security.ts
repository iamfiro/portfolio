import type { Context, Next } from "hono";
import { bodyLimit } from "hono/body-limit";

import logger from "../utils/logger.js";

const MAX_BODY_SIZE = 1024 * 1024;

export async function securityHeaders(c: Context, next: Next): Promise<void> {
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "0");
  c.header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  c.header("Referrer-Policy", "no-referrer");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  await next();
}

export const bodySizeLimit = bodyLimit({
  maxSize: MAX_BODY_SIZE,
  onError: (c) => c.json({ ok: false, message: "Request body too large" }, 413),
});

export async function globalErrorHandler(c: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const isProduction = process.env.NODE_ENV === "production";

    logger.error(
      {
        error: error.message,
        stack: error.stack,
        path: c.req.path,
        method: c.req.method,
      },
      "unhandled error",
    );

    c.res = c.json(
      {
        ok: false,
        message: isProduction ? "Internal server error" : error.message,
      },
      500,
    );
  }
}
