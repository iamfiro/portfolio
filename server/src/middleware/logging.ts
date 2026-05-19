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

function getRequestId(c: Context): string {
  return c.req.header("x-request-id") || randomUUID();
}

function getIp(c: Context): string | undefined {
  return c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
}

export default async function logging(c: Context, next: Next): Promise<void> {
  const requestId = getRequestId(c);
  const start = performance.now();
  const logger = createChildLogger({ requestId });
  const context = c as LoggerContext;
  const method = c.req.method;
  const path = c.req.path;
  const query = c.req.query();
  const queryLog = Object.keys(query).length > 0 ? query : undefined;

  context.set("logger", logger);
  context.set("requestId", requestId);

  logger.info(
    {
      method,
      path,
      ...(queryLog ? { query: queryLog } : {}),
      ip: getIp(c),
      userAgent: c.req.header("user-agent"),
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
