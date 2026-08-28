import type { PostsResponse } from "@/feature/blog/schema";
import { contentPosts } from "@/shared/content/content";

export function getPosts(): Promise<PostsResponse> {
  return Promise.resolve({ ok: true, data: contentPosts });
}
