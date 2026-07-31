import { get } from "@/shared/lib/api";
import { AdminSessionResponse } from "@/shared/types/api";

export async function checkSession(): Promise<AdminSessionResponse> {
  return get<AdminSessionResponse>("/admin/session");
}
