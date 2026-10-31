import type { HeroBlob } from "../hero/hero.type";

export const COMPETENCY_HEADLINE_LINES = [
  "아이디어를 동작하는",
  "서비스로 만들어요",
];

/** 카드 위에 그릴 시각화 목업 종류 */
export type CompetencyVisual = "voice" | "prototype" | "iteration";

/** 목업이 올라가는 무대의 파스텔 바탕색 */
export type CompetencyTone = "blue" | "purple" | "orange";

/** 무대 모서리에서 고개를 내미는 스마일. 목업이 비어 있는 쪽 모서리를 고른다 */
export interface CompetencyMascot
  extends Pick<HeroBlob, "shape" | "tone" | "face" | "rotate"> {
  side: "left" | "right";
}

export interface Competency {
  visual: CompetencyVisual;
  tone: CompetencyTone;
  mascot: CompetencyMascot;
  title: string;
  description: string;
}

// 할 수 있는 것을 늘어놓기보다, 어떻게 만드는지를 순서대로 말한다
export const COMPETENCIES: Competency[] = [
  {
    visual: "voice",
    tone: "blue",
    mascot: {
      shape: "squircle",
      tone: "blue",
      face: "dot",
      rotate: -10,
      side: "left",
    },
    title: "불편한 순간을 모아요",
    description:
      "직접 써 보고, 주변에서 들은 '이거 왜 이래?'를 적어 두는 데서 시작해요.",
  },
  {
    visual: "prototype",
    tone: "purple",
    mascot: {
      shape: "blossom",
      tone: "purple",
      face: "happy",
      rotate: 8,
      side: "left",
    },
    title: "작게 만들어 먼저 보여 줘요",
    description:
      "완성될 때까지 기다리지 않아요. 손에 잡히는 화면부터 만들어 같이 보면서 고쳐요.",
  },
  {
    visual: "iteration",
    tone: "orange",
    mascot: {
      shape: "circle",
      tone: "brand",
      face: "wink",
      rotate: -6,
      side: "right",
    },
    title: "내놓은 뒤에도 계속 다듬어요",
    description: "쓰는 모습을 지켜보고 불편이 남은 곳을 찾아, 한 번 더 고쳐요.",
  },
];
