import { del } from "@/shared/lib/api";
import { ApiMessageResponse } from "@/shared/types/api";

export async function deleteAward(id: string): Promise<ApiMessageResponse> {
  return del<ApiMessageResponse>(`/awards/${id}`);
}
