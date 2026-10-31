import type { ReelScene } from "@/feature/showreel/showreel.type";

import { sceneBeats } from "../scene.util";

import type { OutroSceneState } from "./outro.type";
import { buildOutroTimeline, createOutroRenderer } from "./outro.util";

/** 2마디 아웃트로. 타일이 로고 마크로 모이고, 끝 프레임이 타이틀 첫 프레임과 맞물려 루프한다 */
export const outroScene: ReelScene<OutroSceneState> = {
  id: "outro",
  beats: sceneBeats("outro"),
  createState: () => ({ clock: 0 }),
  build: buildOutroTimeline,
  createRenderer: createOutroRenderer,
};
