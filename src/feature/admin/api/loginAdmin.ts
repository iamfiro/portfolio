import { ApiMessageResponse } from "@/shared/types/api";

interface LoginAdminPayload {
  password: string;
}

export async function loginAdmin({ password }: LoginAdminPayload) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error(
      "비밀번호가 올바르지 않거나 서버 설정이 올바르지 않습니다.",
    );
  }

  return (await response.json()) as ApiMessageResponse;
}
