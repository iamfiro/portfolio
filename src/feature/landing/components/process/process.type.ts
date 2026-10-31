import type { LucideIcon } from "lucide-react";

export type ProcessTone = "brand" | "inverse" | "info" | "danger" | "subtle";

export interface ProcessStep {
  id: string;
  /** 문장에서 타일 바로 앞에 오는 구절 */
  phrase: string;
  icon: LucideIcon;
  tone: ProcessTone;
  /** 3D 타일 이미지. 없으면 tone 색 면 + icon으로 그린다 */
  imageUrl?: string;
}

/** 섹션 기준 위치·크기 (transform 무시) */
export interface Rect {
  x: number;
  y: number;
  size: number;
}

export interface ProcessLayout {
  /** 문장 속 빈 칸 */
  slots: Rect[];
  /** 위 화면에서 타일 덱이 모이는 중심 */
  deck: { x: number; y: number };
  /** 잴 때마다 증가. 타일을 다시 그리는 key로 쓴다 */
  version: number;
}
