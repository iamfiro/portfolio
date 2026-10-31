import type { ReelScene } from "@/feature/showreel/showreel.type";

import { outroScene } from "./outro";
import { projectsScene } from "./projects";
import { taglineScene } from "./tagline";
import { titleScene } from "./title";

/**
 * 쇼릴 장면 순서. 위에서부터 박자 칸에 이어 붙고, 끝나면 처음으로 돌아간다.
 * 길이는 scene.util의 REEL_SEQUENCE가 정한다. 줄무늬·컬럼·픽셀 장면은 색·그리드 규칙과 맞지 않아 순서에서 뺐다.
 */
export const SHOWREEL_SCENES: ReelScene[] = [
  titleScene,
  taglineScene,
  projectsScene,
  outroScene,
] as ReelScene[];

/** 모션 줄이기일 때 멈춰 보여줄 장면과 그 안의 위치(0~1). 타이틀의 Sung · ju hold 프레임이다 */
export const SHOWREEL_STILL = { scene: "title", progress: 3.5 / 8 };
