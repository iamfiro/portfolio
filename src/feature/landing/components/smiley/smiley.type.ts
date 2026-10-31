export type SmileyShape = "circle" | "squircle" | "arch" | "blossom";

export type SmileyFace = "happy" | "dot" | "wink";

/** 표정. 입 모양과 눈 크기가 함께 바뀐다 */
export type SmileyMood = "rest" | "grin" | "surprised" | "sleepy" | "dizzy";

/** 표정을 정하는 신호들. 없는 신호는 꺼진 것으로 본다 */
export interface SmileyMoodSignals {
  dizzy?: boolean;
  dragging?: boolean;
  hovered?: boolean;
  startled?: boolean;
  sleepy?: boolean;
}

export type SmileyTone =
  | "brand"
  | "pink"
  | "blue"
  | "ink"
  | "yellow"
  | "purple"
  | "green"
  | "sunset";

export type SmileyEye =
  | { kind: "dot"; cx: number; cy: number }
  | { kind: "arc"; d: string };

export interface SmileyShapePath {
  d: string;
  /** viewBox 높이. 폭은 항상 100이고 얼굴 중심은 (50, 50)에 둔다 */
  height: number;
}
