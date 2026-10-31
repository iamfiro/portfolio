import { Code2, PenTool, RefreshCw, Rocket, Search } from "lucide-react";

import type { ProcessStep, Rect } from "./process.type";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "discover",
    phrase: "사용자의 문제를 데이터로 읽고",
    icon: Search,
    tone: "brand",
    imageUrl: "/images/landing/process/01-discover.png",
  },
  {
    id: "design",
    phrase: "해결책을 설계해",
    icon: PenTool,
    tone: "subtle",
  },
  {
    id: "build",
    phrase: "기획부터 인프라까지 직접 만들고",
    icon: Code2,
    tone: "brand",
  },
  {
    id: "launch",
    phrase: "서비스로 내놓은 뒤에도",
    icon: Rocket,
    tone: "info",
  },
  {
    id: "refine",
    phrase: "끝까지 개선하는",
    icon: RefreshCw,
    tone: "danger",
  },
];

/** 마지막 타일 뒤에 붙는 문장 끝 */
export const PROCESS_CLOSING = "개발을 지향합니다.";

// 재생 타이밍(초): 단어는 이 간격으로 차례로 올라오고,
// 타일은 자기 구절의 마지막 단어가 올라오기 시작한 뒤 조금 있다 덱을 떠난다
export const WORD_INTERVAL = 0.14;
const LAUNCH_LAG = 0.12;

/**
 * container 기준 위치를 offset 체인으로 잰다.
 * getBoundingClientRect와 달리 진행 중인 transform에 영향받지 않는다.
 */
export function measureRect(
  element: HTMLElement,
  container: HTMLElement,
): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;

  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return { x, y, size: element.offsetWidth };
}

export type SentenceToken =
  | { kind: "word"; text: string; order: number }
  | { kind: "slot"; stepIndex: number; launchAt: number };

/** order번째 단어가 올라오기 시작하는 시각(초) */
export const wordDelay = (order: number) => order * WORD_INTERVAL;

/**
 * 문장을 단어와 타일 칸으로 쪼갠다.
 * 단어 order는 등장 순서, 칸 launchAt은 그 칸의 타일이 덱을 떠나는 시각(초)이다.
 */
export function buildSentenceTokens(): SentenceToken[] {
  const tokens: SentenceToken[] = [];
  let order = 0;

  PROCESS_STEPS.forEach((step, stepIndex) => {
    step.phrase.split(" ").forEach((text) => {
      tokens.push({ kind: "word", text, order: order++ });
    });
    tokens.push({
      kind: "slot",
      stepIndex,
      launchAt: wordDelay(order - 1) + LAUNCH_LAG,
    });
  });
  PROCESS_CLOSING.split(" ").forEach((text) => {
    tokens.push({ kind: "word", text, order: order++ });
  });

  return tokens;
}

// 덱: 위 화면 가운데에 부채꼴로 겹쳐 쌓인 타일
const DECK_SPREAD = 0.62;
const DECK_TILT = 7;
export const DECK_SCALE = 1.9;

/** i번째 타일이 덱 중심(center) 기준으로 놓이는 위치와 기울기 */
export function deckPose(
  index: number,
  count: number,
  size: number,
  center: { x: number; y: number },
) {
  const offset = index - (count - 1) / 2;
  return {
    x: center.x + offset * size * DECK_SCALE * DECK_SPREAD,
    y: center.y + Math.abs(offset) * size * 0.18,
    rotate: offset * DECK_TILT,
  };
}
