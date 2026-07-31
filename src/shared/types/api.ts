export { ApiError } from "@/shared/lib/api";

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

export interface ApiMessageResponse {
  ok: boolean;
  message: string;
}

export interface AdminSessionResponse {
  ok: boolean;
  authenticated: boolean;
}
