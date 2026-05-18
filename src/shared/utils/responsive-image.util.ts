// Responsive image srcset 생성 유틸리티
// R2에 업로드된 이미지의 URL 패턴: {base}/{label}.webp
// 변환 결과: {base}/{label}-{width}w.webp

const RESPONSIVE_WIDTHS = [640, 1024, 1440] as const;

export type ResponsiveWidth = (typeof RESPONSIVE_WIDTHS)[number];

/**
 * R2 이미지 URL에서 srcset 문자열을 생성
 * @param url - 기본 이미지 URL (e.g., "https://s3.devfiro.com/projects/my-project/thumbnail.webp")
 * @param widths - 생성할 너비 배열 (default: RESPONSIVE_WIDTHS)
 * @returns srcset 문자열 or null (URL이 .webp가 아닌 경우)
 */
export function generateSrcSet(
  url: string,
  widths: readonly number[] = RESPONSIVE_WIDTHS,
): string | null {
  // Only transform .webp URLs from our R2 bucket
  if (!url.endsWith(".webp")) return null;

  const lastDotIndex = url.lastIndexOf(".webp");
  const basePath = url.slice(0, lastDotIndex);

  return widths.map((w) => `${basePath}-${w}w.webp ${w}w`).join(", ");
}

export { RESPONSIVE_WIDTHS };
