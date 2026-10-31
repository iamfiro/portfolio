import gsap from "gsap";

import type { ReelScene, ReelSlot, ReelTempo } from "../showreel.type";

import { beatsToSeconds, frames } from "./music.util";

/** 음악 시계와 이만큼(초) 넘게 어긋나면 쇼릴을 음악 쪽으로 맞춘다 */
const SYNC_TOLERANCE = frames(1.5);

interface PlacedScene extends ReelSlot {
  scene: ReelScene;
  state: unknown;
}

const wrap = (value: number, length: number) =>
  ((value % length) + length) % length;

/**
 * 장면들을 박자 칸에 차례로 이어 붙여 마스터 타임라인 하나로 만든다.
 * 장면은 자기 타임라인을 0초부터 짜고, 마스터는 장면을 칸 길이에 맞춰(늘이거나 붙잡아) 끼우고
 * 장면 id로 라벨을 단다. 칸이 박 단위라 컷은 언제나 음악 박자에 떨어진다.
 */
export function createShowreel(scenes: ReelScene[], tempo: ReelTempo) {
  const master = gsap.timeline({ paused: true, repeat: -1 });
  const placed: PlacedScene[] = [];
  let cursor = 0;

  scenes.forEach((scene) => {
    const state = scene.createState();
    const timeline = gsap.timeline();
    scene.build(timeline, state);

    const duration = beatsToSeconds(scene.beats, tempo);
    if (scene.fit === "hold" && timeline.duration() <= duration) {
      timeline.set({}, {}, duration);
    } else {
      timeline.duration(duration);
    }

    master.addLabel(scene.id, cursor).add(timeline, cursor);
    placed.push({ id: scene.id, scene, state, start: cursor, duration });
    cursor += duration;
  });
  master.set({}, {}, cursor);

  const duration = cursor;

  return {
    master,
    duration,
    slots: placed.map(({ id, start, duration: length }) => ({
      id,
      start,
      duration: length,
    })),
    /** 지금 마스터 시각에 보여야 할 장면 */
    sceneAt(time: number) {
      return placed.reduce((found, item) =>
        item.start <= time ? item : found,
      );
    },
    /** 쇼릴 시각에 맞는 음악 재생 위치. 음악의 첫 마디 첫 박이 쇼릴 0초다 */
    musicTimeAt(reelTime: number) {
      return tempo.offset + wrap(reelTime, duration);
    },
    /** 음악 재생 위치에 맞는 쇼릴 시각. 음악이 쇼릴 구간 밖이면 null(음악을 구간 안으로 데려와야 한다) */
    reelTimeAt(musicTime: number) {
      const time = musicTime - tempo.offset;
      return time >= 0 && time < duration ? time : null;
    },
    /**
     * 음악을 따라간다. 어긋남이 허용치를 넘을 때만 마스터를 옮겨
     * 평소엔 GSAP 자체 시계로 매끄럽게 흐르고, 루프 경계 근처의 어긋남은 감아서 잰다.
     */
    follow(reelTime: number) {
      const drift =
        wrap(reelTime - master.time() + duration / 2, duration) - duration / 2;
      if (Math.abs(drift) > SYNC_TOLERANCE) master.time(reelTime);
    },
  };
}

export type Showreel = ReturnType<typeof createShowreel>;
