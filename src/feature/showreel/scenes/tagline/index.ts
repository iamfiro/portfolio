import type { ReelScene } from "@/feature/showreel/showreel.type";

import { sceneBeats } from "../scene.util";

import type { TaglineSceneState } from "./tagline.type";
import { buildTaglineTimeline, createTaglineRenderer } from "./tagline.util";

/** 2마디 태그라인. 앞 장면의 재질을 배경으로 이어받고, 끝에 그 배경이 막대로 접혀 다음 장면으로 넘어간다 */
export const taglineScene: ReelScene<TaglineSceneState> = {
  id: "tagline",
  beats: sceneBeats("tagline"),
  createState: () => ({ clock: 0 }),
  build: buildTaglineTimeline,
  createRenderer: createTaglineRenderer,
};
