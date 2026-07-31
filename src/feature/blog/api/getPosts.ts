import { PostsResponse } from "@/feature/blog/schema";
import { get } from "@/shared/lib/api";

export function getPosts(): Promise<PostsResponse> {
  return get<PostsResponse>("/blog/posts");
}
