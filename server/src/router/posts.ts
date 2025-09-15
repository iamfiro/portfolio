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

app.get("/post/:title", (c) => {
  const title = c.req.param("title");

  const post = getPost(title);

  return c.json({
    ok: true,
    data: post,
  });
});

export default app;
