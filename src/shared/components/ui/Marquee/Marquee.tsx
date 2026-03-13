import {
  Children,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import s from "./Marquee.module.scss";

interface MarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number;
  gap?: number;
  width?: number | string;
  pauseOnHover?: boolean;
  showEdgeGradient?: boolean;
  gradientColor?: string;
  className?: string;
}

function Marquee({
  children,
  direction = "left",
  speed = 20,
  gap = 24,
  width,
  pauseOnHover = true,
  showEdgeGradient = true,
  gradientColor,
  className,
}: MarqueeProps) {
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const childArray = useMemo(() => Children.toArray(children), [children]);

  useLayoutEffect(() => {
    const target = firstSetRef.current;
    if (!target) return;

    const measureOffset = () => {
      const nextOffset = target.offsetWidth + gap;
      setOffset(nextOffset > 0 ? nextOffset : 0);
    };

    measureOffset();

    const resizeObserver = new ResizeObserver(() => {
      measureOffset();
    });

    resizeObserver.observe(target);

    const mediaElements = target.querySelectorAll("img, video");
    const onMediaLoad = () => {
      measureOffset();
    };

    for (const media of mediaElements) {
      media.addEventListener("load", onMediaLoad);
      media.addEventListener("error", onMediaLoad);
    }

    return () => {
      resizeObserver.disconnect();
      for (const media of mediaElements) {
        media.removeEventListener("load", onMediaLoad);
        media.removeEventListener("error", onMediaLoad);
      }
    };
  }, [gap]);

  const getChildKey = (child: ReactNode) => {
    if (isValidElement(child) && child.key != null) {
      return String(child.key);
    }

    return String(child);
  };

  const marqueeClassName = [
    s.marquee,
    pauseOnHover && s.pauseOnHover,
    showEdgeGradient && s.edgeGradient,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const trackClassName = [s.track, direction === "right" && s.right]
    .filter(Boolean)
    .join(" ");

  const containerStyle = {
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(gradientColor && { "--gradient-color": gradientColor }),
  } as React.CSSProperties;

  const trackStyle = {
    "--scroll-offset": `-${offset}px`,
    animationDuration: `${speed}s`,
    animationPlayState: offset > 0 ? "running" : "paused",
    gap: `${gap}px`,
  } as React.CSSProperties;

  return (
    <div className={marqueeClassName} style={containerStyle}>
      <div className={trackClassName} style={trackStyle}>
        <div ref={firstSetRef} className={s.set} style={{ gap: `${gap}px` }}>
          {childArray.map((child) => (
            <div key={getChildKey(child)} className={s.item}>
              {child}
            </div>
          ))}
        </div>
        <div className={s.set} style={{ gap: `${gap}px` }} aria-hidden="true">
          {childArray.map((child) => (
            <div key={`clone-${getChildKey(child)}`} className={s.item}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Marquee };
export type { MarqueeProps };
