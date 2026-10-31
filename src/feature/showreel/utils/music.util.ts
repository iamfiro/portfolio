import type { ReelTempo } from "../showreel.type";

/** 장면 키프레임의 기준 프레임레이트 */
export const REEL_FPS = 24;

/**
 * 배경 음악과 박자 격자.
 * 104 BPM은 온셋 자기상관으로, offset은 8마디 간격으로 떨어지는 섹션 타격(3.685초, 22.150초)으로 맞췄다.
 */
export const SHOWREEL_MUSIC = {
  src: "/audio/showreel.mp3",
  /** 배경에 작게 깔리는 크기 */
  volume: 0.2,
  /** 처음 켤 때 소리를 서서히 올리는 시간(초) */
  fadeIn: 1.6,
  tempo: { bpm: 104, offset: 1.377 } satisfies ReelTempo,
};

export const frames = (count: number) => count / REEL_FPS;

export const beatsToSeconds = (beats: number, tempo: ReelTempo) =>
  (beats * 60) / tempo.bpm;

/** 쇼릴 시각을 1부터 세는 마디·박으로 바꾼다 */
export function beatPosition(seconds: number, tempo: ReelTempo) {
  const beat = (seconds * tempo.bpm) / 60;
  return { bar: Math.floor(beat / 4) + 1, beat: Math.floor(beat % 4) + 1 };
}
