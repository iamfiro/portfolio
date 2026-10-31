import type { CSSProperties } from "react";

import type {
  SectionMascotKey,
  SectionMascotPlacement,
  SectionMascotSpot,
} from "./section-mascots.type";

// 섹션 머리(SectionHead)에 붙는 자리는 머리 상자 기준, 나머지는 섹션 기준이다
export const SECTION_MASCOT_SPOTS: Record<
  SectionMascotKey,
  SectionMascotSpot[]
> = {
  // 떠다니는 버블이 비워 둔 오른쪽 위와 아래 가운데
  statement: [
    {
      id: "statement-sun",
      shape: "circle",
      tone: "sunset",
      face: "dot",
      rotate: -8,
      size: "lg",
      top: "9%",
      right: "22%",
    },
    {
      id: "statement-pink",
      shape: "blossom",
      tone: "pink",
      face: "wink",
      rotate: 12,
      size: "sm",
      bottom: "7%",
      left: "45%",
      hideOnMobile: true,
    },
  ],
  projects: [
    {
      id: "projects-blue",
      shape: "squircle",
      tone: "blue",
      face: "dot",
      rotate: 10,
      size: "md",
      top: "30%",
      right: "10%",
    },
  ],
  awards: [
    {
      id: "awards-brand",
      shape: "circle",
      tone: "brand",
      face: "wink",
      rotate: -8,
      size: "md",
      top: "34%",
      left: "10%",
    },
    {
      id: "awards-yellow",
      shape: "blossom",
      tone: "yellow",
      face: "happy",
      rotate: 14,
      size: "sm",
      top: "22%",
      left: "17%",
      hideOnMobile: true,
    },
  ],
  activities: [
    {
      id: "activities-purple",
      shape: "blossom",
      tone: "purple",
      face: "happy",
      rotate: 8,
      size: "md",
      top: "32%",
      right: "11%",
    },
  ],
  techStack: [
    {
      id: "stack-green",
      shape: "squircle",
      tone: "green",
      face: "dot",
      rotate: -12,
      size: "md",
      top: "30%",
      left: "11%",
    },
  ],
  blog: [
    {
      id: "blog-ink",
      shape: "circle",
      tone: "ink",
      face: "happy",
      rotate: 6,
      size: "md",
      top: "28%",
      right: "10%",
    },
    {
      id: "blog-pink",
      shape: "squircle",
      tone: "pink",
      face: "dot",
      rotate: -14,
      size: "sm",
      top: "52%",
      right: "17%",
      hideOnMobile: true,
    },
  ],
};

const toVariables = (
  prefix: string,
  { top, left, right, bottom }: SectionMascotPlacement,
) => ({
  [`--${prefix}-top`]: top ?? "auto",
  [`--${prefix}-left`]: left ?? "auto",
  [`--${prefix}-right`]: right ?? "auto",
  [`--${prefix}-bottom`]: bottom ?? "auto",
});

/** 자리 값을 CSS 변수로 넘긴다. 없는 쪽은 auto로 남고, 좁은 화면 자리는 따로 둔다 */
export function toSpotStyle(spot: SectionMascotSpot) {
  return {
    ...toVariables("spot", spot),
    ...toVariables("spot-mobile", spot.mobile ?? spot),
  } as CSSProperties;
}
