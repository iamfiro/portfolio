import "./env.js";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

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

const app = new Hono();

// CORS 미들웨어를 먼저 적용
app.use(
  "*",
  cors({
    origin: ["https://devfiro.com", "http://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
