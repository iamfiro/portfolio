import { post } from "@/shared/lib/api";
import { ApiMessageResponse } from "@/shared/types/api";

interface LoginAdminPayload {
  password: string;
}

export async function loginAdmin({
  password,
}: LoginAdminPayload): Promise<ApiMessageResponse> {
  return post<ApiMessageResponse>("/admin/login", { password });
}
