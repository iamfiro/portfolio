export type RGB = [number, number, number];

/** 버퍼 없이 화면을 덮는 삼각형 하나를 만든다 */
const FULLSCREEN_VERTEX_SHADER = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * 장면 셰이더가 함께 쓰는 GLSL 조각.
 * 모든 장면은 1920×1080 기준 좌표로 그리고, 캔버스에는 cover로 맞춘다.
 */
export const SHARED_GLSL = `
uniform vec2 uResolution;

const vec2 REFERENCE = vec2(1920.0, 1080.0);

float coverScale() {
  return max(uResolution.x / REFERENCE.x, uResolution.y / REFERENCE.y);
}

vec2 referencePoint() {
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  return (frag - uResolution * 0.5) / coverScale() + REFERENCE * 0.5;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
`;

export function hexToRgb(hex: string): RGB {
  const value = parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => channel / 255,
  ) as RGB;
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

/** 정점·프래그먼트 셰이더를 엮은 프로그램과 유니폼 위치를 찾는 함수 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
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

  const locations = new Map<string, WebGLUniformLocation | null>();
  const uniform = (name: string) => {
    if (!locations.has(name)) {
      locations.set(name, gl.getUniformLocation(program, name));
    }
    return locations.get(name) ?? null;
  };

  return { program, uniform };
}

/**
 * 화면 전체를 프래그먼트 셰이더 하나로 칠하는 패스.
 * 장면 렌더러는 use()로 프로그램과 해상도를 잡고, 유니폼을 넣은 뒤 draw()한다.
 */
export function createFullscreenPass(
  gl: WebGL2RenderingContext,
  fragmentSource: string,
) {
  const { program, uniform } = createProgram(
    gl,
    FULLSCREEN_VERTEX_SHADER,
    fragmentSource,
  );
  const vao = gl.createVertexArray();

  return {
    uniform,
    use() {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.useProgram(program);
      gl.uniform2f(
        uniform("uResolution"),
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      );
    },
    draw() {
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    },
    dispose() {
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}
