import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  createPixelLogoRenderer,
  parseColor,
  samplePixelGrid,
} from "@/feature/landing/components/footer/pixel-logo/pixel-logo.util";

interface Options {
  src: string;
  columns: number;
}

/** 포인터·호버 값을 목표치로 따라가게 하는 프레임당 보간 비율 */
const FOLLOW = 0.18;
const MAX_PIXEL_RATIO = 2;
/** 인트로를 건너뛸 때 쓰는 충분히 큰 경과 시간(초) */
const SETTLED_TIME = 1e4;

/**
 * 캔버스에 로고를 픽셀 격자로 그리고 애니메이션을 돌린다.
 * 화면에 보일 때만 루프를 돌리고, 처음 보이는 순간 인트로가 시작된다.
 * WebGL2가 없으면 supported가 false가 되어 정적 이미지로 대체할 수 있다.
 */
export function usePixelLogo({ src, columns }: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const [supported, setSupported] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<string>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false });
    if (!gl) {
      setSupported(false);
      return;
    }

    let disposed = false;
    let renderer: ReturnType<typeof createPixelLogoRenderer> | null = null;
    let frameId = 0;
    let introStart: number | null = null;
    let visible = false;

    const pointer = { x: -100, y: -100 };
    const pointerTarget = { ...pointer };
    let hover = 0;
    let hoverTarget = 0;
    let gridSize = { columns, rows: 1 };

    const draw = (now: number) => {
      if (!renderer) return;

      pointer.x += (pointerTarget.x - pointer.x) * FOLLOW;
      pointer.y += (pointerTarget.y - pointer.y) * FOLLOW;
      hover += (hoverTarget - hover) * FOLLOW;

      renderer.draw({
        time: reducedMotion ? SETTLED_TIME : (now - (introStart ?? now)) / 1000,
        clock: now / 1000,
        pointer,
        hover,
        sparkle: !reducedMotion,
      });
    };

    const loop = (now: number) => {
      draw(now);
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reducedMotion || frameId) return;
      frameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      draw(performance.now());
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTarget.x =
        ((event.clientX - rect.left) / rect.width) * gridSize.columns;
      pointerTarget.y =
        ((event.clientY - rect.top) / rect.height) * gridSize.rows;
      // 처음 들어올 때는 바로 그 자리에서 번지게 한다
      if (hover < 0.01) Object.assign(pointer, pointerTarget);
      hoverTarget = 1;
    };

    const handlePointerLeave = () => {
      hoverTarget = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) return stop();

      introStart ??= performance.now();
      start();
    });

    samplePixelGrid(src, columns)
      .then((grid) => {
        if (disposed) return;

        const style = getComputedStyle(canvas);
        renderer = createPixelLogoRenderer(gl, grid, {
          base: parseColor(style.getPropertyValue("--pixel-base")),
          accent: parseColor(style.getPropertyValue("--pixel-accent")),
        });
        gridSize = { columns: grid.columns, rows: grid.rows };
        setAspectRatio(`${grid.columns} / ${grid.rows}`);

        resizeObserver.observe(canvas);
        intersectionObserver.observe(canvas);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerleave", handlePointerLeave);
      })
      .catch(() => {
        if (!disposed) setSupported(false);
      });

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      renderer?.dispose();
    };
  }, [src, columns, reducedMotion]);

  return { canvasRef, supported, aspectRatio };
}
