import type { ReelScene } from "@/feature/showreel/showreel.type";

import { sceneBeats } from "../scene.util";

import type { ProjectsSceneState } from "./projects.type";
import { buildProjectsTimeline, createProjectsRenderer } from "./projects.util";

/** 5마디 프로젝트 몽타주. 박마다 한 컷, 마지막 마디는 네 장을 모아 본다 */
export const projectsScene: ReelScene<ProjectsSceneState> = {
  id: "projects",
  beats: sceneBeats("projects"),
  createState: () => ({ clock: 0 }),
  build: buildProjectsTimeline,
  createRenderer: createProjectsRenderer,
};
