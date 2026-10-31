import { useMotionValue } from "framer-motion";
import { type RefObject, useEffect } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * 스티키 섹션을 지나가는 진행도(0~1)를 직접 계산한다.
 * - progress: 실제 스크롤을 그대로 따른다
 * - fillProgress: 오르기만 해서, 한 번 채워진 연출이 다시 흐려지지 않는다
 */
export function useLatchedProgress<T extends HTMLElement>(
  targetRef: RefObject<T>,
) {
  const progress = useMotionValue(0);
  const fillProgress = useMotionValue(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const target = targetRef.current;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const latest = distance > 0 ? clamp01(-rect.top / distance) : 1;

      progress.set(latest);
      if (latest > fillProgress.get()) fillProgress.set(latest);
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
  }, [fillProgress, progress, targetRef]);

  return { progress, fillProgress };
}
