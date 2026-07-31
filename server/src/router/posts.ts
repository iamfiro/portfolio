import { Hono } from "hono";

import type { Prisma } from "../generated/prisma/client.js";
import { requireAuth } from "../middleware/auth.js";
import type { LoggerEnv } from "../middleware/logging.js";
import prisma from "../utils/prisma.js";
import { validatePostCreate, validatePostUpdate } from "../utils/validation.js";

const app = new Hono<LoggerEnv>();

function parseProject(project: {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: Date;
  endDate: Date | null;
  stacks: Array<{ stack: { name: string } }>;
}) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl,
    githubUrl: project.githubUrl,
    deployUrl: project.deployUrl,
    startDate: project.startDate,
    endDate: project.endDate,
    techStack: project.stacks.map((item) => item.stack.name),
  };
}

const postRelations = {
  projects: {
    include: {
      project: {
        include: { stacks: { include: { stack: true } } },
      },
    },
  },
} as const;

type PostWithRelations = Prisma.PostGetPayload<{
  include: typeof postRelations;
}>;

function parseCategories(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function serializePost(post: PostWithRelations) {
  return {
    id: post.id,
    title: post.title,
    description: post.summary ?? "",
    thumbnail: post.thumbnailUrl ?? "",
    date: post.date,
    tags: parseCategories(post.categories),
    content: post.content ?? "",
    relatedProjects: post.projects.map((relation) => parseProject(relation.project)),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
}

async function validateProjectIds(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const count = await prisma.project.count({ where: { id: { in: ids } } });
  return count === ids.length;
}

async function replacePostProjects(
  tx: typeof prisma,
  postId: string,
  projectIds: string[],
): Promise<void> {
  await tx.postProject.deleteMany({ where: { postId } });
  if (projectIds.length > 0) {
    await tx.postProject.createMany({
      data: projectIds.map((projectId) => ({ postId, projectId })),
    });
  }
}

app.get("/posts", async (c) => {
  const logger = c.get("logger");
  logger.info({ operation: "post.list" }, "listing posts");

  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" },
    include: postRelations,
  });

  return c.json({ ok: true, data: posts.map(serializePost) });
});

app.get("/posts/:id", async (c) => {
  const post = await prisma.post.findUnique({
    where: { id: c.req.param("id") },
    include: postRelations,
  });

  if (!post) {
    return c.json({ ok: false, message: "Post not found" }, 404);
  }

  return c.json({ ok: true, data: serializePost(post) });
});

app.get("/post/:title", async (c) => {
  const title = c.req.param("title");
  const post = await prisma.post.findFirst({
    where: { title },
    include: postRelations,
  });

  if (!post) {
    return c.json({ ok: false, message: "Post not found" }, 404);
  }

  return c.json({ ok: true, data: serializePost(post) });
});

app.post("/posts", requireAuth, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validatePostCreate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const data = body as Record<string, unknown>;
  const projectIds = normalizeIds(data.projectIds);
  if (!(await validateProjectIds(projectIds))) {
    return c.json({ ok: false, message: "Related project not found" }, 400);
  }

  const createdId = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        title: (data.title as string).trim(),
        summary: (data.summary as string | null) ?? null,
        thumbnailUrl: (data.thumbnailUrl as string | null) ?? null,
        date: new Date(data.date as string),
        categories: JSON.stringify(data.categories),
        content: (data.content as string | null) ?? null,
      },
    });
    await replacePostProjects(tx as unknown as typeof prisma, post.id, projectIds);
    return post.id;
  });

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: createdId },
    include: postRelations,
  });

  return c.json({ ok: true, data: serializePost(post) }, 201);
});

app.put("/posts/:id", requireAuth, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, message: "Invalid JSON body" }, 400);
  }

  const validation = validatePostUpdate(body);
  if (!validation.valid) {
    return c.json(
      { ok: false, message: "Validation failed", errors: validation.errors },
      400,
    );
  }

  const id = c.req.param("id") as string;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ ok: false, message: "Post not found" }, 404);
  }

  const data = body as Record<string, unknown>;
  const projectIds = normalizeIds(data.projectIds);
  if (data.projectIds !== undefined && !(await validateProjectIds(projectIds))) {
    return c.json({ ok: false, message: "Related project not found" }, 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id },
      data: {
        title: data.title !== undefined ? (data.title as string).trim() : undefined,
        summary: data.summary !== undefined ? (data.summary as string | null) : undefined,
        thumbnailUrl:
          data.thumbnailUrl !== undefined
            ? (data.thumbnailUrl as string | null)
            : undefined,
        date: data.date !== undefined ? new Date(data.date as string) : undefined,
        categories:
          data.categories !== undefined ? JSON.stringify(data.categories) : undefined,
        content: data.content !== undefined ? (data.content as string | null) : undefined,
      },
    });
    if (data.projectIds !== undefined) {
      await replacePostProjects(tx as unknown as typeof prisma, id, projectIds);
    }
  });

  const post = await prisma.post.findUniqueOrThrow({
    where: { id },
    include: postRelations,
  });
  return c.json({ ok: true, data: serializePost(post) });
});

app.delete("/posts/:id", requireAuth, async (c) => {
  const id = c.req.param("id") as string;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ ok: false, message: "Post not found" }, 404);
  }

  await prisma.post.delete({ where: { id } });
  return c.json({ ok: true, message: "Post deleted" });
});

export default app;
