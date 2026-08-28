import { Hono } from "hono";

import { requireAuth } from "../middleware/auth.js";
import type { LoggerEnv } from "../middleware/logging.js";
import prisma from "../utils/prisma.js";
import { validateStackCreate, validateStackUpdate } from "../utils/validation.js";

const app = new Hono<LoggerEnv>();

const stackRelations = {
  projects: {
    include: {
      project: { select: { id: true, title: true } },
    },
  },
};

app.get("/", async (c) => {
  const stacks = await prisma.stack.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
    include: stackRelations,
  });

  return c.json({
    ok: true,
    data: stacks.map(({ projects, ...stack }) => ({
      ...stack,
      projects: projects.map(({ project }) => project),
    })),
  });
});

app.get("/:id", async (c) => {
  const stack = await prisma.stack.findUnique({
    where: { id: c.req.param("id") },
    include: stackRelations,
  });

  if (!stack) {
    return c.json({ ok: false, message: "Stack not found" }, 404);
  }

  const { projects, ...data } = stack;
  return c.json({
    ok: true,
    data: { ...data, projects: projects.map(({ project }) => project) },
  });
});

app.post("/", requireAuth, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validateStackCreate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const data = body as Record<string, unknown>;
  const stack = await prisma.stack.create({
    data: {
      name: (data.name as string).trim(),
      imageUrl: (data.imageUrl as string | null) ?? null,
      description: (data.description as string | null) ?? null,
      category: (data.category as string | null) ?? null,
    },
  });

  return c.json({ ok: true, data: { ...stack, projects: [] } }, 201);
});

app.put("/:id", requireAuth, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validateStackUpdate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const id = c.req.param("id");
  const existing = await prisma.stack.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ ok: false, message: "Stack not found" }, 404);
  }

  const data = body as Record<string, unknown>;
  const stack = await prisma.stack.update({
    where: { id },
    data: {
      name: data.name !== undefined ? (data.name as string).trim() : undefined,
      imageUrl:
        data.imageUrl !== undefined ? (data.imageUrl as string | null) : undefined,
      description:
        data.description !== undefined ? (data.description as string | null) : undefined,
      category:
        data.category !== undefined ? (data.category as string | null) : undefined,
    },
    include: stackRelations,
  });

  const { projects, ...rest } = stack;
  return c.json({
    ok: true,
    data: { ...rest, projects: projects.map(({ project }) => project) },
  });
});

app.delete("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.stack.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ ok: false, message: "Stack not found" }, 404);
  }

  await prisma.stack.delete({ where: { id } });
  return c.json({ ok: true, message: "Stack deleted" });
});

export default app;
