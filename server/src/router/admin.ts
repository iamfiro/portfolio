import { Hono } from "hono";

import {
  clearSessionCookie,
  isAuthenticated,
  requireAuth,
  safePasswordCompare,
  setSessionCookie,
} from "../middleware/auth.js";
import type { LoggerEnv } from "../middleware/logging.js";
import { loginRateLimit } from "../middleware/rate-limit.js";

const app = new Hono<LoggerEnv>();

interface LoginBody {
  password?: string;
}

app.use("*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
});

// POST /admin/login - rate limit 적용
app.post("/login", loginRateLimit, async (c) => {
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

  let body: LoginBody;
  try {
    body = (await c.req.json()) as LoginBody;
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  if (!body.password || !safePasswordCompare(body.password, expectedPassword)) {
    logger.warn({ operation: "admin.login", ip }, "failed login attempt");

    return c.json({ ok: false, message: "Invalid password" }, 401);
  }

  // HMAC 서명 세션 쿠키 설정
  setSessionCookie(c, "admin");

  logger.info({ operation: "admin.login", ip }, "login success");

  return c.json({ ok: true, message: "Authenticated" });
});

// POST /admin/logout - 세션 쿠키 삭제
app.post("/logout", requireAuth, (c) => {
  const logger = c.get("logger");

  clearSessionCookie(c);

  logger.info({ operation: "admin.logout" }, "logout success");

  return c.json({ ok: true, message: "Logged out" });
});

// GET /admin/session - 세션 유효성 확인
app.get("/session", (c) => {
  const authenticated = isAuthenticated(c);

  return c.json({ ok: true, authenticated });
});

export default app;
