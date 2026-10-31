import type { CSSProperties } from "react";

import type { BlobPlacement, HeroBlob } from "./hero.type";

// 배열 순서가 곧 쌓이는 순서다. 뒤에 올수록 앞에 그려진다
export const HERO_BLOBS: HeroBlob[] = [
  {
    id: "purple",
    shape: "blossom",
    tone: "purple",
    face: "happy",
    rotate: -12,
    desktop: { left: 84, top: 40, size: 20 },
    mobile: { left: 70, top: 44, size: 32 },
  },
  {
    id: "blue",
    shape: "squircle",
    tone: "blue",
    face: "dot",
    rotate: 12,
    desktop: { left: 69, top: 64, size: 24 },
    mobile: { left: 66, top: 76, size: 46 },
  },
  {
    id: "yellow",
    shape: "arch",
    tone: "yellow",
    face: "happy",
    rotate: -4,
    desktop: { left: 48, top: 60, size: 22 },
    mobile: { left: 40, top: 70, size: 40 },
  },
  {
    id: "sunset",
    shape: "circle",
    tone: "sunset",
    face: "dot",
    rotate: 0,
    desktop: { left: 67, top: 11, size: 25 },
    mobile: { left: 36, top: 46, size: 50 },
  },
  {
    id: "brand",
    shape: "circle",
    tone: "brand",
    face: "wink",
    rotate: 8,
    desktop: { left: 30, top: 52, size: 22 },
    mobile: { left: -10, top: 56, size: 44 },
  },
  {
    id: "ink",
    shape: "circle",
    tone: "ink",
    face: "happy",
    rotate: -6,
    desktop: { left: 13, top: 67, size: 24 },
    mobile: { left: 12, top: 80, size: 44 },
  },
  {
    id: "pink",
    shape: "squircle",
    tone: "pink",
    face: "happy",
    rotate: -14,
    desktop: { left: -5, top: 50, size: 26 },
    mobile: { left: -20, top: 74, size: 46 },
  },
  {
    id: "green",
    shape: "squircle",
    tone: "green",
    face: "dot",
    rotate: 18,
    desktop: { left: 55, top: 44, size: 11 },
    mobile: { left: 4, top: 46, size: 20 },
  },
];

// 낮고 넓은 화면에서 vw만 따르면 덩어리가 화면을 다 덮어 높이로도 상한을 건다
const SIZE_HEIGHT_RATIO = 1.7;

const toSize = (size: number) =>
  `min(${size}vw, ${size * SIZE_HEIGHT_RATIO}svh)`;

const toVariables = (prefix: string, { left, top, size }: BlobPlacement) => ({
  [`--${prefix}-left`]: `${left}%`,
  [`--${prefix}-top`]: `${top}%`,
  [`--${prefix}-size`]: toSize(size),
});

/** 화면 크기별 위치를 CSS 변수로 넘겨 미디어 쿼리가 고르게 한다 */
export function toPlacementStyle({ desktop, mobile }: HeroBlob) {
  return {
    ...toVariables("desktop", desktop),
    ...toVariables("mobile", mobile),
  } as CSSProperties;
}
