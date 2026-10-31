/** 프레임 단위 상자 [x0, y0, x1, y1]. 프레임은 높이 1080에 화면 비율만큼의 너비다 */
export type ReelBox = [x0: number, y0: number, x1: number, y1: number];

export type ReelColor = [r: number, g: number, b: number, a: number];

/**
 * 장면이 그리는 프레임과 그리드.
 * 모든 요소의 시작·끝 자리는 column()과 row()로 잡는다.
 */
export interface ReelFrame {
  width: number;
  height: number;
  portrait: boolean;
  columns: number;
  margin: number;
  /** first~last 컬럼(1부터)이 차지하는 가로 구간 */
  column(first: number, last?: number): [number, number];
  /** index번째 베이스라인의 y */
  row(index: number): number;
  /** 헤더를 피한 무대 위쪽 */
  safeTop: number;
  /** 캡션 줄을 피한 무대 아래쪽 */
  stageBottom: number;
  /** 화면 아래 캡션의 기준선 */
  captionBaseline: number;
  /** 화면 픽셀 하나가 프레임 몇 단위인지 */
  pixel: number;
}

/**
 * 글꼴. raster는 거리장 아틀라스에 그리는 크기이고, tracking은 글자 크기에 대한 자간 비율이다.
 * 화면에선 거리장이라 어떤 크기로 키워도 가장자리가 날카롭다.
 */
export interface ReelFont {
  family: string;
  weight: number;
  style: "normal" | "italic";
  raster: number;
  tracking: number;
}

/** normal은 그냥 덮고, invert는 아래를 뒤집는다(흰색이면 아래 색의 반전, difference와 같은 효과) */
export type ReelBlend = "normal" | "invert";

/** 글자 모양 정보(글자 크기 1 기준) */
export interface ReelTextMetrics {
  width: number;
  /** 글자마다 펜 자리(왼쪽 끝 기준) */
  offsets: number[];
  capHeight: number;
  ascent: number;
  descent: number;
}

export interface ReelTextOptions {
  font: string;
  size: number;
  x: number;
  baseline: number;
  align?: "left" | "center" | "right";
  color?: ReelColor;
  /** 이 글자들은 그라디언트 재질로 칠한다 */
  material?: (index: number) => boolean;
  blend?: ReelBlend;
  clip?: ReelBox;
  /** 글자마다 옮길 거리(프레임 단위) */
  shift?: (index: number) => [number, number];
  /** origin을 중심으로 factor배 키운다 */
  zoom?: { origin: [number, number]; factor: number };
}

/** 그림을 상자에 cover로 채울 때 보이는 자리. focus는 그림 안 기준점(0~1), zoom은 그 점 둘레를 확대하는 배율 */
export interface ReelCrop {
  focus: [number, number];
  zoom: number;
}
