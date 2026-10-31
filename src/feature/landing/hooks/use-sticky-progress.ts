import { useMotionValue } from "framer-motion";
import { type RefObject, useEffect } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * 스티키 섹션을 지나가는 진행도(0~1)를 직접 계산한다.
 * 실제 스크롤을 그대로 따라, 위로 올리면 올린 만큼 연출도 되감긴다
 */
export function useStickyProgress<T extends HTMLElement>(
  targetRef: RefObject<T>,
) {
  const progress = useMotionValue(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const target = targetRef.current;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      progress.set(distance > 0 ? clamp01(-rect.top / distance) : 1);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [progress, targetRef]);

  return progress;
}
