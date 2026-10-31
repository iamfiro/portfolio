import { createLayerScene } from "@/feature/showreel/utils/layer.util";

import {
  STRIPE_BACKGROUND,
  STRIPE_CAMERA_KEYS,
  STRIPE_FRAMES,
  STRIPE_LAYERS,
} from "./stripes-track.util";

/** 흰 바탕에 줄무늬가 픽셀 가장자리를 달고 밀려 들어와 채우고, 카메라가 렌즈처럼 휘며 다가간다 */
export const stripesScene = createLayerScene({
  id: "stripes",
  beats: 1.5,
  frames: STRIPE_FRAMES,
  background: STRIPE_BACKGROUND,
  cameraKeys: STRIPE_CAMERA_KEYS,
  layers: STRIPE_LAYERS,
});
