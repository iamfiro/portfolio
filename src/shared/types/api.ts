export { ApiError } from "@/shared/lib/api";

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}
