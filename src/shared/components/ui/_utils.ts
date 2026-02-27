import type { CSSProperties } from 'react'
import type { LayoutProps, SpacingProps } from '../../types/component-common'

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

function buildLayoutStyle(props: LayoutProps): CSSProperties {
  const style: CSSProperties = {}
  if (props.width != null) style.width = props.width
  if (props.maxWidth != null) style.maxWidth = props.maxWidth
  if (props.minWidth != null) style.minWidth = props.minWidth
  if (props.height != null) style.height = props.height
  if (props.maxHeight != null) style.maxHeight = props.maxHeight
  if (props.minHeight != null) style.minHeight = props.minHeight
  return style
}

function buildSpacingStyle(props: SpacingProps): CSSProperties {
  const style: CSSProperties = {}
  if (props.m != null) style.margin = props.m
  if (props.mt != null) style.marginTop = props.mt
  if (props.mr != null) style.marginRight = props.mr
  if (props.mb != null) style.marginBottom = props.mb
  if (props.ml != null) style.marginLeft = props.ml
  if (props.mx != null) { style.marginLeft = props.mx; style.marginRight = props.mx }
  if (props.my != null) { style.marginTop = props.my; style.marginBottom = props.my }
  if (props.p != null) style.padding = props.p
  if (props.pt != null) style.paddingTop = props.pt
  if (props.pr != null) style.paddingRight = props.pr
  if (props.pb != null) style.paddingBottom = props.pb
  if (props.pl != null) style.paddingLeft = props.pl
  if (props.px != null) { style.paddingLeft = props.px; style.paddingRight = props.px }
  if (props.py != null) { style.paddingTop = props.py; style.paddingBottom = props.py }
  return style
}

const NOOP = () => {}

export { cn, buildLayoutStyle, buildSpacingStyle, NOOP }
