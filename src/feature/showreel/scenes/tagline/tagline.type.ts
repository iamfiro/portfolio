import type { ReelBox } from "@/feature/showreel/stage.type";

export interface TaglineSceneState {
  clock: number;
}

export interface TaglineLine {
  text: string;
  baseline: number;
  /** 올라오기 시작하는 박 */
  start: number;
}

export interface TaglineLayout {
  lines: TaglineLine[];
  size: number;
  x: number;
  /** 배경이 접혀 닿는 막대(다음 장면 스크린 프레임의 아랫변) */
  bar: ReelBox;
}
