import { useMotionValue, useSpring } from "framer-motion";
import { type RefObject, useEffect } from "react";

import type { PointerPosition } from "./use-pointer-position";

const LOOK_SPRING = { stiffness: 180, damping: 18, mass: 0.6 };
// 이 거리(px)보다 멀면 끝까지 돌아보고, 가까울수록 덜 돌아본다
const FULL_LOOK_DISTANCE = 320;

interface Options {
  /** 최대 이동 거리(요소 좌표계 단위). 0이면 움직이지 않는다 */
  reach: number;
  /** 요소가 기울어진 각도(deg). 시선 방향을 요소 좌표계로 되돌린다 */
  rotate?: number;
}

/** 요소 중심에서 포인터를 향하는 방향으로 얼굴을 옮길 오프셋 */
export function useLookAt(
  ref: RefObject<Element | null>,
  pointer: PointerPosition,
  { reach, rotate = 0 }: Options,
) {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  useEffect(() => {
    // 시선을 거두면 정면으로 돌아온다
    if (reach === 0) {
      targetX.set(0);
      targetY.set(0);
      return;
    }

    const radian = (-rotate * Math.PI) / 180;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);

    const update = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const dx = pointer.x.get() - (rect.left + rect.width / 2);
      const dy = pointer.y.get() - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, distance / FULL_LOOK_DISTANCE) * reach;
      const ux = dx / distance;
      const uy = dy / distance;

      targetX.set((ux * cos - uy * sin) * strength);
      targetY.set((ux * sin + uy * cos) * strength);
    };

    const unsubscribeX = pointer.x.on("change", update);
    const unsubscribeY = pointer.y.on("change", update);
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [ref, pointer, reach, rotate, targetX, targetY]);

  return {
    x: useSpring(targetX, LOOK_SPRING),
    y: useSpring(targetY, LOOK_SPRING),
  };
}
