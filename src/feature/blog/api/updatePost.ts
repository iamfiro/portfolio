import { PostMutationPayload, PostResponse } from "@/feature/blog/schema";
import { put } from "@/shared/lib/api";

interface UpdatePostPayload {
  id: string;
  payload: Partial<PostMutationPayload>;
}

export function updatePost({ id, payload }: UpdatePostPayload): Promise<PostResponse> {
  return put<PostResponse>(`/blog/posts/${id}`, payload);
}
