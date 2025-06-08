import {createElement, forwardRef, Ref} from "react";
import cn from "classnames";

import { flexAlign, flexDirection, flexJustify, FlexProps, flexWrap } from "@/components/ui/Flex/shared";

import s from './style.module.scss';

const Flex = forwardRef(function Flex(props: FlexProps, ref: Ref<unknown>) {
  const {
    as, children, className,
    direction, justify, align,
    wrap, gap, style,
    fullHeight, fullWidth,
    ...rest
  } = props;

  return createElement(as || "div", {
    ...rest,
    ref,
    className: cn(
      s.flexLayout,
      {
        [s.row]: direction === flexDirection.row,
        [s.column]: direction === flexDirection.column,
        [s.justifyStart]: justify === flexJustify.start,
        [s.justifyEnd]: justify === flexJustify.end,
        [s.justifyCenter]: justify === flexJustify.center,
        [s.justifyBetween]: justify === flexJustify.between,
        [s.justifyAround]: justify === flexJustify.around,
        [s.alignStart]: align === flexAlign.start,
        [s.alignEnd]: align === flexAlign.end,
        [s.alignCenter]: align === flexAlign.center,
        [s.alignStretch]: align === flexAlign.stretch,
        [s.wrap]: wrap === flexWrap.wrap,
        [s.fullHeight]: fullHeight,
        [s.fullWidth]: fullWidth,
      },
      className
    ),
    style: {
      ...style,
      gap: gap ? `${gap}px` : undefined,
    },
  }, children);
})

export default Flex;