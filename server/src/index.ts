import "./env.js";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import type { LoggerEnv } from "./middleware/logging.js";
import logging from "./middleware/logging.js";
import logger from "./utils/logger.js";

if (process.env.NOTION_AUTO_MIGRATE === "1") {
  const { syncNotionSchemaIfNeeded } = await import(
    "./utils/notionSchemaSync.js"
  );

  await syncNotionSchemaIfNeeded({ applyMigration: true });
}

const { default: admin } = await import("./router/admin.js");
const { default: awards } = await import("./router/awards.js");
const { default: notionSync } = await import("./router/notion-sync.js");
const { default: posts } = await import("./router/posts.js");
const { default: projects } = await import("./router/projects.js");

const app = new Hono<LoggerEnv>();

app.use("*", logging);

app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        "https://devfiro.com",
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      return allowedOrigins.includes(origin || "") ? origin : "https://devfiro.com";
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.route("/blog", posts);
app.route("/projects", projects);
app.route("/awards", awards);
app.route("/admin", admin);
app.route("/notion-sync", notionSync);

app.get("/", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono! - Welcome to the my portfolio API",
  });
});

if (!process.env.VERCEL) {
  const port = 3000;
  logger.info({ port }, "server started");

  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
