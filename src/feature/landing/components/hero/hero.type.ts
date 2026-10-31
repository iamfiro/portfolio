import type {
  SmileyFace,
  SmileyShape,
  SmileyTone,
} from "../smiley/smiley.type";

export interface BlobPlacement {
  /** 히어로 폭 기준 왼쪽 위치(%) */
  left: number;
  /** 히어로 높이 기준 위쪽 위치(%) */
  top: number;
  /** 폭(vw). 낮고 넓은 화면에선 높이 기준으로 줄어든다 */
  size: number;
}

export interface HeroBlob {
  id: string;
  shape: SmileyShape;
  tone: SmileyTone;
  face: SmileyFace;
  /** 내려앉은 뒤 기울어진 각도(deg) */
  rotate: number;
  desktop: BlobPlacement;
  mobile: BlobPlacement;
}
