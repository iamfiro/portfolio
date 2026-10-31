import type { ReelScene } from "@/feature/showreel/showreel.type";

import { sceneBeats } from "../scene.util";

import type { TitleSceneState } from "./title.type";
import { buildTitleTimeline, createTitleRenderer } from "./title.util";

/**
 * 2마디 타이틀. 조용한 첫 마디에 Sung · ju를 세우고, 둘째 마디 첫 박 타격에 Cho가 밀어올린 뒤
 * o가 커져 다음 장면의 배경이 된다.
 */
export const titleScene: ReelScene<TitleSceneState> = {
  id: "title",
  beats: sceneBeats("title"),
  createState: () => ({ clock: 0 }),
  build: buildTitleTimeline,
  createRenderer: createTitleRenderer,
};
