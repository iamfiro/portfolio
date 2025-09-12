import React from "react";

import styles from "./styles.module.scss";

// 정렬 방향 enum
export enum FlexAlign {
  Start = "start",
  Center = "center",
  End = "end",
  Stretch = "stretch",
}

// justify enum
export enum FlexJustify {
  Start = "start",
  Center = "center",
  End = "end",
  Between = "between",
  Around = "around",
  Evenly = "evenly",
}

// 공통 Stack props
interface StackProps {
  children: React.ReactNode;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: number;
  fullWidth?: boolean;
  fullHeight?: boolean;
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// HStack 컴포넌트 (가로 배치)
export const HStack: React.FC<StackProps> = ({
  children,
  align = FlexAlign.Start,
  justify = FlexJustify.Start,
  gap = 0,
  fullWidth = false,
  fullHeight = false,
  wrap = false,
  className,
  style,
  ...props
}) => {
  const alignClass = styles[`align-${align}`];
  const justifyClass = styles[`justify-${justify}`];
  const gapClass = gap > 0 ? styles[`gap-${gap}`] : "";
  const widthClass = fullWidth ? styles.fullWidth : "";
  const heightClass = fullHeight ? styles.fullHeight : "";
  const wrapClass = wrap ? styles.wrap : "";

  const combinedClassName = [
    styles.hstack,
    alignClass,
    justifyClass,
    gapClass,
    widthClass,
    heightClass,
    wrapClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={combinedClassName}
      style={{ ...style, gap: gap > 0 ? `${gap}px` : undefined }}
      {...props}
    >
      {children}
    </div>
  );
};

// VStack 컴포넌트 (세로 배치)
export const VStack: React.FC<StackProps> = ({
  children,
  align = FlexAlign.Start,
  justify = FlexJustify.Start,
  gap = 0,
  fullWidth = false,
  fullHeight = false,
  wrap = false,
  className,
  style,
  ...props
}) => {
  const alignClass = styles[`align-${align}`];
  const justifyClass = styles[`justify-${justify}`];
  const gapClass = gap > 0 ? styles[`gap-${gap}`] : "";
  const widthClass = fullWidth ? styles.fullWidth : "";
  const heightClass = fullHeight ? styles.fullHeight : "";
  const wrapClass = wrap ? styles.wrap : "";

  const combinedClassName = [
    styles.vstack,
    alignClass,
    justifyClass,
    gapClass,
    widthClass,
    heightClass,
    wrapClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={combinedClassName}
      style={{ ...style, gap: gap > 0 ? `${gap}px` : undefined }}
      {...props}
    >
      {children}
    </div>
  );
};
