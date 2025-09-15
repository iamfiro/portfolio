import { Hono } from "hono";
import { cors } from "hono/cors";

import posts from "./router/posts.js";

const app = new Hono();

// CORS 미들웨어를 먼저 적용
app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://devfiro.com"]
        : "http://localhost:5173",
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

// Vercel에서는 export default로 핸들러를 내보내야 함
export default app;
