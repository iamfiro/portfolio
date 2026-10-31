import type {
  LayerSceneState,
  ReelCameraKey,
  ReelKey,
  ReelLayer,
  ReelLayerState,
} from "../layer.type";
import type { ReelScene } from "../showreel.type";

import { createFullscreenPass, hexToRgb, SHARED_GLSL } from "./gl.util";
import { frames } from "./music.util";

const RAMP_RESOLUTION = 256;
const MAX_LAYERS = 16;

function keyValues([
  ,
  x0,
  x1,
  y0,
  y1,
  rampStart,
  rampSpan,
  softX,
  softY,
]: ReelKey) {
  return { x0, x1, y0, y1, rampStart, rampSpan, softX, softY };
}

function cameraValues([, centerX, centerY, zoom, warpX, warpY]: ReelCameraKey) {
  return { centerX, centerY, zoom, warpX, warpY };
}

/**
 * 레이어 키를 프레임 시각에 그대로 찍는다.
 * 사이를 보간하지 않고 다음 키까지 붙잡아 두어 24fps로 끊기며 넘어간다.
 */
function addLayerKeys(
  timeline: gsap.core.Timeline,
  target: ReelLayerState,
  keys: ReelKey[],
) {
  keys.forEach((key, index) =>
    timeline.set(
      target,
      index === 0 ? { visible: 1, ...keyValues(key) } : keyValues(key),
      frames(key[0]),
    ),
  );
  timeline.set(target, { visible: 0 }, frames(keys[keys.length - 1][0] + 1));
}

/** 레이어마다 램프 정지점을 한 줄씩 그려 텍스처로 쓸 캔버스를 만든다 */
function drawRampAtlas(layers: ReelLayer[]) {
  const canvas = document.createElement("canvas");
  canvas.width = RAMP_RESOLUTION;
  canvas.height = layers.length;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("램프 캔버스를 만들 수 없습니다");

  layers.forEach(({ stops }, row) => {
    const gradient = ctx.createLinearGradient(0, 0, RAMP_RESOLUTION, 0);
    stops.forEach(([position, color]) =>
      gradient.addColorStop(position, color),
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(0, row, RAMP_RESOLUTION, 1);
  });
  return canvas;
}

const LAYER_FRAGMENT_SHADER = `#version 300 es
precision highp float;

#define MAX_LAYERS ${MAX_LAYERS}

${SHARED_GLSL}

uniform vec3 uCamera;
uniform vec2 uWarp;
uniform vec3 uBackground;
uniform int uCount;
uniform float uRampRows;
uniform sampler2D uRamps;

// x0, x1, y0, y1
uniform vec4 uBox[MAX_LAYERS];
// rampStart, rampSpan, visible, -
uniform vec4 uRamp[MAX_LAYERS];
// softX, softY, capsuleJoint, capsulePeriod(0이면 줄무늬)
uniform vec4 uSoft[MAX_LAYERS];

out vec4 outColor;

float band(float lo, float hi, float soft, float v) {
  float h = soft * 0.5;
  return smoothstep(lo - h, lo + h, v) * (1.0 - smoothstep(hi - h, hi + h, v));
}

// 가로 경계는 흐림 폭의 절반만큼 바깥으로 밀어, 맞닿은 이웃과 경계 픽셀을 함께 덮어 틈이 비치지 않게 한다
float columnBand(vec4 box, float soft, float v) {
  float h = soft * 0.5;
  return band(box.x - h, box.y + h, soft, v);
}

// 줄무늬가 흰 바탕을 채워 들어오는 끝을 정사각 픽셀 칸으로 부순다
const float PIXEL_COLUMNS = 10.0;
// 가장자리에서 안쪽으로 부서지는 줄 수
const float PIXEL_ROWS = 6.0;
// 이보다 멀리 있는 가장자리는 화면 밖(이미 다 채운 상태)으로 본다
const float EDGE_LIMIT = 2500.0;

// depth: 가장자리에서 안쪽으로 잰 거리(칸 단위, 음수면 바깥)
// 가장자리에 가까운 칸일수록 하얗게 빠지고, 바깥 두 줄엔 몇 칸이 먼저 튀어나간다
float pixelEdge(float depth, float column, float seed, float cover) {
  float row = floor(depth);
  if (row < -2.0 || row >= PIXEL_ROWS) return cover;

  float h = hash(vec2(column, row) + seed);
  if (row < 0.0) return step(h, row < -1.0 ? 0.08 : 0.28);

  float white = 0.6 * pow(1.0 - row / PIXEL_ROWS, 1.6);
  return cover * step(white, h);
}

// 줄무늬 세로 범위. 가장자리 위치를 씨앗으로 써서 가장자리가 움직이는 프레임마다 무늬가 바뀐다
float stripeCover(vec4 box, vec4 soft, vec2 p, float aa) {
  float cover = band(box.z, box.w, max(soft.y, aa), p.y);
  float cell = (box.y - box.x) / PIXEL_COLUMNS;
  float column = floor((p.x - box.x) / cell);

  if (abs(box.z) < EDGE_LIMIT) {
    cover = pixelEdge((p.y - box.z) / cell, column, floor(box.z) * 0.137, cover);
  }
  if (abs(box.w) < EDGE_LIMIT) {
    cover = pixelEdge((box.w - p.y) / cell, column + 17.0, floor(box.w) * 0.173, cover);
  }
  return cover;
}

float capsuleEdge(vec2 q, float radius, float blurY, float aa) {
  float sdf = length(q) - radius - aa * 0.5;
  float blur = mix(aa, max(aa, blurY), abs(q.y) / max(length(q), 1e-3));
  return 1.0 - smoothstep(-blur * 0.5, blur * 0.5, sdf);
}

// 캡슐 기둥: 주기마다 반원 끝을 가진 캡슐이 맞닿아 쌓인다
float capsule(vec4 box, vec4 soft, float rampStart, vec2 p, float aa) {
  float radius = (box.y - box.x) * 0.5;
  float period = soft.w;
  float local = mod(p.y - rampStart - soft.z, period);
  vec2 q = vec2(p.x - (box.x + box.y) * 0.5, local - period * 0.5);
  q.y = max(abs(q.y) - (period * 0.5 - radius), 0.0);
  return capsuleEdge(q, radius, soft.y, aa);
}

void main() {
  vec2 screen = referencePoint();

  // 화면 → 월드: 렌즈 왜곡을 고정점 반복으로 되돌리고 줌을 푼다
  vec2 d = screen - uCamera.xy;
  float dx = d.x;
  for (int i = 0; i < 4; i++) {
    float warp = 1.0 + uWarp.x * pow(dx / REFERENCE.y, 2.0) + uWarp.y * pow(d.y / REFERENCE.y, 2.0);
    dx = d.x / warp;
  }
  vec2 world = uCamera.xy + vec2(dx, d.y) / uCamera.z;
  float aa = 1.0 / (coverScale() * uCamera.z);

  vec3 color = uBackground;
  for (int i = 0; i < MAX_LAYERS; i++) {
    if (i >= uCount) break;
    vec4 ramp = uRamp[i];
    if (ramp.z <= 0.0) continue;

    vec4 box = uBox[i];
    vec4 soft = uSoft[i];
    float cover = soft.w > 0.0
      ? columnBand(box, aa, world.x) * capsule(box, soft, ramp.x, world, aa)
      : columnBand(box, max(soft.x, aa), world.x) * stripeCover(box, soft, world, aa);
    if (cover <= 0.0) continue;

    float u = clamp((world.y - ramp.x) / ramp.y, 0.0, 1.0);
    vec3 tint = texture(uRamps, vec2(u, (float(i) + 0.5) / uRampRows)).rgb;
    color = mix(color, tint, cover * ramp.z);
  }

  outColor = vec4(color, 1.0);
}`;

/**
 * 레이어(그라디언트 램프를 담은 창)를 카메라 줌·렌즈 왜곡과 함께 합성하는 렌더러.
 * 장면마다 자기 레이어 묶음으로 하나씩 만든다.
 */
function createLayerRenderer(
  gl: WebGL2RenderingContext,
  layers: ReelLayer[],
  background: string,
) {
  if (layers.length > MAX_LAYERS) {
    throw new Error(`레이어는 장면당 ${MAX_LAYERS}개까지 그릴 수 있습니다`);
  }

  const pass = createFullscreenPass(gl, LAYER_FRAGMENT_SHADER);
  const rampTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rampTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    drawRampAtlas(layers),
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // 셰이더의 uSoft.zw: 캡슐 기둥은 [이음매, 주기], 줄무늬는 [0, 0]
  const shapes = layers.map(({ capsule }) => capsule ?? [0, 0]);
  const backgroundColor = hexToRgb(background);
  const box = new Float32Array(MAX_LAYERS * 4);
  const ramp = new Float32Array(MAX_LAYERS * 4);
  const soft = new Float32Array(MAX_LAYERS * 4);

  return {
    draw({ camera, layers: states }: LayerSceneState) {
      states.forEach((layer, index) => {
        const [joint, period] = shapes[index];
        box.set([layer.x0, layer.x1, layer.y0, layer.y1], index * 4);
        ramp.set(
          [layer.rampStart, layer.rampSpan, layer.visible, 0],
          index * 4,
        );
        soft.set([layer.softX, layer.softY, joint, period], index * 4);
      });

      pass.use();
      gl.uniform3f(
        pass.uniform("uCamera"),
        camera.centerX,
        camera.centerY,
        camera.zoom,
      );
      gl.uniform2f(pass.uniform("uWarp"), camera.warpX, camera.warpY);
      gl.uniform3fv(pass.uniform("uBackground"), backgroundColor);
      gl.uniform1i(pass.uniform("uCount"), states.length);
      gl.uniform1f(pass.uniform("uRampRows"), layers.length);
      gl.uniform4fv(pass.uniform("uBox"), box);
      gl.uniform4fv(pass.uniform("uRamp"), ramp);
      gl.uniform4fv(pass.uniform("uSoft"), soft);
      gl.uniform1i(pass.uniform("uRamps"), 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rampTexture);
      pass.draw();
    },
    dispose() {
      gl.deleteTexture(rampTexture);
      pass.dispose();
    },
  };
}

interface LayerSceneOptions {
  id: string;
  beats: number;
  fit?: ReelScene["fit"];
  /** 장면 자체 길이(24fps 프레임) */
  frames: number;
  background: string;
  cameraKeys: ReelCameraKey[];
  layers: ReelLayer[];
}

/** 측정 키프레임(레이어 + 카메라)으로 이뤄진 장면을 만든다 */
export function createLayerScene({
  id,
  beats,
  fit,
  frames: length,
  background,
  cameraKeys,
  layers,
}: LayerSceneOptions): ReelScene<LayerSceneState> {
  return {
    id,
    beats,
    fit,
    createState: () => ({
      camera: cameraValues(cameraKeys[0]),
      layers: layers.map(() => ({
        visible: 0,
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
        rampStart: 0,
        rampSpan: 1,
        softX: 1,
        softY: 1,
      })),
    }),
    build(timeline, state) {
      layers.forEach(({ keys }, index) =>
        addLayerKeys(timeline, state.layers[index], keys),
      );
      cameraKeys.forEach((key) =>
        timeline.set(state.camera, cameraValues(key), frames(key[0])),
      );
      timeline.set({}, {}, frames(length));
    },
    createRenderer: (gl) => createLayerRenderer(gl, layers, background),
  };
}
