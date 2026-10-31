import { type MotionValue, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export interface PointerPosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/** 창 안 포인터 좌표(clientX/Y)를 리렌더 없이 모션 값으로 따라간다 */
export function usePointerPosition(): PointerPosition {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [x, y]);

  return { x, y };
}
