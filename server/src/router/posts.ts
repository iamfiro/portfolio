import { Hono } from "hono";

import prisma from "../utils/prisma.js";

const app = new Hono();

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

app.get("/posts", async (c) => {
  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" },
    include: {
      projects: {
        include: {
          project: {
            include: { stacks: { include: { stack: true } } },
          },
        },
      },
    },
  });

  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.summary ?? "",
    thumbnail: post.thumbnailUrl ?? "",
    date: post.date,
    tags: JSON.parse(post.categories),
    relatedProjects: post.projects.map((relation) =>
      parseProject(relation.project),
    ),
  }));

  return c.json({ ok: true, data });
});

app.get("/post/:title", async (c) => {
  const title = c.req.param("title");

  const post = await prisma.post.findFirst({
    where: { title },
    include: {
      projects: {
        include: {
          project: {
            include: { stacks: { include: { stack: true } } },
          },
        },
      },
    },
  });

  if (!post) {
    return c.json({ ok: false, message: "Post not found" }, 404);
  }

  const relatedProjects = post.projects.map((relation) =>
    parseProject(relation.project),
  );

  return c.json({
    ok: true,
    data: {
      id: post.id,
      title: post.title,
      description: post.summary ?? "",
      thumbnail: post.thumbnailUrl ?? "",
      date: post.date,
      tags: JSON.parse(post.categories),
      content: post.content ?? "",
      relatedProjects,
    },
  });
});

export default app;
