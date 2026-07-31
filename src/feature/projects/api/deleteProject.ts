import { del } from "@/shared/lib/api";
import { ApiMessageResponse } from "@/shared/types/api";

export async function deleteProject(id: string): Promise<ApiMessageResponse> {
  return del<ApiMessageResponse>(`/projects/${id}`);
}
