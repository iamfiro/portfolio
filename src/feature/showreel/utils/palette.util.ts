import type { ReelColor } from "../stage.type";

import { hexToRgb } from "./gl.util";

/**
 * 쇼릴 색. 검정·흰색에 포인트 한 색(줄무늬 장면의 다홍)을 쓰고,
 * 그라디언트 천은 포인트 계열의 재질로만 마스크 안에 쓴다.
 */
export const REEL_PALETTE = {
  ink: "#0b0b0b",
  white: "#f5f5f5",
  point: "#ec6440",
} as const;

/**
 * 재질의 색 지도. 줄무늬 장면의 노랑 · 주황 · 다홍 · 분홍 · 라벤더 · 살구를 색상 순서대로 한 바퀴 이어
 * 끝이 처음과 같다. 주름마다 이 바퀴의 다른 자리를 세로로 펼쳐 어긋난 그라디언트가 흐른다.
 */
export const REEL_GRADIENT: [position: number, color: string][] = [
  [0, "#f3bc20"],
  [0.16, "#f1922d"],
  [0.3, "#ec6440"],
  [0.46, "#ee62c6"],
  [0.6, "#ab89cd"],
  [0.74, "#dba08b"],
  [0.87, "#ed693d"],
  [1, "#f3bc20"],
];

export const rgba = (hex: string, alpha = 1): ReelColor => [
  ...hexToRgb(hex),
  alpha,
];
