import { PostResponse } from "@/feature/blog/schema";
import { get } from "@/shared/lib/api";

export function getPost(title: string): Promise<PostResponse> {
  return get<PostResponse>(`/blog/post/${title}`);
}
