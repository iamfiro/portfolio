import type { MotionProps } from "framer-motion";

export const LANDING_EASE = [0.16, 1, 0.3, 1] as const;

/** 뷰포트에 들어올 때 한 번만 아래에서 떠오르는 기본 등장 모션 */
export function getRevealProps(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.8, ease: LANDING_EASE, delay },
  };
}
