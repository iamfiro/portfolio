export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

export interface ApiMessageResponse {
  ok: boolean;
  message: string;
}
