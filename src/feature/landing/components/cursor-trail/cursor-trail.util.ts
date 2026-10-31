import {
  BookOpen,
  Coffee,
  Dumbbell,
  Flower,
  Gamepad2,
  Globe,
  Heart,
  type LucideIcon,
  Music,
  Rocket,
  Smile,
  Trophy,
} from "lucide-react";

import type { BubbleTone } from "../icon-bubble/icon-bubble.type";

import type { TrailParticle } from "./cursor-trail.type";

export const TRAIL_ICONS: LucideIcon[] = [
  BookOpen,
  Coffee,
  Dumbbell,
  Flower,
  Gamepad2,
  Globe,
  Heart,
  Music,
  Rocket,
  Smile,
  Trophy,
];

export const TRAIL_TONES: BubbleTone[] = [
  "yellow",
  "purple",
  "green",
  "blue",
  "pink",
];

/** 마지막으로 찍은 지점에서 이만큼(px) 이상 움직여야 새 버블을 만든다 */
export const TRAIL_SPACING = 28;

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const between = (min: number, max: number) => min + Math.random() * (max - min);

export function createTrailParticle(
  id: number,
  x: number,
  y: number,
): TrailParticle {
  return {
    id,
    x,
    y,
    icon: pick(TRAIL_ICONS),
    tone: pick(TRAIL_TONES),
    scale: between(0.8, 1.15),
    rotate: between(-18, 18),
  };
}

/**
 * 이 속성이 붙은 요소(스티키 히어로를 덮고 올라오는 본문)의 윗선을 기준으로,
 * 그보다 위쪽 = 히어로가 보이는 영역에서는 버블을 만들지 않는다.
 */
const TRAIL_START_ATTRIBUTE = "data-trail-start";

export function isOverHero(y: number): boolean {
  const start = document.querySelector(`[${TRAIL_START_ATTRIBUTE}]`);
  return start !== null && y < start.getBoundingClientRect().top;
}

/** 이 속성이 붙은 요소(푸터)의 윗선부터 아래로는 버블을 만들지 않는다. */
const TRAIL_END_ATTRIBUTE = "data-trail-end";

export function isOverFooter(y: number): boolean {
  const end = document.querySelector(`[${TRAIL_END_ATTRIBUTE}]`);
  return end !== null && y >= end.getBoundingClientRect().top;
}

/** 이 속성이 붙은 요소(수상 목록처럼 호버 카드가 뜨는 영역) 안에서는 버블을 만들지 않는다. */
const TRAIL_OFF_ATTRIBUTE = "data-trail-off";

export function isOverTrailOff(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(`[${TRAIL_OFF_ATTRIBUTE}]`) !== null
  );
}

export function shouldSpawnTrail(distance: number, elapsed: number): boolean {
  // TODO(human)
  return distance >= TRAIL_SPACING || (distance > 0 && elapsed > 120);
}
