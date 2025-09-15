import React from "react";

import s from "./style.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
  animation?: "pulse" | "wave" | "none";
  children?: React.ReactNode;
}

export default function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className,
  style,
  animation = "pulse",
  children,
}: SkeletonProps) {
  const skeletonStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    ...style,
  };

  const skeletonClassName = [
    s.skeleton,
    s[animation],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (children) {
    return (
      <div className={skeletonClassName} style={skeletonStyle}>
        {children}
      </div>
    );
  }

  return <div className={skeletonClassName} style={skeletonStyle} />;
}

// 미리 정의된 Skeleton 컴포넌트들
Skeleton.Text = ({ lines = 1, ...props }: SkeletonProps & { lines?: number }) => (
  <div>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton
        key={index}
        height="1rem"
        width={index === lines - 1 ? "75%" : "100%"}
        style={{ marginBottom: index < lines - 1 ? "0.5rem" : 0 }}
        {...props}
      />
    ))}
  </div>
);

Skeleton.Circle = (props: SkeletonProps) => (
  <Skeleton
    borderRadius="50%"
    width={props.width || "40px"}
    height={props.height || "40px"}
    {...props}
  />
);

Skeleton.Rectangle = (props: SkeletonProps) => (
  <Skeleton
    borderRadius="8px"
    {...props}
  />
);

Skeleton.Card = ({ children, ...props }: SkeletonProps) => (
  <Skeleton.Rectangle
    height="200px"
    style={{ padding: "1rem", ...props.style }}
    {...props}
  >
    {children}
  </Skeleton.Rectangle>
);
