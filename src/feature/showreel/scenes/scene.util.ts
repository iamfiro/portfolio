import type {
  ReelBox,
  ReelFrame,
  ReelTextMetrics,
} from "@/feature/showreel/stage.type";
import {
  BEAT,
  EASE,
  REVEAL_SECONDS,
  STAGGER_SECONDS,
} from "@/feature/showreel/utils/motion.util";
import { rgba } from "@/feature/showreel/utils/palette.util";
import type { ReelStage } from "@/feature/showreel/utils/stage.util";

/**
 * 장면 순서와 길이(박). 음악 104BPM에서 11마디(25.4초)다.
 * title 2마디(첫 마디는 조용한 인트로, 둘째 마디 첫 박이 큰 타격) → tagline 2마디 → projects 5마디 → outro 2마디.
 * outro 첫 박이 다음 프레이즈의 타격(음원 22.15초)에 떨어진다.
 */
export const REEL_SEQUENCE = [
  { id: "title", beats: 8 },
  { id: "tagline", beats: 8 },
  { id: "projects", beats: 20 },
  { id: "outro", beats: 8 },
] as const;

export type ReelSceneId = (typeof REEL_SEQUENCE)[number]["id"];

export const sceneBeats = (id: ReelSceneId) =>
  REEL_SEQUENCE.find((scene) => scene.id === id)?.beats ?? 0;

/** 그 장면이 쇼릴에서 시작하는 시각(초). 재질 시계를 장면 사이에 잇는 데 쓴다 */
export function sceneStart(id: ReelSceneId) {
  const index = REEL_SEQUENCE.findIndex((scene) => scene.id === id);
  return (
    REEL_SEQUENCE.slice(0, index).reduce((sum, scene) => sum + scene.beats, 0) *
    BEAT
  );
}

/** 장면 시계를 장면 시작부터 끝까지 끊김 없이 흘린다 */
export function buildClock(
  timeline: gsap.core.Timeline,
  state: { clock: number },
  id: ReelSceneId,
) {
  const duration = sceneBeats(id) * BEAT;
  timeline.fromTo(
    state,
    { clock: 0 },
    { clock: duration, duration, ease: "none", immediateRender: false },
    0,
  );
}

const WHITE = rgba("#f5f5f5");
const CAPTION_SIZE = 24;

/**
 * 화면 아래 캡션 줄. 모든 장면이 같은 자리에 그려 컷을 넘어 이어지는 기준이 되고,
 * 장면 번호만 바뀐다. 마지막 장면 끝에선 01로 돌아가 루프 첫 프레임과 맞물린다.
 */
export function drawCaption(stage: ReelStage, frame: ReelFrame, index: number) {
  const baseline = frame.captionBaseline;
  stage.text("SHOWREEL 2026", {
    font: "mono",
    size: CAPTION_SIZE,
    x: frame.column(1)[0],
    baseline,
    color: WHITE,
    blend: "invert",
  });
  stage.text(`0${index} / 04`, {
    font: "mono",
    size: CAPTION_SIZE,
    x: frame.column(frame.portrait ? 3 : 4)[0],
    baseline,
    color: WHITE,
    blend: "invert",
  });
}

/** 한 줄을 가두는 마스크. 글자가 이 밖으로 나가면 잘린다 */
export function lineMask(
  frame: ReelFrame,
  baseline: number,
  size: number,
  metrics: ReelTextMetrics,
): ReelBox {
  return [
    0,
    baseline - metrics.ascent * size - size * 0.08,
    frame.width,
    baseline + metrics.descent * size + size * 0.08,
  ];
}

/**
 * 마스크 안 글자 올라오기. startBeat부터 글자마다 STAGGER씩 늦게, distance 아래에서 제자리로 올라온다.
 * 돌려준 함수를 text의 shift에 넘긴다.
 */
export function rise(clock: number, startBeat: number, distance: number) {
  return (index: number): [number, number] => {
    const t =
      (clock - startBeat * BEAT - index * STAGGER_SECONDS) / REVEAL_SECONDS;
    return [0, (1 - EASE.expoOut(t)) * distance];
  };
}

/** 마스크 밖으로 내려가며 퇴장. startBeat부터 한 박 동안 snap으로 distance만큼 내려간다 */
export function sink(clock: number, startBeat: number, distance: number) {
  return EASE.snap((clock - startBeat * BEAT) / BEAT) * distance;
}

/** 이 글자가 등장을 시작했는지(등장 전 글자는 그리지 않는다) */
export const hasStarted = (clock: number, startBeat: number) =>
  clock >= startBeat * BEAT;
