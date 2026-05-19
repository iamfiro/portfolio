import { Hono } from "hono";
import { performance } from "node:perf_hooks";

import type { LoggerEnv } from "../middleware/logging.js";
import { syncNotionData } from "../utils/notionSync.js";

const app = new Hono<LoggerEnv>();

app.get("/", async (c) => {
  const logger = c.get("logger");
  const expectedToken = process.env.NOTION_SYNC_TOKEN;

  if (!expectedToken) {
    logger.error("NOTION_SYNC_TOKEN not configured");

    return c.json(
      { ok: false, message: "NOTION_SYNC_TOKEN is not configured on server" },
      500,
    );
  }

  const token = c.req.query("token");
  const isValidToken = Boolean(token && token === expectedToken);

  logger.info(
    { operation: "notionSync.trigger", tokenValid: isValidToken },
    "notion sync triggered",
  );

  if (!isValidToken) {
    logger.warn("invalid sync token attempt");

    return c.json({ ok: false, message: "Invalid token" }, 401);
  }

  try {
    const start = performance.now();

    logger.info({ operation: "notionSync.run" }, "notion sync started");

    const summary = await syncNotionData();

    logger.info(
      {
        operation: "notionSync.run",
        durationMs: Math.round(performance.now() - start),
        summary,
      },
      "notion sync completed",
    );

    return c.json({ ok: true, data: summary });
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));

    logger.error(
      {
        operation: "notionSync.run",
        error: syncError.message,
        stack: syncError.stack,
      },
      "notion sync failed",
    );

    return c.json({ ok: false, message: "Notion sync failed" }, 500);
  }
});

export default app;
