import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import posts from "./router/posts.js";

const app = new Hono();

// CORS 미들웨어를 먼저 적용
app.use(
  "*",
  cors({
    origin: ["https://devfiro.com", "http://localhost:5173"],
    allowHeaders: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowMethods: ["*"],
  }),
);

app.route("/blog", posts);

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
