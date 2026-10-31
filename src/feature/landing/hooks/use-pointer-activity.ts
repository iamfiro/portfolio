import { useEffect, useState } from "react";

/** 특정 지점에서 일어난 포인터 사건. at이 바뀔 때마다 새 사건이다 */
export interface PointerEventSpot {
  x: number;
  y: number;
  /** 요소 가장자리에서 이 거리(px) 안이면 반응한다 */
  margin: number;
  at: number;
}

// 이만큼 가만히 있으면 잠든다(ms)
const IDLE_DELAY = 7000;
// 이보다 빠르게 휙 지나가면 놀란다(px/ms)
const STARTLE_SPEED = 3.2;
const STARTLE_MARGIN = 200;
// 이 시간 안에 방향을 이만큼 뒤집으면 흔든 것으로 본다
const SHAKE_WINDOW = 900;
const SHAKE_REVERSALS = 6;
const SHAKE_MIN_STEP = 6;
const SHAKE_MARGIN = 120;
const COOLDOWN = 700;

/**
 * 포인터 움직임을 읽어 잠듦·놀람·흔들림을 알려 준다.
 * 사건은 위치와 함께 넘겨, 받는 쪽이 가까운지 스스로 판단한다
 */
export function usePointerActivity() {
  const [sleepy, setSleepy] = useState(false);
  const [startle, setStartle] = useState<PointerEventSpot | null>(null);
  const [shake, setShake] = useState<PointerEventSpot | null>(null);

  useEffect(() => {
    let last: { x: number; y: number; time: number } | null = null;
    let direction = { x: 0, y: 0 };
    let reversals: number[] = [];
    let asleep = false;
    let lastStartle = 0;
    let lastShake = 0;
    let idleTimer = window.setTimeout(fallAsleep, IDLE_DELAY);

    function fallAsleep() {
      asleep = true;
      setSleepy(true);
    }

    const trackReversal = (axis: "x" | "y", step: number, time: number) => {
      if (Math.abs(step) < SHAKE_MIN_STEP) return;
      const sign = Math.sign(step);
      if (direction[axis] !== 0 && sign !== direction[axis]) {
        reversals.push(time);
      }
      direction = { ...direction, [axis]: sign };
    };

    const handlePointerMove = ({
      clientX,
      clientY,
      timeStamp,
    }: PointerEvent) => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(fallAsleep, IDLE_DELAY);

      // 깨어날 땐 모두가 화들짝 놀란다
      if (asleep) {
        asleep = false;
        setSleepy(false);
        setStartle({ x: clientX, y: clientY, margin: Infinity, at: timeStamp });
        lastStartle = timeStamp;
      }

      if (last) {
        const dx = clientX - last.x;
        const dy = clientY - last.y;
        const dt = Math.max(1, timeStamp - last.time);

        trackReversal("x", dx, timeStamp);
        trackReversal("y", dy, timeStamp);
        reversals = reversals.filter((time) => timeStamp - time < SHAKE_WINDOW);

        if (
          reversals.length >= SHAKE_REVERSALS &&
          timeStamp - lastShake > COOLDOWN
        ) {
          reversals = [];
          lastShake = timeStamp;
          setShake({
            x: clientX,
            y: clientY,
            margin: SHAKE_MARGIN,
            at: timeStamp,
          });
        } else if (
          Math.hypot(dx, dy) / dt > STARTLE_SPEED &&
          timeStamp - lastStartle > COOLDOWN
        ) {
          lastStartle = timeStamp;
          setStartle({
            x: clientX,
            y: clientY,
            margin: STARTLE_MARGIN,
            at: timeStamp,
          });
        }
      }

      last = { x: clientX, y: clientY, time: timeStamp };
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return { sleepy, startle, shake };
}
