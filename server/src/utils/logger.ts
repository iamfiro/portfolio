import "../env.js";

import pino from "pino";

const level = process.env.LOG_LEVEL || "info";

const logger = pino({
  level,
  base: {
    service: "portfolio-api",
    env: process.env.NODE_ENV || "development",
  },
});

export function createChildLogger(context: Record<string, unknown>): pino.Logger {
  return logger.child(context);
}

export default logger;
