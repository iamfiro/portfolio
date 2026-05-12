import { Hono } from "hono";

const app = new Hono();

interface LoginBody {
  password?: string;
}

app.post("/login", async (c) => {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return c.json(
      { ok: false, message: "ADMIN_PASSWORD is not configured on server" },
      500,
    );
  }

  const body = (await c.req.json()) as LoginBody;

  if (!body.password || body.password !== expectedPassword) {
    return c.json({ ok: false, message: "Invalid password" }, 401);
  }

  return c.json({ ok: true, message: "Authenticated" });
});

export default app;
