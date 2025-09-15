import { Hono } from "hono";

import { getPost, getPosts } from "../utils/post.js";

const app = new Hono();

app.get("/posts", (c) => {
  const posts = getPosts();
  return c.json({
    ok: true,
    data: posts,
  });
});

app.get("/post/:title", async (c) => {
  const title = c.req.param("title");

  // 2초 지연
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const post = getPost(title);

  return c.json({
    ok: true,
    data: post,
  });
});

export default app;
