import { useEffect } from "react";

import type { ReelTempo, ShowreelController } from "../showreel.type";
import { beatsToSeconds, frames } from "../utils/music.util";

interface DevParams {
  /** ?reel=장면id — 그 장면 하나만 반복한다 */
  solo: string | null;
  /** ?reel-at=초|장면id — 그 자리에서 시작한다 */
  at: string | null;
}

/** 개발 서버에서만 주소창 파라미터로 쇼릴을 원하는 자리부터 본다 */
export function readShowreelDevParams(): DevParams {
  if (!import.meta.env.DEV) return { solo: null, at: null };

  const params = new URLSearchParams(window.location.search);
  return { solo: params.get("reel"), at: params.get("reel-at") };
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !!target.closest("input, textarea, select, [contenteditable]");

/**
 * 개발 서버에서만 키보드로 쇼릴을 다룬다.
 * Space 멈춤/재생 · ←/→ 한 프레임 · Shift+←/→ 한 박 · [ ] 이전/다음 장면 · 0 처음으로
 */
export function useShowreelDevControls(
  controller: ShowreelController | null,
  tempo: ReelTempo,
  startAt: string | null,
) {
  useEffect(() => {
    if (!import.meta.env.DEV || !controller) return;

    if (startAt) {
      const slot = controller.slots.find(({ id }) => id === startAt);
      const seconds = slot ? slot.start : Number(startAt);
      if (Number.isFinite(seconds)) controller.seek(seconds);
    }

    const sceneStartFrom = (direction: 1 | -1) => {
      const time = controller.time();
      const starts = controller.slots.map(({ start }) => start);
      // 장면 첫머리 근처에서 [를 누르면 바로 앞 장면으로 간다
      const current = starts.filter((start) => start <= time + 0.05).length - 1;
      const index = (current + direction + starts.length) % starts.length;
      return direction === -1 && time - starts[current] > 0.1
        ? starts[current]
        : starts[index];
    };

    const handleKey = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return;

      const step = event.shiftKey ? beatsToSeconds(1, tempo) : frames(1);
      switch (event.key) {
        case " ":
          if (controller.isHeld()) controller.release();
          else controller.hold();
          break;
        case "ArrowRight":
          controller.hold();
          controller.seek(controller.time() + step);
          break;
        case "ArrowLeft":
          controller.hold();
          controller.seek(controller.time() - step);
          break;
        case "]":
          controller.seek(sceneStartFrom(1));
          break;
        case "[":
          controller.seek(sceneStartFrom(-1));
          break;
        case "0":
          controller.seek(0);
          break;
        default:
          return;
      }
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [controller, tempo, startAt]);
}
