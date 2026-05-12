import { Hono } from "hono";
import { randomUUID } from "node:crypto";

import prisma from "../utils/prisma.js";

const app = new Hono();

// GET /awards - 전체 목록 조회
app.get("/", async (c) => {
  const awards = await prisma.award.findMany({
    orderBy: { date: "desc" },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return c.json({ ok: true, data: awards });
});

// GET /awards/:id - 단건 조회
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const award = await prisma.award.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!award) {
    return c.json({ ok: false, message: "Award not found" }, 404);
  }

  return c.json({ ok: true, data: award });
});

// POST /awards - 생성
app.post("/", async (c) => {
  const body = await c.req.json();

  if (body.projectId) {
    const existingProject = await prisma.project.findUnique({
      where: { id: body.projectId },
    });

    if (!existingProject) {
      return c.json({ ok: false, message: "Project not found" }, 404);
    }

    const alreadyLinkedAward = await prisma.award.findFirst({
      where: { projectId: body.projectId },
      select: { id: true },
    });

    if (alreadyLinkedAward) {
      return c.json(
        {
          ok: false,
          message: "This project is already linked to another award",
        },
        409,
      );
    }
  }

  const award = await prisma.award.create({
    data: {
      notionId: body.notionId ?? `manual-${randomUUID()}`,
      title: body.title,
      organization: body.organization,
      date: new Date(body.date),
      imageUrl: body.imageUrl ?? null,
      projectId: body.projectId ?? null,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return c.json({ ok: true, data: award }, 201);
});

// PUT /awards/:id - 수정
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const existing = await prisma.award.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ ok: false, message: "Award not found" }, 404);
  }

  if (body.projectId) {
    const existingProject = await prisma.project.findUnique({
      where: { id: body.projectId },
    });

    if (!existingProject) {
      return c.json({ ok: false, message: "Project not found" }, 404);
    }

    const alreadyLinkedAward = await prisma.award.findFirst({
      where: { projectId: body.projectId },
      select: { id: true },
    });

    if (alreadyLinkedAward && alreadyLinkedAward.id !== id) {
      return c.json(
        {
          ok: false,
          message: "This project is already linked to another award",
        },
        409,
      );
    }
  }

  const award = await prisma.award.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      organization: body.organization ?? existing.organization,
      date: body.date ? new Date(body.date) : existing.date,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
      projectId:
        body.projectId !== undefined ? body.projectId : existing.projectId,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return c.json({ ok: true, data: award });
});

// DELETE /awards/:id - 삭제
app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.award.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ ok: false, message: "Award not found" }, 404);
  }

  await prisma.award.delete({ where: { id } });

  return c.json({ ok: true, message: "Award deleted" });
});

export default app;
