import { del } from "@/shared/lib/api";
import { ApiMessageResponse } from "@/shared/types/api";

export function deleteStack(id: string): Promise<ApiMessageResponse> {
  return del<ApiMessageResponse>(`/stacks/${id}`);
}
