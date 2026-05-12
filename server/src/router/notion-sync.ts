import { Hono } from "hono";

import { syncNotionData } from "../utils/notionSync.js";

const app = new Hono();

app.get("/", async (c) => {
  const expectedToken = process.env.NOTION_SYNC_TOKEN;

  if (!expectedToken) {
    return c.json(
      { ok: false, message: "NOTION_SYNC_TOKEN is not configured on server" },
      500,
    );
  }

  const token = c.req.query("token");

  if (!token || token !== expectedToken) {
    return c.json({ ok: false, message: "Invalid token" }, 401);
  }

  try {
    const summary = await syncNotionData();
    return c.json({ ok: true, data: summary });
  } catch (error) {
    console.error("Notion sync failed:", error);
    return c.json({ ok: false, message: "Notion sync failed" }, 500);
  }
});

export default app;
