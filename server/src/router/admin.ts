import { Hono } from "hono";

import type { LoggerEnv } from "../middleware/logging.js";

const app = new Hono<LoggerEnv>();

interface LoginBody {
  password?: string;
}

app.post("/login", async (c) => {
  const logger = c.get("logger");
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim();

  logger.info({ operation: "admin.login", ip }, "login attempt");

  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    logger.error("ADMIN_PASSWORD not configured");

    return c.json(
      { ok: false, message: "ADMIN_PASSWORD is not configured on server" },
      500,
    );
  }

  const body = (await c.req.json()) as LoginBody;

  if (!body.password || body.password !== expectedPassword) {
    logger.warn({ operation: "admin.login", ip }, "failed login attempt");

    return c.json({ ok: false, message: "Invalid password" }, 401);
  }

  logger.info({ operation: "admin.login", ip }, "login success");

  return c.json({ ok: true, message: "Authenticated" });
});

export default app;
