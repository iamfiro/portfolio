export interface TitleSceneState {
  /** 장면 시작부터 흐른 시간(초). 모든 움직임이 이 시계 하나로 정해진다 */
  clock: number;
}

/** 이름 한 조각이 놓이는 자리 */
export interface TitlePlacement {
  size: number;
  x: number;
  baseline: number;
  align: "left" | "center" | "right";
}

/** 화면 비율마다 짠 타이틀 구도 */
export interface TitleLayout {
  /** 화면 폭을 꽉 채운 Sung */
  fill: TitlePlacement;
  sung: TitlePlacement;
  ju: TitlePlacement;
  cho: TitlePlacement;
  /** Sung·ju 줄이 위로 밀려 무대 밖으로 나가는 거리 */
  lift: number;
  /** Cho가 무대 아래에서 출발하는 거리 */
  rise: number;
  /** o 확대의 중심(o 왼쪽 굵은 획 한가운데) */
  zoomOrigin: [number, number];
}
