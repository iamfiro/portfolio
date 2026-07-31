import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import type { LoggerEnv } from "./middleware/logging.js";
import logging from "./middleware/logging.js";
import {
  bodySizeLimit,
  globalErrorHandler,
  securityHeaders,
} from "./middleware/security.js";
import { getAllowedOrigins, requireTrustedOrigin } from "./middleware/trusted-origin.js";
import logger from "./utils/logger.js";
import prisma from "./utils/prisma.js";

import "./env.js";

const { default: admin } = await import("./router/admin.js");
const { default: awards } = await import("./router/awards.js");
const { default: posts } = await import("./router/posts.js");
const { default: projects } = await import("./router/projects.js");
const { default: stacks } = await import("./router/stacks.js");

const app = new Hono<LoggerEnv>();

app.use("*", globalErrorHandler);
app.use("*", securityHeaders);
app.use("*", logging);
app.use("*", bodySizeLimit);
app.use("*", requireTrustedOrigin);
app.use(
  "*",
  cors({
    origin: (origin) => (getAllowedOrigins().includes(origin || "") ? origin : ""),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.route("/blog", posts);
app.route("/projects", projects);
app.route("/awards", awards);
app.route("/admin", admin);
app.route("/stacks", stacks);

app.get("/", (c) =>
  c.json({
    ok: true,
    message: "Portfolio API is healthy",
  }),
);

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3000;
  const server = serve({ fetch: app.fetch, port });

  logger.info({ port }, "server started");

  const shutdown = async (signal: NodeJS.Signals) => {
    logger.info({ signal }, "server shutdown requested");

    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await prisma.$disconnect();
  };

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      void shutdown(signal)
        .then(() => process.exit(0))
        .catch((error) => {
          logger.error({ error }, "graceful shutdown failed");
          process.exit(1);
        });
    });
  }
}

export default app;
