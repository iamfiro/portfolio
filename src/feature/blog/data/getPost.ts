import type { PostResponse } from "@/feature/blog/schema";
import { contentPosts } from "@/shared/content/content";

export function getPost(id: string): Promise<PostResponse> {
  const post = contentPosts.find((item) => item.id === id);
  return Promise.resolve({
    ok: Boolean(post),
    data: post,
  } as PostResponse);
}
