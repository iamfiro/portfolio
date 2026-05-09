import { Hono } from "hono";

import prisma from "../utils/prisma.js";

const app = new Hono();

// GET /projects - 전체 목록 조회
app.get("/", async (c) => {
  const projects = await prisma.project.findMany({
    orderBy: { startDate: "desc" },
  });

  const data = projects.map((project) => ({
    ...project,
    techStack: JSON.parse(project.techStack),
  }));

  return c.json({ ok: true, data });
});

// GET /projects/:id - 단건 조회
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  return c.json({
    ok: true,
    data: { ...project, techStack: JSON.parse(project.techStack) },
  });
});

// POST /projects - 생성
app.post("/", async (c) => {
  const body = await c.req.json();

  const project = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      techStack: JSON.stringify(body.techStack ?? []),
      thumbnailUrl: body.thumbnailUrl ?? null,
      githubUrl: body.githubUrl ?? null,
      deployUrl: body.deployUrl ?? null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });

  return c.json(
    { ok: true, data: { ...project, techStack: JSON.parse(project.techStack) } },
    201,
  );
});

// PUT /projects/:id - 수정
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      techStack: body.techStack
        ? JSON.stringify(body.techStack)
        : existing.techStack,
      thumbnailUrl:
        body.thumbnailUrl !== undefined
          ? body.thumbnailUrl
          : existing.thumbnailUrl,
      githubUrl:
        body.githubUrl !== undefined ? body.githubUrl : existing.githubUrl,
      deployUrl:
        body.deployUrl !== undefined ? body.deployUrl : existing.deployUrl,
      startDate: body.startDate
        ? new Date(body.startDate)
        : existing.startDate,
      endDate:
        body.endDate !== undefined
          ? body.endDate
            ? new Date(body.endDate)
            : null
          : existing.endDate,
    },
  });

  return c.json({
    ok: true,
    data: { ...project, techStack: JSON.parse(project.techStack) },
  });
});

// DELETE /projects/:id - 삭제
app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  await prisma.project.delete({ where: { id } });

  return c.json({ ok: true, message: "Project deleted" });
});

export default app;
