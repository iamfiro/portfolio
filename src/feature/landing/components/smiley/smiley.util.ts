import type { TargetAndTransition, Variants } from "framer-motion";

import type {
  SmileyEye,
  SmileyFace,
  SmileyMood,
  SmileyMoodSignals,
  SmileyShape,
  SmileyShapePath,
} from "./smiley.type";

const BLOSSOM_LOBES = 10;
const BLOSSOM_RADIUS = 42;

/** 원 둘레를 따라 바깥으로 볼록한 호를 이어 붙인 꽃잎 모양 */
function buildBlossomPath() {
  const chord = BLOSSOM_RADIUS * Math.sin(Math.PI / BLOSSOM_LOBES);
  const bulge = (chord * 1.04).toFixed(2);
  const points = Array.from({ length: BLOSSOM_LOBES + 1 }, (_, index) => {
    const angle = (index / BLOSSOM_LOBES) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + BLOSSOM_RADIUS * Math.cos(angle);
    const y = 50 + BLOSSOM_RADIUS * Math.sin(angle);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  const [start, ...rest] = points;
  const arcs = rest.map((point) => `A${bulge} ${bulge} 0 0 1 ${point}`);
  return `M${start} ${arcs.join(" ")}Z`;
}

export const SMILEY_SHAPES: Record<SmileyShape, SmileyShapePath> = {
  circle: {
    d: "M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z",
    height: 100,
  },
  squircle: {
    d: "M50 0C88 0 100 12 100 50C100 88 88 100 50 100C12 100 0 88 0 50C0 12 12 0 50 0Z",
    height: 100,
  },
  // 위는 반원, 아래로 길게 이어져 화면 밖까지 내려가는 아치
  arch: {
    d: "M0 50A50 50 0 0 1 100 50V160H0Z",
    height: 160,
  },
  blossom: {
    d: buildBlossomPath(),
    height: 100,
  },
};

export const SMILEY_EYES: Record<SmileyFace, SmileyEye[]> = {
  happy: [
    { kind: "arc", d: "M30 42Q36 34 42 41" },
    { kind: "arc", d: "M58 41Q64 34 70 42" },
  ],
  dot: [
    { kind: "dot", cx: 39, cy: 40 },
    { kind: "dot", cx: 61, cy: 40 },
  ],
  wink: [
    { kind: "dot", cx: 39, cy: 40 },
    { kind: "arc", d: "M55 41Q61 34 67 41" },
  ],
};

const MOOD_SPRING = { type: "spring", stiffness: 380, damping: 22 } as const;

/**
 * 입은 같은 곡선을 갔다가 되돌아오는 닫힌 경로라 웃는 선과 동그란 입이
 * 같은 명령 구조를 가진다. 그래서 표정끼리 d를 그대로 보간할 수 있다
 */
export const MOUTH_VARIANTS: Record<SmileyMood, TargetAndTransition> = {
  rest: {
    d: "M31 55C38 69 62 69 69 55C62 69 38 69 31 55",
    transition: MOOD_SPRING,
  },
  grin: {
    d: "M27 52C35 76 65 76 73 52C65 76 35 76 27 52",
    transition: MOOD_SPRING,
  },
  surprised: {
    d: "M43 61C43 51 57 51 57 61C57 71 43 71 43 61",
    transition: MOOD_SPRING,
  },
  // 잠든 입은 작게 벌린 동그라미. 감은 눈과 모양이 겹치지 않게 한다
  sleepy: {
    d: "M46 61C46 56 54 56 54 61C54 66 46 66 46 61",
    transition: MOOD_SPRING,
  },
  // 물결치는 입. 어지러울 때
  dizzy: {
    d: "M33 60C42 50 58 70 67 60C58 70 42 50 33 60",
    transition: MOOD_SPRING,
  },
};

export const EYES_VARIANTS: Variants = {
  rest: { scale: 1, opacity: 1, y: 0, transition: MOOD_SPRING },
  grin: { scale: 1.05, opacity: 1, y: -1, transition: MOOD_SPRING },
  surprised: { scale: 1.3, opacity: 1, y: -3, transition: MOOD_SPRING },
  // 뜬 눈을 납작하게 누르지 않고, 감은 눈(◡)과 자리를 바꾼다
  sleepy: { scale: 0.6, opacity: 0, y: 0, transition: { duration: 0.3 } },
  dizzy: { scale: 0, opacity: 1, y: 0, transition: MOOD_SPRING },
};

/** 여러 신호 중 위에 있는 것이 먼저 이겨 표정 하나로 정해진다 */
export function resolveMood(signals: SmileyMoodSignals): SmileyMood {
  if (signals.dizzy) return "dizzy";
  if (signals.dragging) return "surprised";
  if (signals.hovered) return "grin";
  if (signals.startled) return "surprised";
  if (signals.sleepy) return "sleepy";
  return "rest";
}

const SPIRAL_STEP = 2.1;
const SPIRAL_TURNS = 4;

/** 눈 자리에 그리는 소용돌이. 반원을 점점 크게 이어 붙인다 */
function buildSpiralPath(cx: number, cy: number) {
  const arcs = Array.from({ length: SPIRAL_TURNS }, (_, index) => {
    const radius = SPIRAL_STEP * (index + 1);
    const dx = radius * 2 * (index % 2 === 0 ? 1 : -1);
    return `a${radius} ${radius} 0 0 1 ${dx} 0`;
  });
  return `M${cx - SPIRAL_STEP / 2} ${cy} ${arcs.join(" ")}`;
}

export const DIZZY_EYES = [buildSpiralPath(39, 40), buildSpiralPath(61, 40)];

export const SPIRAL_VARIANTS: Variants = {
  rest: { scale: 0, rotate: 0, transition: MOOD_SPRING },
  dizzy: {
    scale: 1,
    rotate: 360,
    transition: {
      scale: MOOD_SPRING,
      rotate: { duration: 0.9, ease: "linear", repeat: Infinity },
    },
  },
};

/** 잠들었을 때의 감은 눈. 아래로 둥근 호라 편안하게 감은 모양이 된다 */
export const SLEEPING_EYES = ["M32 40Q39 47 46 40", "M54 40Q61 47 68 40"];

// 감길 때 호가 한쪽 끝에서 그려지며 스르르 감긴다
export const SLEEPING_EYE_VARIANTS: Variants = {
  awake: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
  sleepy: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
  },
};
