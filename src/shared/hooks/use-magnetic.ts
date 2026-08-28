import {
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { type PointerEvent, type RefObject, useCallback, useRef } from "react";

interface Options {
  /** 마우스 이동량을 따라가는 비율 (0~1) */
  strength?: number;
  /** 중심에서 벗어날 수 있는 최대 거리(px) */
  maxDistance?: number;
  /** 스프링 강성. 낮을수록 늦게 따라온다 */
  stiffness?: number;
  /** 스프링 감쇠. 낮을수록 관성이 크게 남는다 */
  damping?: number;
  /** 질량. 높을수록 무겁게 뒤따라온다 */
  mass?: number;
}

interface Magnetic<T extends HTMLElement> {
  /** 마우스 위치 기준이 되는 영역(hover 영역)에 연결한다 */
  areaRef: RefObject<T>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: PointerEvent<T>) => void;
  onPointerLeave: () => void;
}

/**
 * 마우스를 따라 요소가 끌려갔다가, 벗어나면 관성을 남기며 제자리로 돌아오는 자석 인터랙션.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.22,
  maxDistance = 6,
  stiffness = 230,
  damping = 8,
  mass = 0.7,
}: Options = {}): Magnetic<T> {
  const areaRef = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness, damping, mass };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      const area = areaRef.current;
      if (!area || event.pointerType !== "mouse" || reducedMotion) return;

      const rect = area.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      rawX.set(clamp(offsetX * strength, maxDistance));
      rawY.set(clamp(offsetY * strength, maxDistance));
    },
    [maxDistance, rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { areaRef, x, y, onPointerMove, onPointerLeave };
}

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}
