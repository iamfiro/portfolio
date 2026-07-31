import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";

import type { Context, Next } from "hono";
import pino from "pino";

import { createChildLogger } from "../utils/logger.js";

export interface LoggerEnv {
  Variables: {
    logger: pino.Logger;
    requestId: string;
  };
}

type LoggerContext = Context<LoggerEnv>;

// 민감 쿼리 파라미터 목록
const SENSITIVE_QUERY_KEYS = new Set([
  "token",
  "secret",
  "key",
  "password",
  "api_key",
  "apikey",
  "access_token",
  "auth",
]);

// 민감 헤더 목록
const SENSITIVE_HEADERS = new Set(["authorization", "cookie", "set-cookie", "x-api-key"]);

function getRequestId(c: Context): string {
  return c.req.header("x-request-id") || randomUUID();
}

function getIp(c: Context): string | undefined {
  return c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
}

/**
 * 쿼리 파라미터에서 민감 정보를 마스킹한 객체 반환
 */
function maskSensitiveQuery(
  query: Record<string, string>,
): Record<string, string> | undefined {
  const keys = Object.keys(query);
  if (keys.length === 0) return undefined;

  const masked: Record<string, string> = {};
  for (const key of keys) {
    if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
      masked[key] = "[REDACTED]";
    } else {
      masked[key] = query[key];
    }
  }

  return masked;
}

/**
 * 헤더 값 마스킹 (존재 여부만 로깅)
 */
function maskHeaderValue(name: string, value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (SENSITIVE_HEADERS.has(name.toLowerCase())) {
    return "[REDACTED]";
  }
  return value;
}

export default async function logging(c: Context, next: Next): Promise<void> {
  const requestId = getRequestId(c);
  const start = performance.now();
  const logger = createChildLogger({ requestId });
  const context = c as LoggerContext;
  const method = c.req.method;
  const path = c.req.path;
  const query = c.req.query();
  const maskedQuery = maskSensitiveQuery(query);

  context.set("logger", logger);
  context.set("requestId", requestId);

  logger.info(
    {
      method,
      path,
      ...(maskedQuery ? { query: maskedQuery } : {}),
      ip: getIp(c),
      userAgent: c.req.header("user-agent"),
      authorization: maskHeaderValue("authorization", c.req.header("authorization")),
    },
    "request start",
  );

  try {
    await next();

    logger.info(
      {
        method,
        path,
        status: c.res.status,
        durationMs: Math.round(performance.now() - start),
      },
      "request end",
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));

    logger.error(
      {
        method,
        path,
        error: error.message,
        stack: error.stack,
      },
      "request error",
    );

    throw err;
  }
}
