import type { Context, Next } from "hono";

import type { LoggerEnv } from "./logging.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function getAllowedOrigins(): string[] {
  const configured = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV === "production") {
    return configured?.length ? configured : ["https://devfiro.com"];
  }

  return [
    "https://devfiro.com",
    "http://localhost:5173",
    "http://localhost:3000",
    ...(configured ?? []),
  ];
}

export async function requireTrustedOrigin(
  c: Context<LoggerEnv>,
  next: Next,
): Promise<Response | void> {
  if (SAFE_METHODS.has(c.req.method)) {
    await next();
    return;
  }

  const origin = c.req.header("origin");
  const fetchSite = c.req.header("sec-fetch-site");
  const isCrossSite = fetchSite === "cross-site";
  const isAllowedOrigin = !origin || getAllowedOrigins().includes(origin);

  if (isCrossSite || !isAllowedOrigin) {
    c.get("logger").warn(
      { method: c.req.method, path: c.req.path, origin, fetchSite },
      "untrusted mutation origin rejected",
    );

    return c.json({ ok: false, message: "Untrusted request origin" }, 403);
  }

  await next();
}
