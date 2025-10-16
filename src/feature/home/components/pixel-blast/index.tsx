/* eslint-disable simple-import-sort/imports */
import {
  Effect,
  EffectComposer,
  EffectPass,
  RenderPass,
  Pass,
} from "postprocessing";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import s from "./style.module.scss";

type PixelBlastVariant = "square" | "circle" | "triangle" | "diamond";

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  antialias?: boolean;
  dpr?: number;
  maxFps?: number;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

type PixelBlastConfig = {
  antialias: boolean;
  liquid: boolean;
  noiseAmount: number;
};

const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const trail: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    force: number;
    age: number;
  }[] = [];
  let last: { x: number; y: number } | null = null;
  const maxAge = 64;
  let radius = 0.05 * size; // 기본 반경을 더 작게
  const speed = 1 / maxAge;
  const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  const drawPoint = (p: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    force: number;
    age: number;
  }) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = (t: number) => -t * (t - 2);
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3));
    else
      intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  const addTouch = (norm: { x: number; y: number }) => {
    let force = 0;
    let vx = 0;
    let vy = 0;
    if (last) {
      const dx = norm.x - last.x;
      const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / (d || 1);
      vy = dy / (d || 1);
      force = Math.min(dd * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };
  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };
  return {
    canvas,
    texture,
    addTouch,
    update,
    set radiusScale(v: number) {
      radius = 0.1 * size * v;
    },
    get radiusScale() {
      return radius / (0.1 * size);
    },
    size,
  };
};

const createLiquidEffect = (
  texture: THREE.Texture,
  opts?: { strength?: number; freq?: number },
) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;

    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;

      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);

      float amt = uStrength * intensity * wave;

      uv += vec2(vx, vy) * amt;
    }
    `;
  return new Effect("LiquidEffect", fragment, {
    uniforms: new Map<string, THREE.Uniform>([
      ["uTexture", new THREE.Uniform(texture)],
      ["uStrength", new THREE.Uniform(opts?.strength ?? 0.025)],
      ["uTime", new THREE.Uniform(0)],
      ["uFreq", new THREE.Uniform(opts?.freq ?? 4.5)],
    ]),
  });
};

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  fragColor = vec4(color, M);
}
`;

const MAX_CLICKS = 10;

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = "square",
  pixelSize = 3,
  color = "#B19EEF",
  className,
  style,
  antialias = true,
  dpr = 1.5,
  maxFps = 60,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visibilityRef = useRef({ visible: true });
  const speedRef = useRef(speed);
  const pointerStateRef = useRef<{
    pending: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    isHovering: boolean;
    lastX: number;
    lastY: number;
  }>({
    pending: false,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    isHovering: false,
    lastX: 0,
    lastY: 0,
  });
  const timeUniformRefs = useRef<{ liquidTime?: THREE.Uniform } | null>(null);

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    clock: THREE.Clock;
    clickIx: number;
    uniforms: {
      uResolution: { value: THREE.Vector2 };
      uTime: { value: number };
      uColor: { value: THREE.Color };
      uClickPos: { value: THREE.Vector2[] };
      uClickTimes: { value: Float32Array };
      uShapeType: { value: number };
      uPixelSize: { value: number };
      uScale: { value: number };
      uDensity: { value: number };
      uPixelJitter: { value: number };
      uEnableRipples: { value: number };
      uRippleSpeed: { value: number };
      uRippleThickness: { value: number };
      uRippleIntensity: { value: number };
      uEdgeFade: { value: number };
    };
    resizeObserver?: ResizeObserver;
    raf?: number;
    quad?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    timeOffset?: number;
    composer?: EffectComposer;
    touch?: ReturnType<typeof createTouchTexture>;
    liquidEffect?: Effect;
    _cleanupExtra?: () => void;
    _handlers?: {
      onPointerEnter: (e: PointerEvent) => void;
      onPointerLeave: (e: PointerEvent) => void;
      onPointerMove: (e: PointerEvent) => void;
    };
  } | null>(null);
  const prevConfigRef = useRef<PixelBlastConfig | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    speedRef.current = speed;
    const needsReinitKeys: (keyof PixelBlastConfig)[] = [
      "antialias",
      "liquid",
      "noiseAmount",
    ];
    const cfg: PixelBlastConfig = { antialias, liquid, noiseAmount };
    let mustReinit = false;
    if (!threeRef.current) mustReinit = true;
    else if (prevConfigRef.current) {
      for (const k of needsReinitKeys)
        if (prevConfigRef.current[k] !== cfg[k]) {
          mustReinit = true;
          break;
        }
    }
    if (mustReinit) {
      if (threeRef.current) {
        const t = threeRef.current;
        t.resizeObserver?.disconnect();
        cancelAnimationFrame(t.raf!);
        t.quad?.geometry.dispose();
        t.material.dispose();
        t.composer?.dispose();
        // 안전한 이벤트 리스너 해제
        if (t._handlers) {
          t.renderer.domElement.removeEventListener(
            "pointerenter",
            t._handlers.onPointerEnter,
          );
          t.renderer.domElement.removeEventListener(
            "pointerleave",
            t._handlers.onPointerLeave,
          );
          t.renderer.domElement.removeEventListener(
            "pointermove",
            t._handlers.onPointerMove,
          );
        }
        t.renderer.dispose();
        if (t.renderer.domElement.parentElement === container)
          container.removeChild(t.renderer.domElement);
        threeRef.current = null;
      }
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2", {
        antialias,
        alpha: transparent,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power",
        desynchronized: true,
      } as WebGLContextAttributes);
      if (!gl) return;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl as WebGL2RenderingContext,
        antialias,
        alpha: transparent,
      });
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, Math.max(1, dpr)),
      );
      container.appendChild(renderer.domElement);
      const uniforms = {
        uResolution: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uClickPos: {
          value: Array.from(
            { length: MAX_CLICKS },
            () => new THREE.Vector2(-1, -1),
          ),
        },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
        uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
        uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
        uScale: { value: patternScale },
        uDensity: { value: patternDensity },
        uPixelJitter: { value: pixelSizeJitter },
        uEnableRipples: { value: enableRipples ? 1 : 0 },
        uRippleSpeed: { value: rippleSpeed },
        uRippleThickness: { value: rippleThickness },
        uRippleIntensity: { value: rippleIntensityScale },
        uEdgeFade: { value: edgeFade },
      };
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SRC,
        fragmentShader: FRAGMENT_SRC,
        uniforms,
        transparent: true,
        glslVersion: THREE.GLSL3,
        depthTest: false,
        depthWrite: false,
      });
      const quadGeom = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(quadGeom, material);
      scene.add(quad);
      const clock = new THREE.Clock();
      const setSize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(
          renderer.domElement.width,
          renderer.domElement.height,
        );
        if (threeRef.current?.composer)
          threeRef.current.composer.setSize(
            renderer.domElement.width,
            renderer.domElement.height,
          );
        uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
      };
      setSize();
      const ro = new ResizeObserver(setSize);
      ro.observe(container);
      const randomFloat = () => {
        try {
          const u32 = new Uint32Array(1);
          crypto.getRandomValues(u32);
          return u32[0] / 0xffffffff;
        } catch {
          return Math.random();
        }
      };
      const timeOffset = randomFloat() * 1000;
      let composer: EffectComposer | undefined;
      let touch: ReturnType<typeof createTouchTexture> | undefined;
      let liquidEffect: Effect | undefined;
      if (liquid) {
        touch = createTouchTexture();
        touch.radiusScale = liquidRadius;
        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        liquidEffect = createLiquidEffect(touch.texture, {
          strength: liquidStrength,
          freq: liquidWobbleSpeed,
        });
        const effectPass = new EffectPass(camera, liquidEffect);
        effectPass.renderToScreen = true;
        composer.addPass(renderPass);
        composer.addPass(effectPass);
        const uniformsMap = (
          liquidEffect as unknown as {
            uniforms?: Map<string, THREE.Uniform>;
          }
        ).uniforms;
        timeUniformRefs.current = {
          liquidTime: uniformsMap?.get("uTime"),
        };
      }
      if (noiseAmount > 0) {
        if (!composer) {
          composer = new EffectComposer(renderer);
          composer.addPass(new RenderPass(scene, camera));
        }
        const noiseEffect = new Effect(
          "NoiseEffect",
          `uniform float uTime; uniform float uAmount; float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);} void mainUv(inout vec2 uv){} void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){ float n=hash(floor(uv*vec2(1920.0,1080.0))+floor(uTime*60.0)); float g=(n-0.5)*uAmount; outputColor=inputColor+vec4(vec3(g),0.0);} `,
          {
            uniforms: new Map<string, THREE.Uniform>([
              ["uTime", new THREE.Uniform(0)],
              ["uAmount", new THREE.Uniform(noiseAmount)],
            ]),
          },
        );
        const noisePass = new EffectPass(camera, noiseEffect);
        noisePass.renderToScreen = true;
        if (composer && composer.passes.length > 0)
          composer.passes.forEach((p: Pass) => {
            if ("renderToScreen" in p) (p as Pass).renderToScreen = false;
          });
        composer.addPass(noisePass);
      }
      if (composer)
        composer.setSize(renderer.domElement.width, renderer.domElement.height);
      const mapToPixels = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const scaleX = renderer.domElement.width / rect.width;
        const scaleY = renderer.domElement.height / rect.height;
        const fx = (e.clientX - rect.left) * scaleX;
        const fy = (rect.height - (e.clientY - rect.top)) * scaleY;
        return {
          fx,
          fy,
          w: renderer.domElement.width,
          h: renderer.domElement.height,
        };
      };
      const onPointerEnter = (e: PointerEvent) => {
        const { fx, fy, w, h } = mapToPixels(e);
        pointerStateRef.current.isHovering = true;
        pointerStateRef.current.x = fx;
        pointerStateRef.current.y = fy;
        pointerStateRef.current.w = w;
        pointerStateRef.current.h = h;
        pointerStateRef.current.lastX = fx;
        pointerStateRef.current.lastY = fy;
        pointerStateRef.current.pending = true;

        // 호버 시 랜덤 효과 패턴 생성
        const patternType = Math.floor(Math.random() * 4); // 0-3 패턴 타입
        const centerX = fx;
        const centerY = fy;
        const spreadRadius = Math.min(w, h) * (0.02 + Math.random() * 0.05); // 2-7% 반경 (더 작게)

        let patternCount = 0;
        const positions: { x: number; y: number }[] = [];

        switch (patternType) {
          case 0: // 원형 패턴
            patternCount = Math.floor(Math.random() * 4) + 2; // 2-5개 (더 적게)
            for (let i = 0; i < patternCount; i++) {
              const angle =
                (i / patternCount) * Math.PI * 2 + Math.random() * 0.5;
              const distance = spreadRadius * (0.5 + Math.random() * 0.5);
              positions.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
              });
            }
            break;

          case 1: // 랜덤 산재 패턴
            patternCount = Math.floor(Math.random() * 5) + 2; // 2-6개 (더 적게)
            for (let i = 0; i < patternCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * spreadRadius;
              positions.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
              });
            }
            break;

          case 2: {
            // 선형 패턴
            patternCount = Math.floor(Math.random() * 3) + 2; // 2-4개 (더 적게)
            const lineAngle = Math.random() * Math.PI * 2;
            for (let i = 0; i < patternCount; i++) {
              const t = (i / (patternCount - 1)) * 2 - 1; // -1 to 1
              const distance = t * spreadRadius;
              positions.push({
                x: centerX + Math.cos(lineAngle) * distance,
                y: centerY + Math.sin(lineAngle) * distance,
              });
            }
            break;
          }

          case 3: // 스파이럴 패턴
            patternCount = Math.floor(Math.random() * 4) + 2; // 2-5개 (더 적게)
            for (let i = 0; i < patternCount; i++) {
              const t = i / patternCount;
              const angle = t * Math.PI * 4; // 2바퀴 스파이럴
              const distance = t * spreadRadius;
              positions.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
              });
            }
            break;
        }

        // 생성된 위치들에 효과 적용
        positions.forEach((pos, _index) => {
          const delay = Math.random() * 0.2; // 최대 0.2초 지연

          // 클릭 효과 생성
          const ix = threeRef.current?.clickIx ?? 0;
          uniforms.uClickPos.value[ix].set(pos.x, pos.y);
          uniforms.uClickTimes.value[ix] = uniforms.uTime.value + delay;
          if (threeRef.current)
            threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;

          // 터치 효과 생성
          if (touch) {
            touch.addTouch({ x: pos.x / w, y: pos.y / h });
          }
        });
      };

      const onPointerLeave = (_e: PointerEvent) => {
        pointerStateRef.current.isHovering = false;
        pointerStateRef.current.pending = false;
      };
      const onPointerMove = (e: PointerEvent) => {
        const { fx, fy, w, h } = mapToPixels(e);
        const currentState = pointerStateRef.current;

        // 마우스가 실제로 움직였는지 확인 (최소 이동 거리 체크)
        const deltaX = Math.abs(fx - currentState.lastX);
        const deltaY = Math.abs(fy - currentState.lastY);
        const minMovement = 3; // 최소 이동 픽셀 (덜 민감하게)

        if (deltaX > minMovement || deltaY > minMovement) {
          pointerStateRef.current = {
            pending: true,
            x: fx,
            y: fy,
            w,
            h,
            isHovering: currentState.isHovering,
            lastX: fx,
            lastY: fy,
          };

          // 마우스 움직임에 따라 즉시 효과 생성 (호버 상태와 관계없이)
          if (touch) {
            touch.addTouch({ x: fx / w, y: fy / h });
          }

          // 클릭 효과도 마우스 움직임에 따라 생성
          const ix = threeRef.current?.clickIx ?? 0;
          uniforms.uClickPos.value[ix].set(fx, fy);
          uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
          if (threeRef.current)
            threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
        }
      };
      renderer.domElement.addEventListener("pointerenter", onPointerEnter, {
        passive: true,
      });
      renderer.domElement.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });
      renderer.domElement.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      // 가시성 옵저버 및 페이지 비가시성 처리
      let io: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== "undefined") {
        io = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            visibilityRef.current.visible = entries.some(
              (e) => e.isIntersecting,
            );
          },
          { root: null },
        );
        io.observe(container);
      }
      const onVis = () => {
        visibilityRef.current.visible = document.visibilityState !== "hidden";
      };
      document.addEventListener("visibilitychange", onVis);
      let raf = 0;
      let lastFrame = performance.now();
      const targetDelta = Math.max(1, 1000 / Math.max(1, maxFps));
      const animate = () => {
        if (autoPauseOffscreen && !visibilityRef.current.visible) {
          raf = requestAnimationFrame(animate);
          return;
        }
        const now = performance.now();
        const elapsed = now - lastFrame;
        if (elapsed >= targetDelta) {
          lastFrame = now - (elapsed % targetDelta);
          uniforms.uTime.value =
            timeOffset + clock.getElapsedTime() * speedRef.current;
          if (timeUniformRefs.current?.liquidTime)
            timeUniformRefs.current.liquidTime.value = uniforms.uTime.value;
          if (touch) {
            if (pointerStateRef.current.pending) {
              const ps = pointerStateRef.current;
              touch.addTouch({ x: ps.x / ps.w, y: ps.y / ps.h });
              pointerStateRef.current.pending = false;
            }

            touch.update();
          }
          if (composer) composer.render();
          else renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      threeRef.current = {
        renderer,
        scene,
        camera,
        material,
        clock,
        clickIx: 0,
        uniforms,
        resizeObserver: ro,
        raf,
        quad,
        timeOffset,
        composer,
        touch,
        liquidEffect,
        _handlers: { onPointerEnter, onPointerLeave, onPointerMove },
      };
      // 클린업 추가 등록
      (threeRef.current as { _cleanupExtra?: () => void })._cleanupExtra =
        () => {
          if (io) io.disconnect();
          document.removeEventListener("visibilitychange", onVis);
        };
    } else {
      const t = threeRef.current!;
      t.uniforms.uShapeType.value = SHAPE_MAP[variant] ?? 0;
      t.uniforms.uPixelSize.value = pixelSize * t.renderer.getPixelRatio();
      t.uniforms.uColor.value.set(color);
      t.uniforms.uScale.value = patternScale;
      t.uniforms.uDensity.value = patternDensity;
      t.uniforms.uPixelJitter.value = pixelSizeJitter;
      t.uniforms.uEnableRipples.value = enableRipples ? 1 : 0;
      t.uniforms.uRippleIntensity.value = rippleIntensityScale;
      t.uniforms.uRippleThickness.value = rippleThickness;
      t.uniforms.uRippleSpeed.value = rippleSpeed;
      t.uniforms.uEdgeFade.value = edgeFade;
      if (transparent) t.renderer.setClearAlpha(0);
      else t.renderer.setClearColor(0x000000, 1);
      if (t.liquidEffect) {
        const uniformsMap = (
          t.liquidEffect as unknown as {
            uniforms?: Map<string, THREE.Uniform>;
          }
        ).uniforms;
        const uStrength = uniformsMap?.get("uStrength");
        if (uStrength) uStrength.value = liquidStrength;
        const uFreq = uniformsMap?.get("uFreq");
        if (uFreq) uFreq.value = liquidWobbleSpeed;
      }
      if (t.touch) t.touch.radiusScale = liquidRadius;
    }
    prevConfigRef.current = cfg;
    return () => {
      if (threeRef.current && mustReinit) return;
      if (!threeRef.current) return;
      const t = threeRef.current;
      t.resizeObserver?.disconnect();
      cancelAnimationFrame(t.raf!);
      t.quad?.geometry.dispose();
      t.material.dispose();
      t.composer?.dispose();
      // 안전한 이벤트 리스너 해제
      if (t._handlers) {
        t.renderer.domElement.removeEventListener(
          "pointerenter",
          t._handlers.onPointerEnter,
        );
        t.renderer.domElement.removeEventListener(
          "pointerleave",
          t._handlers.onPointerLeave,
        );
        t.renderer.domElement.removeEventListener(
          "pointermove",
          t._handlers.onPointerMove,
        );
      }
      t.renderer.dispose();
      if (t.renderer.domElement.parentElement === container)
        container.removeChild(t.renderer.domElement);
      t._cleanupExtra?.();
      threeRef.current = null;
    };
  }, [
    antialias,
    dpr,
    maxFps,
    liquid,
    noiseAmount,
    pixelSize,
    patternScale,
    patternDensity,
    enableRipples,
    rippleIntensityScale,
    rippleThickness,
    rippleSpeed,
    pixelSizeJitter,
    edgeFade,
    transparent,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    autoPauseOffscreen,
    variant,
    color,
    speed,
  ]);

  return (
    <div
      ref={containerRef}
      className={`${s.container} ${className ?? ""}`}
      style={style}
      aria-label="PixelBlast interactive background"
    />
  );
};

export default PixelBlast;
