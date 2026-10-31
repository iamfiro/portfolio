/** 로고 가로를 몇 칸으로 쪼갤지. 워드마크 글자 획(약 2.4 단위)이 한두 칸에 맞도록 고른 값 */
export const PIXEL_LOGO_COLUMNS = 168;

export interface PixelCell {
  col: number;
  row: number;
}

export interface PixelGrid {
  columns: number;
  rows: number;
  cells: PixelCell[];
}

export type RGB = [number, number, number];

/** 불투명도가 이 값 이상인 칸만 픽셀로 남긴다 */
const ALPHA_THRESHOLD = 128;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** 로고 이미지를 columns 칸 격자로 축소해 채워진 칸 목록을 만든다. */
export async function samplePixelGrid(
  src: string,
  columns: number,
): Promise<PixelGrid> {
  const img = await loadImage(src);
  const rows = Math.max(
    1,
    Math.round((columns * img.naturalHeight) / img.naturalWidth),
  );

  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { columns, rows, cells: [] };

  ctx.drawImage(img, 0, 0, columns, rows);
  const { data } = ctx.getImageData(0, 0, columns, rows);

  const cells: PixelCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (data[(row * columns + col) * 4 + 3] >= ALPHA_THRESHOLD) {
        cells.push({ col, row });
      }
    }
  }

  return { columns, rows, cells };
}

/**
 * 인트로에서 각 픽셀이 출발하는 순서. 0이면 가장 먼저, 1이면 가장 늦게 자리를 잡는다.
 * seed는 픽셀마다 고정된 0~1 난수다.
 */
export function getRevealDelay(
  cell: PixelCell,
  grid: Pick<PixelGrid, "columns" | "rows">,
  seed: number,
): number {
  // TODO(human)
  return 0;
}

/** CSS 색 문자열을 0~1 RGB로 바꾼다. 2D 캔버스에 넣었다 빼서 형식을 #rrggbb로 맞춘다. */
export function parseColor(value: string): RGB {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return [1, 1, 1];

  ctx.fillStyle = value.trim();
  const hex = ctx.fillStyle.replace("#", "");
  return [0, 2, 4].map(
    (offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255,
  ) as RGB;
}

const VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 aCell;
layout(location = 2) in vec2 aFrom;
layout(location = 3) in float aSeed;
layout(location = 4) in float aDelay;

uniform vec2 uGrid;
uniform float uTime;
uniform float uClock;
uniform vec2 uPointer;
uniform float uHover;
uniform float uSparkle;

out float vAccent;
out float vAlpha;

const float REVEAL_SPREAD = 1.4;
const float REVEAL_DURATION = 1.1;
const float HOVER_RADIUS = 16.0;
const float HOVER_PUSH = 3.2;
const float PIXEL_GAP = 0.14;
const float SPARKLE_RATE = 3.0;

float hash(float n) {
  return fract(sin(n * 12.9898) * 43758.5453);
}

void main() {
  float t = clamp((uTime - aDelay * REVEAL_SPREAD) / REVEAL_DURATION, 0.0, 1.0);
  float eased = 1.0 - pow(1.0 - t, 3.0);
  vec2 pos = mix(aFrom, aCell, eased);

  // 포인터 주변 픽셀은 바깥으로 밀려나며 브랜드 색으로 물든다
  vec2 diff = pos + 0.5 - uPointer;
  float influence = uHover * pow(max(0.0, 1.0 - length(diff) / HOVER_RADIUS), 2.0);
  pos += normalize(diff + 1e-4) * influence * HOVER_PUSH;

  // 픽셀마다 엇갈린 박자로 드물게 반짝였다 사그라든다
  float beat = uClock * SPARKLE_RATE + aSeed * 10.0;
  float sparkle = step(0.992, hash(aSeed * 91.7 + floor(beat))) * (1.0 - fract(beat));

  vAccent = clamp(max(max(1.0 - eased, influence * 1.6), sparkle * uSparkle), 0.0, 1.0);
  vAlpha = smoothstep(0.0, 0.4, t);

  vec2 vertex = pos + PIXEL_GAP * 0.5 + aCorner * (1.0 - PIXEL_GAP);
  vec2 clip = vertex / uGrid * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform vec3 uBase;
uniform vec3 uAccent;

in float vAccent;
in float vAlpha;

out vec4 outColor;

void main() {
  outColor = vec4(mix(uBase, uAccent, vAccent) * vAlpha, vAlpha);
}`;

export interface PixelLogoFrame {
  /** 인트로 시작 후 경과 초 */
  time: number;
  /** 반짝임용 전역 시계(초) */
  clock: number;
  /** 격자 좌표계의 포인터 위치 */
  pointer: { x: number; y: number };
  /** 포인터 영향 세기 0~1 */
  hover: number;
  sparkle: boolean;
}

export interface PixelLogoColors {
  base: RGB;
  accent: RGB;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("셰이더를 만들 수 없습니다");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log ?? "셰이더 컴파일 실패");
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log ?? "프로그램 링크 실패");
  }
  return program;
}

/** 픽셀 한 칸당 (col, row, fromX, fromY, seed, delay) 6개 float */
const INSTANCE_STRIDE = 6;

/**
 * 격자의 각 칸을 사각형 인스턴스 하나로 그리는 렌더러.
 * 위치·색 계산은 전부 셰이더가 하고, CPU는 프레임마다 유니폼만 넘긴다.
 */
export function createPixelLogoRenderer(
  gl: WebGL2RenderingContext,
  grid: PixelGrid,
  colors: PixelLogoColors,
) {
  const program = createProgram(gl);

  const instances = new Float32Array(grid.cells.length * INSTANCE_STRIDE);
  grid.cells.forEach((cell, index) => {
    const seed = Math.random();
    instances.set(
      [
        cell.col,
        cell.row,
        Math.random() * grid.columns,
        Math.random() * grid.rows,
        seed,
        getRevealDelay(cell, grid, seed),
      ],
      index * INSTANCE_STRIDE,
    );
  });

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const cornerBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, instances, gl.STATIC_DRAW);

  const bytes = Float32Array.BYTES_PER_ELEMENT;
  const layout: [location: number, size: number, offset: number][] = [
    [1, 2, 0],
    [2, 2, 2],
    [3, 1, 4],
    [4, 1, 5],
  ];
  layout.forEach(([location, size, offset]) => {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      INSTANCE_STRIDE * bytes,
      offset * bytes,
    );
    gl.vertexAttribDivisor(location, 1);
  });

  gl.bindVertexArray(null);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    grid: uniform("uGrid"),
    time: uniform("uTime"),
    clock: uniform("uClock"),
    pointer: uniform("uPointer"),
    hover: uniform("uHover"),
    sparkle: uniform("uSparkle"),
    base: uniform("uBase"),
    accent: uniform("uAccent"),
  };

  gl.useProgram(program);
  gl.uniform2f(u.grid, grid.columns, grid.rows);
  gl.uniform3fv(u.base, colors.base);
  gl.uniform3fv(u.accent, colors.accent);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  return {
    draw(frame: PixelLogoFrame) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(u.time, frame.time);
      gl.uniform1f(u.clock, frame.clock);
      gl.uniform2f(u.pointer, frame.pointer.x, frame.pointer.y);
      gl.uniform1f(u.hover, frame.hover);
      gl.uniform1f(u.sparkle, frame.sparkle ? 1 : 0);

      gl.bindVertexArray(vao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, grid.cells.length);
      gl.bindVertexArray(null);
    },
    dispose() {
      gl.deleteBuffer(cornerBuffer);
      gl.deleteBuffer(instanceBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}
