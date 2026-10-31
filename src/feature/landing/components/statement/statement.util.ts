import {
  BookOpen,
  ChartColumn,
  Cloud,
  Database,
  Lightbulb,
  type LucideIcon,
  MessageCircle,
  MousePointerClick,
  PenTool,
  Rocket,
  Search,
  Server,
} from "lucide-react";

import type { BubbleSize, BubbleTone } from "../icon-bubble/icon-bubble.type";

/** 스크롤에 따라 한 단어씩 채워지는 큰 문장 */
export const STATEMENT_HEADLINE =
  "사용자의 문제를 데이터로 읽고 해결책을 설계해 기획부터 인프라까지 직접 만듭니다.";

/** 큰 문장이 다 채워지는 스크롤 진행도. 남은 구간은 완성된 문장을 보여 준다 */
export const FILL_END = 0.8;

/** 단어가 채워지며 아래에서 떠오르는 거리와 풀리는 흐림 */
export const WORD_RISE = "0.32em";
export const WORD_BLUR = "blur(6px)";

/** 아직 채워지지 않은 단어의 진하기 */
export const DIM_OPACITY = 0.14;

/** 스크롤 값을 따라가되 살짝 튕기며 멈추는 스프링 */
export const POP_SPRING = { stiffness: 420, damping: 16, mass: 0.6 };

/**
 * index번째 단어가 흐린 색에서 진한 색으로 바뀌는 스크롤 구간 [시작, 끝]을 돌려준다.
 * 값은 0(섹션 진입) ~ FILL_END(문장 완성) 사이여야 한다.
 */
export function wordRange(index: number, total: number): [number, number] {
  // 앞 단어가 다 채워지기 전에 다음 단어가 시작되도록 구간을 겹친다
  const step = FILL_END / total;
  const start = index * step;
  return [start, Math.min(FILL_END, start + step * 1.8)];
}

export interface StatementHighlight {
  tone: BubbleTone;
  icon: LucideIcon;
}

/** 형광펜이 칠해지고 아이콘이 튀어나오는 핵심 단어 */
export const STATEMENT_HIGHLIGHTS: Record<string, StatementHighlight> = {
  문제를: { tone: "pink", icon: MessageCircle },
  데이터로: { tone: "blue", icon: ChartColumn },
  해결책을: { tone: "yellow", icon: Lightbulb },
  기획부터: { tone: "purple", icon: PenTool },
  인프라까지: { tone: "green", icon: Server },
};

export interface StatementBubble {
  icon: LucideIcon;
  tone: BubbleTone;
  size: BubbleSize;
  /** 섹션 안 위치(%) */
  left: string;
  top: string;
  /** 이 진행도를 지나면 튀어나온다 */
  appearAt: number;
  /** 스크롤 시차 깊이. 클수록 더 많이 흘러간다 */
  depth: number;
}

/** 문장 둘레에 흩어져 떠다니는 장식 버블 */
export const STATEMENT_BUBBLES: StatementBubble[] = [
  {
    icon: Search,
    tone: "blue",
    size: "lg",
    left: "9%",
    top: "24%",
    appearAt: 0.04,
    depth: 1,
  },
  {
    icon: Rocket,
    tone: "yellow",
    size: "md",
    left: "88%",
    top: "22%",
    appearAt: 0.12,
    depth: 0.6,
  },
  {
    icon: Database,
    tone: "green",
    size: "md",
    left: "4%",
    top: "56%",
    appearAt: 0.22,
    depth: 0.8,
  },
  {
    icon: MousePointerClick,
    tone: "pink",
    size: "lg",
    left: "90%",
    top: "48%",
    appearAt: 0.32,
    depth: 1.2,
  },
  {
    icon: BookOpen,
    tone: "purple",
    size: "md",
    left: "16%",
    top: "84%",
    appearAt: 0.44,
    depth: 0.7,
  },
  {
    icon: Cloud,
    tone: "blue",
    size: "md",
    left: "78%",
    top: "82%",
    appearAt: 0.56,
    depth: 1,
  },
  {
    icon: Lightbulb,
    tone: "yellow",
    size: "sm",
    left: "32%",
    top: "20%",
    appearAt: 0.64,
    depth: 0.5,
  },
  {
    icon: ChartColumn,
    tone: "purple",
    size: "sm",
    left: "64%",
    top: "84%",
    appearAt: 0.72,
    depth: 0.9,
  },
];
