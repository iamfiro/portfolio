import {AriaRole, ElementType} from "react";

import { BaseLayoutProps, LayoutSizeProps } from "@/types/layout";

export const flexDirection = {
  row: "row",
  column: "column",
} as const;

export const flexJustify = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
} as const;

export const flexAlign = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
} as const;

export const flexWrap = {
  wrap: "wrap",
  nowrap: "nowrap",
} as const;

export interface FlexProps extends BaseLayoutProps, Partial<LayoutSizeProps> {
  as?: ElementType;
  direction?: typeof flexDirection[keyof typeof flexDirection];
  justify?: typeof flexJustify[keyof typeof flexJustify];
  align?: typeof flexAlign[keyof typeof flexAlign];
  wrap?: typeof flexWrap[keyof typeof flexWrap];
  gap?: number;
  role?: AriaRole;
  onClick?: (e: React.MouseEvent) => void;
}