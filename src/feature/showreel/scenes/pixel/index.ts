import type { ReelScene } from "@/feature/showreel/showreel.type";

import {
  buildPixelTimeline,
  createPixelRenderer,
  type PixelSceneState,
} from "./pixel.util";

/** 어두운 바탕에서 정사각 칸이 가운데서 번지고, 줄마다 엇갈려 밀린 뒤, 바깥부터 사라진다 */
export const pixelScene: ReelScene<PixelSceneState> = {
  id: "pixel",
  beats: 2,
  createState: () => ({ bloom: 0, shear: 0, collapse: 0 }),
  build: buildPixelTimeline,
  createRenderer: createPixelRenderer,
};
