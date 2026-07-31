import { PostMutationPayload, PostResponse } from "@/feature/blog/schema";
import { post } from "@/shared/lib/api";

export function createPost(payload: PostMutationPayload): Promise<PostResponse> {
  return post<PostResponse>("/blog/posts", payload);
}
