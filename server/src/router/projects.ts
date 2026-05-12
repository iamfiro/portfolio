import { Hono } from "hono";
import { randomUUID } from "node:crypto";

import prisma from "../utils/prisma.js";

const app = new Hono();

function parseRelatedPost(post: {
  title: string;
  summary: string | null;
  thumbnailUrl: string | null;
  date: Date;
  categories: string;
}) {
  return {
    title: post.title,
    description: post.summary ?? undefined,
    thumbnail: post.thumbnailUrl ?? undefined,
    date: post.date,
    tags: JSON.parse(post.categories),
  };
}

function parseTechStack(
  stacks: Array<{ stack: { name: string } }>,
): string[] {
  return stacks.map((item) => item.stack.name);
}

async function resolveStackIds(names: string[]) {
  if (names.length === 0) {
    return [] as string[];
  }

  const normalized = names.map((name) => name.trim()).filter(Boolean);
  if (normalized.length === 0) {
    return [] as string[];
  }

  const existing = await prisma.stack.findMany({
    where: { name: { in: normalized } },
  });

  const existingMap = new Map(existing.map((stack) => [stack.name, stack.id]));
  const missing = normalized.filter((name) => !existingMap.has(name));

  for (const name of missing) {
    const created = await prisma.stack.create({
      data: {
        notionId: `manual-${randomUUID()}`,
        name,
      },
    });

    existingMap.set(name, created.id);
  }

  return normalized
    .map((name) => existingMap.get(name))
    .filter((id): id is string => Boolean(id));
}

async function replaceProjectStacks(projectId: string, names: string[]) {
  const stackIds = await resolveStackIds(names);

  await prisma.projectStack.deleteMany({ where: { projectId } });

  if (stackIds.length === 0) {
    return;
  }

  await prisma.projectStack.createMany({
    data: stackIds.map((stackId) => ({ projectId, stackId })),
  });
}

// GET /projects - 전체 목록 조회
app.get("/", async (c) => {
  const projects = await prisma.project.findMany({
    orderBy: { startDate: "desc" },
    include: {
      posts: { include: { post: true } },
      award: { select: { id: true, title: true } },
      stacks: { include: { stack: true } },
    },
  });

  const data = projects.map(({ posts, stacks, ...project }) => ({
    ...project,
    techStack: parseTechStack(stacks),
    relatedPosts: posts.map((relation) =>
      parseRelatedPost(relation.post),
    ),
  }));

  return c.json({ ok: true, data });
});

// GET /projects/:id - 단건 조회
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      posts: { include: { post: true } },
      award: { select: { id: true, title: true } },
      stacks: { include: { stack: true } },
    },
  });

  if (!project) {
    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  const { posts, stacks, ...rest } = project;

  const relatedPosts = posts.map((relation) =>
    parseRelatedPost(relation.post),
  );

  return c.json({
    ok: true,
    data: {
      ...rest,
      techStack: parseTechStack(stacks),
      relatedPosts,
    },
  });
});

// POST /projects - 생성
app.post("/", async (c) => {
  const body = await c.req.json();

  const project = await prisma.project.create({
    data: {
      notionId: body.notionId ?? `manual-${randomUUID()}`,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl ?? null,
      githubUrl: body.githubUrl ?? null,
      deployUrl: body.deployUrl ?? null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
    include: { stacks: { include: { stack: true } } },
  });

  if (Array.isArray(body.techStack)) {
    await replaceProjectStacks(project.id, body.techStack);
  }

  const createdTechStack = Array.isArray(body.techStack)
    ? body.techStack
    : parseTechStack(project.stacks);

  return c.json(
    {
      ok: true,
      data: {
        ...project,
        techStack: createdTechStack,
      },
    },
    201,
  );
});

// PUT /projects/:id - 수정
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const existing = await prisma.project.findUnique({
    where: { id },
    include: { stacks: { include: { stack: true } } },
  });

  if (!existing) {
    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      thumbnailUrl:
        body.thumbnailUrl !== undefined
          ? body.thumbnailUrl
          : existing.thumbnailUrl,
      githubUrl:
        body.githubUrl !== undefined ? body.githubUrl : existing.githubUrl,
      deployUrl:
        body.deployUrl !== undefined ? body.deployUrl : existing.deployUrl,
      startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
      endDate:
        body.endDate !== undefined
          ? body.endDate
            ? new Date(body.endDate)
            : null
          : existing.endDate,
    },
    include: { stacks: { include: { stack: true } } },
  });

  if (Array.isArray(body.techStack)) {
    await replaceProjectStacks(project.id, body.techStack);
  }

  const updatedTechStack = Array.isArray(body.techStack)
    ? body.techStack
    : parseTechStack(project.stacks);

  return c.json({
    ok: true,
    data: { ...project, techStack: updatedTechStack },
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
