import gsap from "gsap";

import {
  createFullscreenPass,
  hexToRgb,
  SHARED_GLSL,
} from "@/feature/showreel/utils/gl.util";
import { frames } from "@/feature/showreel/utils/music.util";

/** 픽셀 장면 진행도. 모두 0~1 */
export interface PixelSceneState {
  /** 가운데서 칸이 번져 나오는 정도 */
  bloom: number;
  /** 줄마다 엇갈려 미끄러지는 정도 */
  shear: number;
  /** 바깥부터 칸이 사라지는 정도 */
  collapse: number;
}

/** 장면 자체 길이(24fps 프레임) */
export const PIXEL_FRAMES = 24;

/**
 * 진행도 구간: [시작 프레임, 끝 프레임, ease].
 * 가운데서 번져 나오고 → 줄마다 엇갈려 밀린 뒤 → 바깥부터 사라진다.
 */
const PIXEL_TRACKS = {
  bloom: [0, 10, "sine.inOut"],
  shear: [11, 16, "power2.inOut"],
  collapse: [17, 23, "power3.in"],
} as const;

/** 바탕과 칸 색. 줄무늬의 따뜻한 색과 기둥의 차가운 색을 한 바퀴로 잇는다 */
const PIXEL_INK = "#171717";
const PIXEL_COLORS = [
  "#ee62c6",
  "#ec6440",
  "#f3bc20",
  "#13a05a",
  "#268be7",
  "#8470ec",
];

/**
 * 진행도를 ease 곡선대로 계산해 프레임마다 찍는다.
 * 다른 장면처럼 24fps로 끊기며 넘어가도록 보간하지 않고 붙잡아 둔다.
 */
export function buildPixelTimeline(
  timeline: gsap.core.Timeline,
  state: PixelSceneState,
) {
  const tracks = Object.entries(PIXEL_TRACKS).map(
    ([key, [from, to, ease]]) => ({
      key,
      from,
      to,
      ease: gsap.parseEase(ease),
    }),
  );

  for (let frame = 0; frame < PIXEL_FRAMES; frame++) {
    const values = Object.fromEntries(
      tracks.map(({ key, from, to, ease }) => [
        key,
        ease(gsap.utils.clamp(0, 1, (frame - from) / (to - from))),
      ]),
    );
    timeline.set(state, values, frames(frame));
  }
  timeline.set({}, {}, frames(PIXEL_FRAMES));
}

const PIXEL_FRAGMENT_SHADER = `#version 300 es
precision highp float;

#define PIXEL_COLOR_COUNT ${PIXEL_COLORS.length}

${SHARED_GLSL}

uniform vec3 uBackground;
// bloom, shear, collapse
uniform vec3 uPixel;
uniform vec3 uPixelColors[PIXEL_COLOR_COUNT];

out vec4 outColor;

const float PIXEL_CELL = 60.0;
const float PIXEL_GAP = 8.0;
const float PIXEL_REACH = 1150.0;
const float PIXEL_JITTER = 0.18;
const float PIXEL_SHEAR_CELLS = 3.0;

vec3 pixelPalette(float k) {
  float x = fract(k) * float(PIXEL_COLOR_COUNT);
  int i = int(floor(x));
  return mix(uPixelColors[i], uPixelColors[(i + 1) % PIXEL_COLOR_COUNT], fract(x));
}

void main() {
  vec2 p = referencePoint() - REFERENCE * 0.5;
  float row = floor(p.y / PIXEL_CELL);
  float direction = mod(row, 2.0) < 1.0 ? 1.0 : -1.0;
  p.x -= direction * uPixel.y * PIXEL_CELL * PIXEL_SHEAR_CELLS;

  vec2 cell = floor(p / PIXEL_CELL);
  vec2 center = (cell + 0.5) * PIXEL_CELL;
  vec2 local = abs(p - center);

  // 칸마다 조금씩 다른 박자로 켜지고 꺼져 가장자리가 들쭉날쭉하다
  float reach = length(center) / PIXEL_REACH + hash(cell + 3.7) * PIXEL_JITTER;
  float on = step(reach, uPixel.x * (1.0 + PIXEL_JITTER)) * step(reach, (1.0 - uPixel.z) * (1.0 + PIXEL_JITTER));

  float size = (PIXEL_CELL - PIXEL_GAP) * (1.0 - uPixel.z * 0.4) * 0.5;
  float inside = step(max(local.x, local.y), size);

  // 가운데서 퍼지는 동심 띠가 기본이고, 각도에 따라 띠가 살짝 일렁인다(한 바퀴 돌아 이음매 없이 맞물린다)
  float wobble = sin(atan(center.y, center.x) * 3.0) * 0.06;
  vec3 tint = pixelPalette(length(center) / PIXEL_REACH * 1.4 + wobble + uPixel.y * 0.5);
  outColor = vec4(mix(uBackground, tint, on * inside), 1.0);
}`;

/** 어두운 바탕 위 정사각 칸 격자를 그리는 렌더러 */
export function createPixelRenderer(gl: WebGL2RenderingContext) {
  const pass = createFullscreenPass(gl, PIXEL_FRAGMENT_SHADER);
  const background = hexToRgb(PIXEL_INK);
  const colors = PIXEL_COLORS.flatMap(hexToRgb);

  return {
    draw({ bloom, shear, collapse }: PixelSceneState) {
      pass.use();
      gl.uniform3fv(pass.uniform("uBackground"), background);
      gl.uniform3f(pass.uniform("uPixel"), bloom, shear, collapse);
      gl.uniform3fv(pass.uniform("uPixelColors"), colors);
      pass.draw();
    },
    dispose: pass.dispose,
  };
}
