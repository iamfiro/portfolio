import { beatsToSeconds, SHOWREEL_MUSIC } from "./music.util";

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

/** cubic-bezier(x1, y1, x2, y2) 곡선. CSS와 같은 곡선을 시간 → 진행도 함수로 만든다 */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (s: number) => ((ax * s + bx) * s + cx) * s;
  const sampleY = (s: number) => ((ay * s + by) * s + cy) * s;
  const slopeX = (s: number) => (3 * ax * s + 2 * bx) * s + cx;

  const solve = (x: number) => {
    let s = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(s) - x;
      if (Math.abs(error) < 1e-6) return s;
      const slope = slopeX(s);
      if (Math.abs(slope) < 1e-6) break;
      s -= error / slope;
    }
    // 뉴턴법이 멈추면 반으로 나눠 찾는다
    let low = 0;
    let high = 1;
    s = x;
    for (let i = 0; i < 40; i++) {
      const value = sampleX(s);
      if (Math.abs(value - x) < 1e-6) break;
      if (value < x) low = s;
      else high = s;
      s = (low + high) / 2;
    }
    return s;
  };

  return (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : sampleY(solve(t)));
}

/**
 * 쇼릴이 쓰는 이징은 셋뿐이다.
 * snap은 주 이동(크기·자리 바꿈), expoOut은 등장, linear는 hold 중 아주 느린 흘림.
 */
export const EASE = {
  snap: cubicBezier(0.7, 0, 0.2, 1),
  expoOut: cubicBezier(0.16, 1, 0.3, 1),
  linear: clamp01,
} as const;

/** 한 박(초) */
export const BEAT = beatsToSeconds(1, SHOWREEL_MUSIC.tempo);

/** 주 이동 길이(초). 한 박이라 다음 박에 정확히 멈춘다 */
export const SNAP_SECONDS = BEAT;
/** 등장 길이(초) */
export const REVEAL_SECONDS = 0.45;
/** 글자마다 등장이 늦춰지는 간격(초) */
export const STAGGER_SECONDS = 0.03;
/** 반전 플래시 길이(초, 24fps 두 프레임) */
export const FLASH_SECONDS = 2 / 24;

/** clock(초)이 start박부터 seconds초 동안 지난 비율(0~1) */
export function progress(clock: number, startBeat: number, seconds: number) {
  return clamp01((clock - startBeat * BEAT) / seconds);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function lerpBox<T extends readonly number[]>(
  from: T,
  to: T,
  t: number,
) {
  return from.map((value, i) => lerp(value, to[i], t)) as unknown as T;
}
