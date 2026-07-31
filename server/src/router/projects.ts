import { Hono } from "hono";

import { requireAuth } from "../middleware/auth.js";
import type { LoggerEnv } from "../middleware/logging.js";
import prisma from "../utils/prisma.js";
import { validateProjectCreate, validateProjectUpdate } from "../utils/validation.js";

const app = new Hono<LoggerEnv>();

function parseRelatedPost(post: {
  id: string;
  title: string;
  summary: string | null;
  thumbnailUrl: string | null;
  date: Date;
  categories: string;
}) {
  return {
    id: post.id,
    title: post.title,
    description: post.summary ?? undefined,
    thumbnail: post.thumbnailUrl ?? undefined,
    date: post.date,
    tags: JSON.parse(post.categories),
  };
}

function parseTechStack(stacks: Array<{ stack: { name: string } }>): string[] {
  return stacks.map((item) => item.stack.name);
}

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
}

async function validateRelatedPostIds(ids: string[]): Promise<boolean> {
  if (ids.length === 0) {
    return true;
  }

  const count = await prisma.post.count({ where: { id: { in: ids } } });
  return count === ids.length;
}

async function replaceProjectPosts(
  tx: typeof prisma,
  projectId: string,
  postIds: string[],
) {
  await tx.postProject.deleteMany({ where: { projectId } });

  if (postIds.length === 0) {
    return;
  }

  await tx.postProject.createMany({
    data: postIds.map((postId) => ({ projectId, postId })),
  });
}

async function resolveStackIds(tx: typeof prisma, names: string[]) {
  if (names.length === 0) {
    return [] as string[];
  }

  const normalized = names.map((name) => name.trim()).filter(Boolean);
  if (normalized.length === 0) {
    return [] as string[];
  }

  const existing = await tx.stack.findMany({
    where: { name: { in: normalized } },
  });

  const existingMap = new Map(existing.map((stack) => [stack.name, stack.id]));
  const missing = normalized.filter((name) => !existingMap.has(name));

  for (const name of missing) {
    const created = await tx.stack.create({
      data: {
        name,
      },
    });

    existingMap.set(name, created.id);
  }

  return normalized
    .map((name) => existingMap.get(name))
    .filter((id): id is string => Boolean(id));
}

async function replaceProjectStacks(
  tx: typeof prisma,
  projectId: string,
  names: string[],
) {
  const stackIds = await resolveStackIds(tx, names);

  await tx.projectStack.deleteMany({ where: { projectId } });

  if (stackIds.length === 0) {
    return;
  }

  await tx.projectStack.createMany({
    data: stackIds.map((stackId) => ({ projectId, stackId })),
  });
}

const projectRelations = {
  posts: { include: { post: true } },
  awards: {
    orderBy: { date: "desc" as const },
    select: {
      id: true,
      title: true,
      description: true,
      organization: true,
      date: true,
      imageUrl: true,
    },
  },
  stacks: { include: { stack: true } },
};

// GET /projects - 전체 목록 조회 (공개)
app.get("/", async (c) => {
  const logger = c.get("logger");

  logger.info({ operation: "project.list" }, "listing projects");

  const projects = await prisma.project.findMany({
    orderBy: { startDate: "desc" },
    include: projectRelations,
  });

  const data = projects.map(({ posts, stacks, awards, ...project }) => ({
    ...project,
    techStack: parseTechStack(stacks),
    relatedPosts: posts.map((relation) => parseRelatedPost(relation.post)),
    awards,
  }));

  return c.json({ ok: true, data });
});

// GET /projects/:id - 단건 조회 (공개)
app.get("/:id", async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  logger.info({ operation: "project.get", id }, "getting project");

  const project = await prisma.project.findUnique({
    where: { id },
    include: projectRelations,
  });

  if (!project) {
    logger.warn({ operation: "project.get", id }, "project not found");

    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  const { posts, stacks, awards, ...rest } = project;

  return c.json({
    ok: true,
    data: {
      ...rest,
      techStack: parseTechStack(stacks),
      relatedPosts: posts.map((relation) => parseRelatedPost(relation.post)),
      awards,
    },
  });
});

// POST /projects - 생성 (인증 필요)
app.post("/", requireAuth, async (c) => {
  const logger = c.get("logger");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validateProjectCreate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const data = body as Record<string, unknown>;

  logger.info({ operation: "project.create", title: data.title }, "creating project");

  const relatedPostIds = normalizeIds(data.relatedPostIds);
  if (!(await validateRelatedPostIds(relatedPostIds))) {
    return c.json({ ok: false, message: "Related post not found" }, 400);
  }

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        title: data.title as string,
        description: data.description as string,
        content: (data.content as string) ?? null,
        thumbnailUrl: (data.thumbnailUrl as string) ?? null,
        githubUrl: (data.githubUrl as string) ?? null,
        deployUrl: (data.deployUrl as string) ?? null,
        startDate: new Date(data.startDate as string),
        endDate: data.endDate ? new Date(data.endDate as string) : null,
      },
      include: { stacks: { include: { stack: true } } },
    });

    if (Array.isArray(data.techStack)) {
      await replaceProjectStacks(
        tx as unknown as typeof prisma,
        created.id,
        data.techStack as string[],
      );
    }
    await replaceProjectPosts(tx as unknown as typeof prisma, created.id, relatedPostIds);

    return created;
  });

  const createdTechStack = Array.isArray(data.techStack)
    ? data.techStack
    : parseTechStack(project.stacks);

  logger.info(
    { operation: "project.create", id: project.id, title: project.title },
    "project created",
  );

  return c.json(
    {
      ok: true,
      data: {
        ...project,
        techStack: createdTechStack,
        relatedPosts: [],
        awards: [],
      },
    },
    201,
  );
});

// PUT /projects/:id - 수정 (인증 필요)
app.put("/:id", requireAuth, async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validateProjectUpdate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const data = body as Record<string, unknown>;

  logger.info({ operation: "project.update", id, title: data.title }, "updating project");

  const relatedPostIds = normalizeIds(data.relatedPostIds);
  if (
    data.relatedPostIds !== undefined &&
    !(await validateRelatedPostIds(relatedPostIds))
  ) {
    return c.json({ ok: false, message: "Related post not found" }, 400);
  }

  const existing = await prisma.project.findUnique({
    where: { id },
    include: { stacks: { include: { stack: true } } },
  });

  if (!existing) {
    logger.warn({ operation: "project.update", id }, "project not found");

    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  const project = await prisma.$transaction(async (tx) => {
    const updated = await tx.project.update({
      where: { id },
      data: {
        title: (data.title as string) ?? existing.title,
        description: (data.description as string) ?? existing.description,
        content:
          data.content !== undefined ? (data.content as string | null) : existing.content,
        thumbnailUrl:
          data.thumbnailUrl !== undefined
            ? (data.thumbnailUrl as string | null)
            : existing.thumbnailUrl,
        githubUrl:
          data.githubUrl !== undefined
            ? (data.githubUrl as string | null)
            : existing.githubUrl,
        deployUrl:
          data.deployUrl !== undefined
            ? (data.deployUrl as string | null)
            : existing.deployUrl,
        startDate: data.startDate
          ? new Date(data.startDate as string)
          : existing.startDate,
        endDate:
          data.endDate !== undefined
            ? data.endDate
              ? new Date(data.endDate as string)
              : null
            : existing.endDate,
      },
      include: { stacks: { include: { stack: true } } },
    });

    if (Array.isArray(data.techStack)) {
      await replaceProjectStacks(
        tx as unknown as typeof prisma,
        updated.id,
        data.techStack as string[],
      );
    }
    if (data.relatedPostIds !== undefined) {
      await replaceProjectPosts(
        tx as unknown as typeof prisma,
        updated.id,
        relatedPostIds,
      );
    }

    return updated;
  });

  const updatedTechStack = Array.isArray(data.techStack)
    ? data.techStack
    : parseTechStack(project.stacks);

  logger.info(
    { operation: "project.update", id: project.id, title: project.title },
    "project updated",
  );

  return c.json({
    ok: true,
    data: { ...project, techStack: updatedTechStack },
  });
});

// DELETE /projects/:id - 삭제 (인증 필요)
app.delete("/:id", requireAuth, async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  logger.info({ operation: "project.delete", id }, "deleting project");

  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    logger.warn({ operation: "project.delete", id }, "project not found");

    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  await prisma.project.delete({ where: { id } });

  logger.info(
    { operation: "project.delete", id: existing.id, title: existing.title },
    "project deleted",
  );

  return c.json({ ok: true, message: "Project deleted" });
});

export default app;
