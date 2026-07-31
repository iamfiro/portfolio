import { del } from "@/shared/lib/api";
import { ApiMessageResponse } from "@/shared/types/api";

export function deletePost(id: string): Promise<ApiMessageResponse> {
  return del<ApiMessageResponse>(`/blog/posts/${id}`);
}
