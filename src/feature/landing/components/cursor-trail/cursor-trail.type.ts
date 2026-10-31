import type { LucideIcon } from "lucide-react";

import type { BubbleTone } from "../icon-bubble/icon-bubble.type";

export interface TrailParticle {
  id: number;
  x: number;
  y: number;
  icon: LucideIcon;
  tone: BubbleTone;
  /** 기본 크기 대비 배율 */
  scale: number;
  /** 아이콘 기울기(deg) */
  rotate: number;
}
