import type {
  ReelBlend,
  ReelBox,
  ReelColor,
  ReelCrop,
  ReelFrame,
  ReelTextOptions,
} from "../stage.type";

import { createFrame } from "./frame.util";
import {
  createFullscreenPass,
  createProgram,
  hexToRgb,
  SHARED_GLSL,
} from "./gl.util";
import type { ReelFontKey } from "./glyph.util";
import { createGlyphAtlas } from "./glyph.util";
import { REEL_FPS } from "./music.util";
import { REEL_GRADIENT, REEL_PALETTE } from "./palette.util";

const MAX_SPRITES = 1024;
/** 스프라이트 하나: 상자 · uv · 색 · 마스크 · (모드, 칠 방식, -, -) */
const FLOATS = 20;
const NO_CLIP: ReelBox = [-1e5, -1e5, 1e5, 1e5];
const MODE = {
  glyph: 0,
  glyphMaterial: 1,
  solid: 2,
  material: 3,
  image: 4,
} as const;

const SPRITE_VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec4 aRect;
layout(location = 1) in vec4 aUv;
layout(location = 2) in vec4 aColor;
layout(location = 3) in vec4 aClip;
layout(location = 4) in vec4 aMode;

uniform vec2 uFrame;

out vec2 vPos;
out vec2 vUv;
out vec4 vColor;
flat out vec4 vClip;
flat out vec4 vRect;
flat out vec4 vMode;

void main() {
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vec2 position = mix(aRect.xy, aRect.zw, corner);
  vPos = position;
  vUv = mix(aUv.xy, aUv.zw, corner);
  vColor = aColor;
  vClip = aClip;
  vRect = aRect;
  vMode = aMode;
  vec2 ndc = position / uFrame * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}`;

const SPRITE_FRAGMENT_SHADER = `#version 300 es
precision highp float;

#define GRADIENT_STOPS ${REEL_GRADIENT.length}

${SHARED_GLSL}

uniform vec2 uFrame;
// 화면 픽셀 하나가 프레임 몇 단위인지
uniform float uPixel;
uniform float uMaterialTime;
uniform float uPulse;
uniform vec3 uStopColor[GRADIENT_STOPS];
uniform float uStopAt[GRADIENT_STOPS];
uniform sampler2D uAtlas;
uniform sampler2D uImage;

in vec2 vPos;
in vec2 vUv;
in vec4 vColor;
flat in vec4 vClip;
flat in vec4 vRect;
flat in vec4 vMode;

out vec4 outColor;

// 주름 수(짧은 변 1당 라디안)
const float FOLD_FREQUENCY = 13.0;
// 색 바퀴 한 바퀴를 세로로 펼친 길이의 역수
const float RAMP_SPAN = 0.55;
// 마루의 윤기와 빛줄기 색. 따뜻한 흰빛이다
const vec3 SHEEN = vec3(1.0, 0.95, 0.88);

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    sum += noise(p) * amplitude;
    p = p * 2.03 + 17.1;
    amplitude *= 0.5;
  }
  return sum / 0.875;
}

vec3 gradientMap(float f) {
  vec3 color = uStopColor[0];
  for (int i = 1; i < GRADIENT_STOPS; i++) {
    float t = clamp((f - uStopAt[i - 1]) / (uStopAt[i] - uStopAt[i - 1]), 0.0, 1.0);
    color = mix(color, uStopColor[i], smoothstep(0.0, 1.0, t));
  }
  return color;
}

/**
 * 재질: 화면 전체에 드리운 주름진 천 한 장. 화면 좌표로 칠해 어느 상자로 내다봐도 같은 천이 이어진다.
 * 주름마다 색 바퀴의 다른 자리를 세로로 펼쳐 줄무늬처럼 어긋난 그라디언트가 위로 천천히 흐르고,
 * 강세(uPulse)마다 대각선 빛줄기가 쓸고 지나간다.
 */
vec3 fabric(vec2 p) {
  vec2 uv = (p - uFrame * 0.5) / min(uFrame.x, uFrame.y);
  float t = uMaterialTime;

  float bend = sin(uv.y * 1.7 + t * 0.6) * 0.9 + (fbm(vec2(uv.x * 1.2, uv.y * 0.8 + t * 0.18)) - 0.5) * 4.0;
  float u = uv.x * FOLD_FREQUENCY + bend;
  float height = sin(u) * 0.62 + sin(u * 1.9 + 1.3 + t * 0.4) * 0.3 + sin(u * 3.7 + 0.7) * 0.08;
  float slope = cos(u) * 0.62 + cos(u * 1.9 + 1.3 + t * 0.4) * 0.57 + cos(u * 3.7 + 0.7) * 0.3;

  float phase = uv.y * RAMP_SPAN + height * 0.16 + sin(u * 0.37 + 1.1) * 0.14 + t * 0.045;
  vec3 color = gradientMap(fract(phase));
  color *= 0.86 + slope * 0.09 + height * 0.05;
  color = mix(color, SHEEN, pow(clamp(slope * 0.6, 0.0, 1.0), 4.0) * 0.35);

  float sweepAt = mix(1.4, -1.2, uPulse);
  float sweep = exp(-pow((uv.x + uv.y * 0.55 - sweepAt) * 2.6, 2.0));
  return mix(color, SHEEN, sweep * uPulse * 0.5);
}

// 상자 가장자리를 화면 픽셀 하나 폭으로 부드럽게 덮는다
float coverage(vec4 box) {
  vec2 d = min(vPos - box.xy, box.zw - vPos) / uPixel + 0.5;
  return clamp(d.x, 0.0, 1.0) * clamp(d.y, 0.0, 1.0);
}

void main() {
  // 미분이 필요한 표본은 분기 전에 뜬다
  float distance = texture(uAtlas, vUv).r;
  float edge = max(fwidth(distance) * 0.75, 1e-4);
  vec4 picture = texture(uImage, vUv);

  float mode = vMode.x;
  float alpha;
  vec3 color;
  if (mode < 1.5) {
    alpha = smoothstep(0.5 - edge, 0.5 + edge, distance);
    color = mode < 0.5 ? vColor.rgb : fabric(vPos);
  } else if (mode < 3.5) {
    alpha = coverage(vRect);
    color = mode < 2.5 ? vColor.rgb : fabric(vPos);
  } else {
    // 그림은 미리 곱한 알파로 올려 두었다. 물들이기면 모양(알파)만 그 색으로 칠한다
    alpha = coverage(vRect) * picture.a;
    color = vMode.y > 0.5 ? vColor.rgb : picture.rgb / max(picture.a, 1e-4);
  }
  alpha *= vColor.a * coverage(vClip);
  outColor = vec4(color * alpha, alpha);
}`;

const POST_FRAGMENT_SHADER = `#version 300 es
precision highp float;

${SHARED_GLSL}

uniform sampler2D uScene;
uniform float uInvert;
uniform float uClock;

out vec4 outColor;

const float GRAIN = 0.03;

// 정수 해시(pcg3d). 화면 좌표가 커도 무늬가 생기지 않는다
float grain(vec2 pixel, float frame) {
  uvec3 v = uvec3(uvec2(pixel), uint(frame)) * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  return float(v.x) / 4294967295.0 - 0.5;
}

void main() {
  vec3 color = texture(uScene, gl_FragCoord.xy / uResolution).rgb;
  color = mix(color, 1.0 - color, uInvert);
  // 프레임마다 바뀌는 고운 입자로 디지털 평면 느낌을 지운다
  color += grain(gl_FragCoord.xy, floor(uClock * ${REEL_FPS.toFixed(1)})) * GRAIN;
  outColor = vec4(color, 1.0);
}`;

interface ReelImage {
  texture: WebGLTexture | null;
  width: number;
  height: number;
}

/** 그림을 상자에 cover로 채울 때 보이는 uv. focus 둘레를 zoom배 확대하고 그림 밖으로는 나가지 않는다 */
function coverUv(
  image: ReelImage,
  box: ReelBox,
  { focus, zoom }: ReelCrop,
): [number, number, number, number] {
  const boxAspect = (box[2] - box[0]) / Math.max(1e-3, box[3] - box[1]);
  const imageAspect = image.width / image.height;
  let width = 1;
  let height = 1;
  if (imageAspect > boxAspect) width = boxAspect / imageAspect;
  else height = imageAspect / boxAspect;
  width /= zoom;
  height /= zoom;
  const cx = Math.min(Math.max(focus[0], width / 2), 1 - width / 2);
  const cy = Math.min(Math.max(focus[1], height / 2), 1 - height / 2);
  return [cx - width / 2, cy - height / 2, cx + width / 2, cy + height / 2];
}

/**
 * 쇼릴 무대. 장면들이 한 GL 컨텍스트에서 함께 쓰는 2D 그리기 도구다.
 * 글자(거리장) · 단색 · 그라디언트 재질 · 그림을 모두 마스크가 달린 사각형으로 그리고,
 * 한 장면을 화면 밖 버퍼에 그린 뒤 반전 플래시와 입자를 얹어 화면에 낸다.
 */
function createStage(gl: WebGL2RenderingContext) {
  const atlas = createGlyphAtlas();
  const sprite = createProgram(
    gl,
    SPRITE_VERTEX_SHADER,
    SPRITE_FRAGMENT_SHADER,
  );
  const post = createFullscreenPass(gl, POST_FRAGMENT_SHADER);

  const instances = new Float32Array(MAX_SPRITES * FLOATS);
  const buffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, instances.byteLength, gl.DYNAMIC_DRAW);
  for (let attribute = 0; attribute < 5; attribute++) {
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(
      attribute,
      4,
      gl.FLOAT,
      false,
      FLOATS * 4,
      attribute * 16,
    );
    gl.vertexAttribDivisor(attribute, 1);
  }
  gl.bindVertexArray(null);

  const atlasTexture = gl.createTexture();
  // 그림이 없는 스프라이트가 묶어 둘 1×1 빈 텍스처
  const blank = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blank);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(4),
  );
  gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8,
    1,
    1,
    0,
    gl.RED,
    gl.UNSIGNED_BYTE,
    new Uint8Array(1),
  );

  const sceneTexture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  let targetWidth = 0;
  let targetHeight = 0;

  const images = new Map<string, ReelImage>();
  const pending: Promise<void>[] = [];
  let frame: ReelFrame = createFrame(1, 1, 1);
  let frameKey = "";

  let count = 0;
  let blend: ReelBlend = "normal";
  let texture: WebGLTexture | null = blank;

  const stopColors = REEL_GRADIENT.flatMap(([, color]) => hexToRgb(color));
  const stopAt = REEL_GRADIENT.map(([position]) => position);
  const ink = hexToRgb(REEL_PALETTE.ink);

  // 개발 모드의 두 번 마운트처럼 준비 중에 버려지면 늦게 도착한 글자·그림을 올리지 않는다
  let disposed = false;

  const ready = new Promise<void>((resolve, reject) => {
    // 장면들이 같은 틱 안에서 쓸 글자와 그림을 모두 알려 준 다음에 한 번에 준비한다
    queueMicrotask(() => {
      atlas
        .build()
        .then(() => {
          if (disposed) return;
          gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
          gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.R8,
            atlas.size,
            atlas.size,
            0,
            gl.RED,
            gl.UNSIGNED_BYTE,
            atlas.data,
          );
          gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MIN_FILTER,
            gl.LINEAR_MIPMAP_LINEAR,
          );
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          return Promise.all(pending);
        })
        .then(() => resolve(), reject);
    });
  });

  const ensureTarget = () => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    if (width === targetWidth && height === targetHeight) return;
    targetWidth = width;
    targetHeight = height;
    gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      sceneTexture,
      0,
    );
  };

  const flush = () => {
    if (count === 0) return;
    if (blend === "invert")
      gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_SRC_COLOR);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, instances, 0, count * FLOATS);
    gl.bindVertexArray(vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    gl.bindVertexArray(null);
    count = 0;
  };

  const push = (
    rect: ReelBox,
    uv: readonly number[],
    color: ReelColor,
    clip: ReelBox | undefined,
    mode: number,
    options: {
      blend?: ReelBlend;
      texture?: WebGLTexture | null;
      tint?: boolean;
    } = {},
  ) => {
    const nextBlend = options.blend ?? "normal";
    const nextTexture = options.texture ?? blank;
    if (
      nextBlend !== blend ||
      nextTexture !== texture ||
      count === MAX_SPRITES
    ) {
      flush();
      blend = nextBlend;
      texture = nextTexture;
    }
    instances.set(rect, count * FLOATS);
    instances.set(uv, count * FLOATS + 4);
    instances.set(color, count * FLOATS + 8);
    instances.set(clip ?? NO_CLIP, count * FLOATS + 12);
    instances.set([mode, options.tint ? 1 : 0, 0, 0], count * FLOATS + 16);
    count++;
  };

  return {
    ready,

    /** 이 글꼴로 이 글자들을 쓸 것이라고 알려 둔다. 장면 렌더러를 만들 때 부른다 */
    request(font: ReelFontKey, text: string) {
      atlas.request(font, text);
    },

    /** 그림을 받아 둔다. 장면 렌더러를 만들 때 부른다 */
    requestImage(src: string) {
      if (images.has(src)) return;
      const image: ReelImage = {
        texture: gl.createTexture(),
        width: 0,
        height: 0,
      };
      images.set(src, image);
      const element = new Image();
      // decode()는 숨은 탭에서 끝나지 않을 수 있어 load 이벤트를 기다린다
      const loaded = new Promise<void>((resolve, reject) => {
        element.onload = () => resolve();
        element.onerror = () =>
          reject(new Error(`그림을 받지 못했습니다: ${src}`));
      });
      element.src = src;
      pending.push(
        loaded
          .then(() => {
            if (disposed) return;
            gl.bindTexture(gl.TEXTURE_2D, image.texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              element,
            );
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_MIN_FILTER,
              gl.LINEAR_MIPMAP_LINEAR,
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_S,
              gl.CLAMP_TO_EDGE,
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_T,
              gl.CLAMP_TO_EDGE,
            );
            image.width = element.naturalWidth;
            image.height = element.naturalHeight;
          })
          .catch(() => {
            // 그림을 못 받으면 그 자리는 비워 둔다
          }),
      );
    },

    /** 글자 크기 1 기준 모양 정보 */
    measure(font: ReelFontKey, text: string) {
      return atlas.metrics(font, text);
    },

    /**
     * 한 프레임을 시작한다. 화면 밖 버퍼를 검정으로 비우고, 지금 화면 크기의 프레임을 돌려준다.
     * materialTime은 재질이 흐르는 시계로, 장면이 바뀌어도 이어지도록 쇼릴 시간을 넘긴다.
     */
    begin({
      materialTime = 0,
      pulse = 0,
    }: { materialTime?: number; pulse?: number } = {}) {
      const canvas = gl.canvas as HTMLCanvasElement;
      // 캔버스가 아직 배치되지 않았으면(높이 0) 버퍼 높이로 CSS 높이를 어림한다
      const cssHeight =
        canvas.clientHeight ||
        gl.drawingBufferHeight / Math.max(1, window.devicePixelRatio);
      const key = `${gl.drawingBufferWidth}x${gl.drawingBufferHeight}x${cssHeight}`;
      if (key !== frameKey) {
        frameKey = key;
        frame = createFrame(
          gl.drawingBufferWidth,
          gl.drawingBufferHeight,
          cssHeight,
        );
      }

      ensureTarget();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, targetWidth, targetHeight);
      gl.clearColor(ink[0], ink[1], ink[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);

      gl.useProgram(sprite.program);
      gl.uniform2f(sprite.uniform("uFrame"), frame.width, frame.height);
      gl.uniform1f(sprite.uniform("uPixel"), frame.pixel);
      gl.uniform1f(sprite.uniform("uMaterialTime"), materialTime);
      gl.uniform1f(sprite.uniform("uPulse"), pulse);
      gl.uniform3fv(sprite.uniform("uStopColor"), stopColors);
      gl.uniform1fv(sprite.uniform("uStopAt"), stopAt);
      gl.uniform1i(sprite.uniform("uAtlas"), 0);
      gl.uniform1i(sprite.uniform("uImage"), 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      return frame;
    },

    rect(
      box: ReelBox,
      color: ReelColor,
      options: { clip?: ReelBox; blend?: ReelBlend } = {},
    ) {
      push(box, [0, 0, 0, 0], color, options.clip, MODE.solid, options);
    },

    /** 그라디언트 재질을 내다보는 상자 */
    material(box: ReelBox, options: { clip?: ReelBox; opacity?: number } = {}) {
      push(
        box,
        [0, 0, 0, 0],
        [1, 1, 1, options.opacity ?? 1],
        options.clip,
        MODE.material,
      );
    },

    /** 그림을 상자에 cover로 채운다. tint를 주면 그림의 모양만 그 색으로 칠한다 */
    image(
      src: string,
      box: ReelBox,
      options: {
        crop?: ReelCrop;
        clip?: ReelBox;
        tint?: ReelColor;
        opacity?: number;
      } = {},
    ) {
      const image = images.get(src);
      if (!image || image.width === 0) return;
      const uv = coverUv(
        image,
        box,
        options.crop ?? { focus: [0.5, 0.5], zoom: 1 },
      );
      const color: ReelColor = options.tint ?? [1, 1, 1, options.opacity ?? 1];
      push(box, uv, color, options.clip, MODE.image, {
        texture: image.texture,
        tint: Boolean(options.tint),
      });
    },

    /** 글자 한 줄. 펜 자리는 커닝까지 반영하고, 글자마다 옮기거나 재질로 칠할 수 있다 */
    text(content: string, options: ReelTextOptions) {
      const font = options.font as ReelFontKey;
      const metrics = atlas.metrics(font, content);
      const { size } = options;
      const width = metrics.width * size;
      const start =
        options.align === "center"
          ? options.x - width / 2
          : options.align === "right"
            ? options.x - width
            : options.x;
      const color = options.color ?? [1, 1, 1, 1];

      Array.from(content).forEach((character, index) => {
        const glyph = atlas.glyph(font, character);
        if (!glyph) return;
        const scale = size / glyph.raster;
        const [dx, dy] = options.shift?.(index) ?? [0, 0];
        let x0 =
          start + metrics.offsets[index] * size + glyph.left * scale + dx;
        let y0 = options.baseline + glyph.top * scale + dy;
        let x1 = x0 + glyph.width * scale;
        let y1 = y0 + glyph.height * scale;
        if (options.zoom) {
          const { origin, factor } = options.zoom;
          x0 = origin[0] + (x0 - origin[0]) * factor;
          x1 = origin[0] + (x1 - origin[0]) * factor;
          y0 = origin[1] + (y0 - origin[1]) * factor;
          y1 = origin[1] + (y1 - origin[1]) * factor;
        }
        const mode = options.material?.(index)
          ? MODE.glyphMaterial
          : MODE.glyph;
        push([x0, y0, x1, y1], glyph.uv, color, options.clip, mode, {
          blend: options.blend,
        });
      });
      return { start, width };
    },

    /** 프레임을 끝내고 화면에 낸다. invert면 화면 전체를 반전한다(강조 박의 플래시) */
    end({ clock, invert = false }: { clock: number; invert?: boolean }) {
      flush();
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      post.use();
      gl.uniform1i(post.uniform("uScene"), 0);
      gl.uniform1f(post.uniform("uInvert"), invert ? 1 : 0);
      gl.uniform1f(post.uniform("uClock"), clock);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
      post.draw();
    },

    dispose() {
      disposed = true;
      images.forEach(({ texture: imageTexture }) =>
        gl.deleteTexture(imageTexture),
      );
      gl.deleteTexture(atlasTexture);
      gl.deleteTexture(blank);
      gl.deleteTexture(sceneTexture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(sprite.program);
      post.dispose();
    },
  };
}

export type ReelStage = ReturnType<typeof createStage>;

const stages = new WeakMap<
  WebGL2RenderingContext,
  { stage: ReelStage; users: number }
>();

/** 이 컨텍스트의 무대를 빌린다. 장면 렌더러마다 한 번 빌리고 dispose에서 돌려준다 */
export function acquireStage(gl: WebGL2RenderingContext) {
  const entry = stages.get(gl) ?? { stage: createStage(gl), users: 0 };
  entry.users++;
  stages.set(gl, entry);

  let released = false;
  return {
    stage: entry.stage,
    release() {
      if (released) return;
      released = true;
      entry.users--;
      if (entry.users > 0) return;
      entry.stage.dispose();
      stages.delete(gl);
    },
  };
}
