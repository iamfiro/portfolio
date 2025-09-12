import type { CSSProperties, ReactNode } from "react";

export interface SpacingProps {
  children?: ReactNode;
  size?: number;
  direction?: "horizontal" | "vertical" | "both";
  className?: string;
  style?: CSSProperties;
}

export default function Spacing({
  children,
  size = 16,
  direction = "vertical",
  className,
  style,
}: SpacingProps) {
  const spacingClassName = [className].filter(Boolean).join(" ");

  const spacingStyle: CSSProperties = {
    ...style,
    ...(direction === "vertical" && {
      height: size,
    }),
    ...(direction === "horizontal" && {
      width: size,
    }),
    ...(direction === "both" && {
      height: size,
      width: size,
    }),
  };

  return (
    <div className={spacingClassName} style={spacingStyle}>
      {children}
    </div>
  );
}
