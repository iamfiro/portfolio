import { Children, ReactNode, useEffect, useRef, useState } from "react";

import s from "./Marquee.module.scss";

interface MarqueeProps {
  children: ReactNode;
  /** Scroll direction: left-to-right or right-to-left */
  direction?: "left" | "right";
  /** Animation speed in seconds (lower is faster) */
  speed?: number;
  /** Gap between items in px */
  gap?: number;
  /** Width of the marquee container */
  width?: number | string;
  /** Whether to pause animation on hover */
  pauseOnHover?: boolean;
  /** Whether to show fading gradient at the left/right edges */
  showEdgeGradient?: boolean;
  /** Gradient color for edge fade (default: surface color) */
  gradientColor?: string;
  /** Optional custom className */
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

  const childArray = Children.toArray(children);

  useEffect(() => {
    if (firstSetRef.current) {
      setOffset(firstSetRef.current.offsetWidth + gap);
    }
  }, [children, gap]);

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
    gap: `${gap}px`,
  } as React.CSSProperties;

  return (
    <div className={marqueeClassName} style={containerStyle}>
      <div className={trackClassName} style={trackStyle}>
        <div ref={firstSetRef} className={s.set} style={{ gap: `${gap}px` }}>
          {childArray.map((child, index) => (
            <div key={index} className={s.item}>
              {child}
            </div>
          ))}
        </div>
        <div className={s.set} style={{ gap: `${gap}px` }} aria-hidden="true">
          {childArray.map((child, index) => (
            <div key={index} className={s.item}>
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
