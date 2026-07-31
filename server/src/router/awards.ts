import { Hono } from "hono";

import { requireAuth } from "../middleware/auth.js";
import type { LoggerEnv } from "../middleware/logging.js";
import prisma from "../utils/prisma.js";
import { validateAwardCreate, validateAwardUpdate } from "../utils/validation.js";

const app = new Hono<LoggerEnv>();

const projectSelect = {
  id: true,
  title: true,
};

// GET /awards - 전체 목록 조회 (공개)
app.get("/", async (c) => {
  const logger = c.get("logger");

  logger.info({ operation: "award.list" }, "listing awards");

  const awards = await prisma.award.findMany({
    orderBy: { date: "desc" },
    include: { project: { select: projectSelect } },
  });

  return c.json({ ok: true, data: awards });
});

// GET /awards/:id - 단건 조회 (공개)
app.get("/:id", async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  logger.info({ operation: "award.get", id }, "getting award");

  const award = await prisma.award.findUnique({
    where: { id },
    include: { project: { select: projectSelect } },
  });

  if (!award) {
    logger.warn({ operation: "award.get", id }, "award not found");

    return c.json({ ok: false, message: "Award not found" }, 404);
  }

  return c.json({ ok: true, data: award });
});

// POST /awards - 생성 (인증 필요)
app.post("/", requireAuth, async (c) => {
  const logger = c.get("logger");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validateAwardCreate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const data = body as Record<string, unknown>;

  logger.info(
    {
      operation: "award.create",
      title: data.title,
      projectId: data.projectId,
    },
    "creating award",
  );

  if (data.projectId) {
    const existingProject = await prisma.project.findUnique({
      where: { id: data.projectId as string },
    });

    if (!existingProject) {
      logger.warn(
        { operation: "award.create", projectId: data.projectId },
        "project not found",
      );

      return c.json({ ok: false, message: "Project not found" }, 404);
    }
  }

  const award = await prisma.award.create({
    data: {
      title: data.title as string,
      description: (data.description as string) ?? null,
      organization: data.organization as string,
      date: new Date(data.date as string),
      imageUrl: (data.imageUrl as string) ?? null,
      projectId: (data.projectId as string) ?? null,
    },
    include: { project: { select: projectSelect } },
  });

  logger.info(
    { operation: "award.create", id: award.id, title: award.title },
    "award created",
  );

  return c.json({ ok: true, data: award }, 201);
});

// PUT /awards/:id - 수정 (인증 필요)
app.put("/:id", requireAuth, async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validateAwardUpdate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const data = body as Record<string, unknown>;

  logger.info(
    {
      operation: "award.update",
      id,
      title: data.title,
      projectId: data.projectId,
    },
    "updating award",
  );

  const existing = await prisma.award.findUnique({ where: { id } });

  if (!existing) {
    logger.warn({ operation: "award.update", id }, "award not found");

    return c.json({ ok: false, message: "Award not found" }, 404);
  }

  if (data.projectId) {
    const existingProject = await prisma.project.findUnique({
      where: { id: data.projectId as string },
    });

    if (!existingProject) {
      logger.warn(
        { operation: "award.update", id, projectId: data.projectId },
        "project not found",
      );

      return c.json({ ok: false, message: "Project not found" }, 404);
    }
  }

  const award = await prisma.award.update({
    where: { id },
    data: {
      title: (data.title as string) ?? existing.title,
      description:
        data.description !== undefined
          ? (data.description as string | null)
          : existing.description,
      organization: (data.organization as string) ?? existing.organization,
      date: data.date ? new Date(data.date as string) : existing.date,
      imageUrl:
        data.imageUrl !== undefined
          ? (data.imageUrl as string | null)
          : existing.imageUrl,
      projectId:
        data.projectId !== undefined
          ? (data.projectId as string | null)
          : existing.projectId,
    },
    include: { project: { select: projectSelect } },
  });

  logger.info(
    { operation: "award.update", id: award.id, title: award.title },
    "award updated",
  );

  return c.json({ ok: true, data: award });
});

// DELETE /awards/:id - 삭제 (인증 필요)
app.delete("/:id", requireAuth, async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  logger.info({ operation: "award.delete", id }, "deleting award");

  const existing = await prisma.award.findUnique({ where: { id } });

  if (!existing) {
    logger.warn({ operation: "award.delete", id }, "award not found");

    return c.json({ ok: false, message: "Award not found" }, 404);
  }

  await prisma.award.delete({ where: { id } });

  logger.info(
    { operation: "award.delete", id: existing.id, title: existing.title },
    "award deleted",
  );

  return c.json({ ok: true, message: "Award deleted" });
});

export default app;
