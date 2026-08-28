import { ApiError } from "./api-error";

const BASE_URL = import.meta.env.VITE_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * URL path segment를 안전하게 인코딩한다.
 * 이미 인코딩된 문자열은 이중 인코딩을 방지하기 위해 decode 후 encode 한다.
 */
function encodePathSegment(segment: string): string {
  return encodeURIComponent(decodeURIComponent(segment));
}

/**
 * path의 각 segment를 인코딩한다.
 * 첫 '/' 이전의 빈 문자열을 무시하고, 각 segment를 개별 인코딩한다.
 */
function encodePath(path: string): string {
  return path
    .split("/")
    .map((segment) => (segment === "" ? "" : encodePathSegment(segment)))
    .join("/");
}

/**
 * 응답이 유효한 JSON 객체인지 최소 런타임 검증한다.
 * null이 아닌 object를 반환하면 유효한 JSON response로 본다.
 */
function assertJsonObject(data: unknown): asserts data is Record<string, unknown> {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new ApiError(0, data, "서버 응답이 유효한 JSON 객체가 아닙니다.");
  }
}

/**
 * 공통 API fetch 래퍼.
 * - credentials: include (쿠키 기반 세션)
 * - response.ok 확인
 * - JSON 파싱 + 최소 런타임 검증
 * - 일관된 ApiError throw
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers } = options;

  const url = `${BASE_URL}${encodePath(path)}`;

  const fetchOptions: RequestInit = {
    method,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, fetchOptions);

  // 204 No Content 등 body 없는 성공 응답 처리
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, null, `요청 실패 (${response.status})`);
    }
    throw new ApiError(response.status, null, "서버 응답을 JSON으로 파싱할 수 없습니다.");
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as Record<string, unknown>).message)
        : `요청 실패 (${response.status})`;
    throw new ApiError(response.status, data, message);
  }

  assertJsonObject(data);

  return data as T;
}

/** GET 요청 */
export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

/** POST 요청 */
export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body });
}

/** PUT 요청 */
export function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body });
}

/** DELETE 요청 */
export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
