import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";

/**
 * 페이지 콘텐츠 진입 애니메이션 props 생성기.
 *
 * 페이지 전환 hook이 `pageReady`를 토글하면 모든 사용처가 동시에 트리거됨.
 * - 초기 로드(refresh/URL): 오버레이 reveal 완료 후 트리거
 * - 페이지 이동: 새 페이지 오버레이 exit 완료 후 트리거
 *
 * Home/Projects 페이지의 타이밍을 기준으로 한 4가지 프리셋 제공.
 *
 * @example
 * const entrance = usePageEntrance("title");
 * <motion.h1 {...entrance}>...</motion.h1>
 */

const EASE = [0.25, 0.1, 0.25, 1] as const;

type EntranceSlot = "lead" | "title" | "subtitle" | "body" | "tail";

interface EntrancePreset {
  initial: Record<string, number | string>;
  target: Record<string, number | string>;
  duration: number;
  delay: number;
}

const PRESETS: Record<EntranceSlot, EntrancePreset> = {
  // 가장 먼저 등장 (태그, 작은 라벨, 보조 요소 등)
  lead: {
    initial: { opacity: 0, y: 12 },
    target: { opacity: 1, y: 0 },
    duration: 0.6,
    delay: 0,
  },
  // 메인 제목
  title: {
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    target: { opacity: 1, y: 0, filter: "blur(0px)" },
    duration: 0.8,
    delay: 0.1,
  },
  // 부제목/설명
  subtitle: {
    initial: { opacity: 0, y: 16, filter: "blur(4px)" },
    target: { opacity: 1, y: 0, filter: "blur(0px)" },
    duration: 0.7,
    delay: 0.25,
  },
  // 본문/주요 콘텐츠
  body: {
    initial: { opacity: 0, y: 16 },
    target: { opacity: 1, y: 0 },
    duration: 0.7,
    delay: 0.4,
  },
  // 가장 늦게 등장
  tail: {
    initial: { opacity: 0, y: 12 },
    target: { opacity: 1, y: 0 },
    duration: 0.7,
    delay: 0.55,
  },
};

export function usePageEntrance(slot: EntranceSlot, delayOffset = 0) {
  const { pageReady } = usePageTransition();
  const preset = PRESETS[slot];

  return {
    initial: preset.initial,
    animate: pageReady ? preset.target : undefined,
    transition: {
      duration: preset.duration,
      ease: EASE,
      delay: preset.delay + delayOffset,
    },
  };
}

export type { EntranceSlot };
