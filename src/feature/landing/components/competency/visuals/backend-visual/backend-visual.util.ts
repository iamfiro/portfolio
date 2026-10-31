export type BackendTarget = "redis" | "mysql";

/** 노드 위치(%). 선과 요청 점이 같은 좌표를 쓴다 */
export const NODE_POSITION = {
  app: { x: 14, y: 50 },
  api: { x: 46, y: 50 },
  redis: { x: 84, y: 26 },
  mysql: { x: 84, y: 74 },
} as const;

/** 요청마다 닿는 곳. 대부분은 캐시에서 끝나고 가끔 DB까지 내려간다 */
export const REQUEST_TARGETS: BackendTarget[] = ["redis", "redis", "mysql"];

export const TARGET_CAPTION: Record<BackendTarget, string> = {
  redis: "캐시에서 바로 응답",
  mysql: "DB에서 조회 후 캐싱",
};

/** 요청 점이 앱에서 목적지까지 가는 시간(초) */
export const TRAVEL_SECONDS = 1.1;
