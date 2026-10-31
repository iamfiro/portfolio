/** [램프 위치 0~1, 색] */
export type ReelStop = [position: number, color: string];

/**
 * 24fps 프레임 하나의 레이어 상태. 좌표는 1920×1080 기준 월드 px.
 * 램프는 rampStart에서 시작해 rampSpan 길이로 세로로 깔린다.
 */
export type ReelKey = [
  frame: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  rampStart: number,
  rampSpan: number,
  softX: number,
  softY: number,
];

/** [프레임, 중심 x, 중심 y, 줌, 가로 왜곡, 세로 왜곡] */
export type ReelCameraKey = [
  frame: number,
  centerX: number,
  centerY: number,
  zoom: number,
  warpX: number,
  warpY: number,
];

export interface ReelLayer {
  name: string;
  stops: ReelStop[];
  keys: ReelKey[];
  /** 캡슐 기둥이면 [램프 시작에서 첫 이음매까지 거리, 캡슐 길이] */
  capsule?: [joint: number, period: number];
}

/** GSAP가 프레임마다 써 넣는 레이어 값 */
export interface ReelLayerState {
  visible: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  rampStart: number;
  rampSpan: number;
  softX: number;
  softY: number;
}

export interface ReelCameraState {
  centerX: number;
  centerY: number;
  zoom: number;
  warpX: number;
  warpY: number;
}

export interface LayerSceneState {
  camera: ReelCameraState;
  layers: ReelLayerState[];
}
