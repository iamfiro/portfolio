import { createLayerScene } from "@/feature/showreel/utils/layer.util";

import {
  COLUMN_BACKGROUND,
  COLUMN_CAMERA_KEYS,
  COLUMN_FRAMES,
  COLUMN_LAYERS,
} from "./columns-track.util";

/** 짙은 초록 바탕에서 캡슐 기둥들이 위아래로 엇갈려 미끄러진다 */
export const columnsScene = createLayerScene({
  id: "columns",
  beats: 1.5,
  frames: COLUMN_FRAMES,
  background: COLUMN_BACKGROUND,
  cameraKeys: COLUMN_CAMERA_KEYS,
  layers: COLUMN_LAYERS,
});
