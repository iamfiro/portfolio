import { post } from "@/shared/lib/api";
import { ApiMessageResponse } from "@/shared/types/api";

export async function logoutAdmin(): Promise<ApiMessageResponse> {
  return post<ApiMessageResponse>("/admin/logout");
}
