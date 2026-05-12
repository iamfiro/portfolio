import { Hono } from "hono";

import prisma from "../utils/prisma.js";
import { getPost, getPosts } from "../utils/post.js";

const app = new Hono();

function parseProject(project: {
  id: string;
  title: string;
  description: string;
  techStack: string;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: Date;
  endDate: Date | null;
}) {
  return { ...project, techStack: JSON.parse(project.techStack) };
}

app.get("/posts", async (c) => {
  const posts = getPosts();

  const postRecords = await prisma.post.findMany({
    include: {
      projects: { include: { project: true } },
    },
  });

  const relationsMap = Object.fromEntries(
    postRecords.map((p) => [
      p.slug,
      p.projects.map((r) => parseProject(r.project)),
    ]),
  );

  const data = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      ...post,
      relatedProjects: relationsMap[post.title as string] ?? [],
    }));

  return c.json({ ok: true, data });
});

app.get("/post/:title", async (c) => {
  const title = c.req.param("title");

  const post = getPost(title);

  const postRecord = await prisma.post.findUnique({
    where: { slug: post.title as string },
    include: { projects: { include: { project: true } } },
  });

  const relatedProjects = (postRecord?.projects ?? []).map((r) =>
    parseProject(r.project),
  );

  return c.json({
    ok: true,
    data: { ...post, relatedProjects },
  });
});

export default app;
