import type { CSSProperties } from 'react'

type SpacingToken =
  0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 24 | 32 | 40 | 48 | 64 | 100

type LayoutProps = {
  width?: CSSProperties['width']
  maxWidth?: CSSProperties['maxWidth']
  minWidth?: CSSProperties['minWidth']
  height?: CSSProperties['height']
  maxHeight?: CSSProperties['maxHeight']
  minHeight?: CSSProperties['minHeight']
}

type SpacingProps = {
  m?: SpacingToken
  mt?: SpacingToken
  mr?: SpacingToken
  mb?: SpacingToken
  ml?: SpacingToken
  mx?: SpacingToken
  my?: SpacingToken
  p?: SpacingToken
  pt?: SpacingToken
  pr?: SpacingToken
  pb?: SpacingToken
  pl?: SpacingToken
  px?: SpacingToken
  py?: SpacingToken
}

type StyleProps = {
  className?: string
  style?: CSSProperties
}

export type { SpacingToken, LayoutProps, SpacingProps, StyleProps }
