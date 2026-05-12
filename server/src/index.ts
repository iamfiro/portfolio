import { serve } from "@hono/node-server";
import { config as dotenvConfig } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import admin from "./router/admin.js";
import awards from "./router/awards.js";
import posts from "./router/posts.js";
import projects from "./router/projects.js";
import { syncPosts } from "./utils/syncPosts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenvConfig({ path: resolve(__dirname, "../../.env") });
dotenvConfig({ path: resolve(__dirname, "../.env") });

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

app.get("/", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono! - Welcome to the my portfolio API",
  });
});

syncPosts().catch(console.error);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
