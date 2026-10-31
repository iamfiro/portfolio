import type { ReelBox } from "@/feature/showreel/stage.type";

export interface OutroSceneState {
  clock: number;
}

export interface OutroLayout {
  /** 로고 마크가 놓이는 상자. 앞 장면 타일들이 이리로 모인다 */
  mark: ReelBox;
  markSize: number;
  contact: { baseline: number; size: number };
  caption: { baseline: number };
  center: [number, number];
}
