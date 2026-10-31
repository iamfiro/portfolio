import type { HeroBlob } from "../hero/hero.type";

export type SectionMascotKey =
  | "statement"
  | "projects"
  | "awards"
  | "activities"
  | "techStack"
  | "blog";

export type SectionMascotSize = "sm" | "md" | "lg";

/** 섹션 안 한 자리에 앉는 스마일. 위치는 놓이는 상자 기준 CSS 길이다 */
export interface SectionMascotSpot
  extends Pick<HeroBlob, "shape" | "tone" | "face" | "rotate"> {
  id: string;
  size: SectionMascotSize;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** 좁은 화면에서 쓸 자리. 주면 네 방향 모두 이 값으로 바뀐다 */
  mobile?: SectionMascotPlacement;
  /** 좁은 화면에선 글자와 겹치므로 뺀다 */
  hideOnMobile?: boolean;
}

export type SectionMascotPlacement = Pick<
  SectionMascotSpot,
  "top" | "left" | "right" | "bottom"
>;
