import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time 문자열 비교. 타이밍 공격 방지.
 * 길이가 다른 경우에도 일정 시간 소요.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  // 길이가 다르면 비교용으로 패딩하되 결과는 무조건 false
  const aBuffer = Buffer.from(a, "utf-8");
  const bBuffer = Buffer.from(b, "utf-8");

  if (aBuffer.length !== bBuffer.length) {
    // 길이가 달라도 timingSafeEqual을 호출해서 타이밍 누출 방지
    const padded = Buffer.alloc(aBuffer.length, 0);
    bBuffer.copy(padded, 0, 0, Math.min(bBuffer.length, aBuffer.length));
    timingSafeEqual(aBuffer, padded);
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}
