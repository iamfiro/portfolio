'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { displayShader, fluidShader, vertexSource } from './shader';

export interface FlutedGlassProps {
  /** 배경 텍스처 이미지 경로 (public 기준) */
  imageSrc?: string;
  /** 캔버스 폭 (CSS px) */
  width?: number | string;
  /** 캔버스 높이 (CSS px) */
  height?: number | string;
  /** 둥근 모서리 등 스타일 커스터마이즈용 */
  className?: string;
  /** 고해상도 스케일링 사용 여부 (기본 true) */
  useDevicePixelRatio?: boolean;
  /** 디바이스 픽셀 비율 상한 (기본 1.5) */
  maxPixelRatio?: number;
  /** 시뮬레이션 해상도 스케일 (0~1, 기본 0.5) */
  simResolutionScale?: number;
  /** 목표 FPS (기본 30) */
  targetFPS?: number;
  /** 유휴 상태일 때 FPS (기본 8, 0이면 완전 일시정지) */
  idleFPS?: number;
  /** 탭 비활성화 시 일시정지 (기본 true) */
  pauseOnHidden?: boolean;
  /** 입력 유휴 시 저전력 모드 (기본 true) */
  pauseWhenIdle?: boolean;
  /** 유휴로 간주하는 ms (기본 1500ms) */
  idleMs?: number;
  /** 안티앨리어싱 사용 여부 (기본 false) */
  antialias?: boolean;
}

const config = {
  brushSize: 5.0,
  brushStrength: 0.8,
  distortionAmount: 1.0,
  fluidDecay: 0.985,
  trailLength: 0.98,
  stopDecay: 0.98,
  animationSpeed: 0.5, // 애니메이션 속도 조절 (0.1 = 느림, 1.0 = 보통, 2.0 = 빠름)
  color1: new THREE.Color(1.0, 0.8, 0.6), // 따뜻한 오렌지
  color2: new THREE.Color(1.0, 0.5, 0.7), // 코랄 핑크
  color3: new THREE.Color(0.8, 0.3, 0.9), // 자주색
  color4: new THREE.Color(0.4, 0.2, 0.8), // 깊은 보라색
  colorIntensity: 1,
  softness: 0.5,
};

export default function FlutedGlass({
  imageSrc: _imageSrc = '/background.jpg',
  className,
  width = '100%',
  height = '100%',
  useDevicePixelRatio = true,
  maxPixelRatio = 1.5,
  simResolutionScale = 0.5,
  targetFPS = 30,
  idleFPS = 8,
  pauseOnHidden = true,
  pauseWhenIdle = true,
  idleMs = 1500,
  antialias = false,
}: FlutedGlassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(
      useDevicePixelRatio
        ? Math.min(window.devicePixelRatio || 1, maxPixelRatio)
        : 1
    );

    // 공용 카메라/지오메트리(풀스크린)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const fluidTarget1 = new THREE.WebGLRenderTarget(
      Math.max(1, Math.floor(renderer.domElement.width * simResolutionScale)),
      Math.max(1, Math.floor(renderer.domElement.height * simResolutionScale)),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    const fluidTarget2 = new THREE.WebGLRenderTarget(
      Math.max(1, Math.floor(renderer.domElement.width * simResolutionScale)),
      Math.max(1, Math.floor(renderer.domElement.height * simResolutionScale)),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    const fluidMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexSource,
      fragmentShader: fluidShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(
            Math.max(
              1,
              Math.floor(renderer.domElement.width * simResolutionScale)
            ),
            Math.max(
              1,
              Math.floor(renderer.domElement.height * simResolutionScale)
            )
          ),
        },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: previousFluidTarget.texture },
        uBrushSize: { value: config.brushSize },
        uBrushStrength: { value: config.brushStrength },
        uFluidDecay: { value: config.fluidDecay },
        uTrailLength: { value: config.trailLength },
        uStopDecay: { value: config.stopDecay },
      },
    });

    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexSource,
      fragmentShader: displayShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(
            renderer.domElement.width,
            renderer.domElement.height
          ),
        },
        iFluid: { value: currentFluidTarget.texture },
        uDistortionAmount: { value: config.distortionAmount },
        uColor1: { value: config.color1 },
        uColor2: { value: config.color2 },
        uColor3: { value: config.color3 },
        uColor4: { value: config.color4 },
        uColorIntensity: { value: config.colorIntensity },
        uSoftness: { value: config.softness },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
    const displayPlane = new THREE.Mesh(geometry, displayMaterial);

    let mouseX = 0;
    let mouseY = 0;

    let prevMouseX = 0;
    let prevMouseY = 0;

    let lastMoveTime = performance.now();
    let rafId = 0;
    let isPaused = false;
    let lastRenderMs = 0;

    function handleMouseLeave() {
      fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      lastMoveTime = Date.now();
      fluidMaterial.uniforms.iMouse.value.set(
        mouseX,
        mouseY,
        prevMouseX,
        prevMouseY
      );
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleVisibilityChange = () => {
      if (!pauseOnHidden) return;
      if (document.hidden) {
        isPaused = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        isPaused = false;
        if (!rafId) animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function animate() {
      rafId = requestAnimationFrame(animate);

      const time = performance.now() / 1000;
      const nowMs = performance.now();

      if (isPaused) return;

      let effectiveFps = targetFPS;
      if (pauseWhenIdle && nowMs - lastMoveTime > idleMs) {
        if (idleFPS <= 0) {
          return;
        }
        effectiveFps = Math.min(effectiveFps, idleFPS);
      }
      const interval = 1000 / Math.max(1, effectiveFps);
      if (nowMs - lastRenderMs < interval) {
        return;
      }
      lastRenderMs = nowMs;

      fluidMaterial.uniforms.iTime.value = time;
      displayMaterial.uniforms.iTime.value = time;
      fluidMaterial.uniforms.iFrame.value = frameCount;

      if (performance.now() - lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
      }

      fluidMaterial.uniforms.uBrushSize.value = config.brushSize;
      fluidMaterial.uniforms.uBrushStrength.value = config.brushStrength;
      fluidMaterial.uniforms.uFluidDecay.value = config.fluidDecay;
      fluidMaterial.uniforms.uTrailLength.value = config.trailLength;
      fluidMaterial.uniforms.uStopDecay.value = config.stopDecay;

      displayMaterial.uniforms.uDistortionAmount.value =
        config.distortionAmount;
      displayMaterial.uniforms.uColorIntensity.value = config.colorIntensity;
      displayMaterial.uniforms.uSoftness.value = config.softness;
      displayMaterial.uniforms.uColor1.value.set(config.color1);
      displayMaterial.uniforms.uColor2.value.set(config.color2);
      displayMaterial.uniforms.uColor3.value.set(config.color3);
      displayMaterial.uniforms.uColor4.value.set(config.color4);

      fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
      renderer.setRenderTarget(currentFluidTarget);
      renderer.render(fluidPlane, camera);

      displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayPlane, camera);

      const temp = currentFluidTarget;
      currentFluidTarget = previousFluidTarget;
      previousFluidTarget = temp;

      frameCount++;
    }

    // 초기 캔버스 크기 설정
    const initializeSize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height);

      const simW = Math.max(1, Math.floor(width * simResolutionScale));
      const simH = Math.max(1, Math.floor(height * simResolutionScale));

      fluidMaterial.uniforms.iResolution.value.set(simW, simH);
      displayMaterial.uniforms.iResolution.value.set(width, height);

      fluidTarget1.setSize(simW, simH);
      fluidTarget2.setSize(simW, simH);

      frameCount = 0;
    };

    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height);

      const simW = Math.max(1, Math.floor(width * simResolutionScale));
      const simH = Math.max(1, Math.floor(height * simResolutionScale));

      fluidMaterial.uniforms.iResolution.value.set(simW, simH);
      displayMaterial.uniforms.iResolution.value.set(width, height);

      fluidTarget1.setSize(simW, simH);
      fluidTarget2.setSize(simW, simH);

      frameCount = 0;
    };

    window.addEventListener('resize', handleResize);

    // 초기 크기 설정 및 애니메이션 시작
    initializeSize();
    animate();

    // cleanup 함수
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      if (rafId) cancelAnimationFrame(rafId);

      // 리소스 정리
      geometry.dispose();
      fluidMaterial.dispose();
      displayMaterial.dispose();
      fluidTarget1.dispose();
      fluidTarget2.dispose();
      renderer.dispose();
    };

    // // 렌더타겟(핑퐁)
    // const targetOptions: THREE.RenderTargetOptions = {
    //   depthBuffer: false,
    //   stencilBuffer: false,
    //   minFilter: THREE.LinearFilter,
    //   magFilter: THREE.LinearFilter,
    //   format: THREE.RGBAFormat,
    //   type: THREE.UnsignedByteType,
    // };
    // const rtA = new THREE.WebGLRenderTarget(2, 2, targetOptions);
    // const rtB = new THREE.WebGLRenderTarget(2, 2, targetOptions);
    // let readTarget = rtA;
    // let writeTarget = rtB;

    // // 유니폼 정의
    // const iTime = { value: 0 };
    // const iFrame = { value: 0 };
    // const iResolution = { value: new THREE.Vector2(1, 1) };
    // // iMouse: vec4(current.xy, prev.xy)
    // const iMouse = { value: new THREE.Vector4(0, 0, 0, 0) };

    // // 브러시/유동 파라미터(필요시 외부 프롭과 연결 가능)
    // const uBrushSize = { value: 1.0 };
    // const uBrushStrength = { value: 1.0 };
    // const uFluidDecay = { value: 0.985 };
    // const uStopDecay = { value: 0.98 };

    // const uDistortionAmount = { value: 1.0 };
    // const uColor1 = { value: new THREE.Color(0.87, 0.92, 1) };
    // const uColor2 = { value: new THREE.Color(0.72, 0.8, 1) };
    // const uColor3 = { value: new THREE.Color(0.55, 0.65, 0.95) };
    // const uColor4 = { value: new THREE.Color(0.35, 0.45, 0.85) };
    // const uColorIntensity = { value: 1 };
    // const uSoftness = { value: 0.5 };

    // // 시뮬레이션 패스
    // const simMaterial = new THREE.ShaderMaterial({
    //   vertexShader: vertexSource,
    //   fragmentShader: fluidShader,
    //   uniforms: {
    //     iTime,
    //     iResolution,
    //     iMouse,
    //     iFrame,
    //     iPreviousFrame: { value: readTarget.texture },
    //     uBrushSize,
    //     uBrushStrength,
    //     uFluidDecay,
    //     uStopDecay,
    //   },
    // });
    // const simScene = new THREE.Scene();
    // simScene.add(new THREE.Mesh(geometry, simMaterial));

    // // 디스플레이 패스
    // const displayMaterial = new THREE.ShaderMaterial({
    //   vertexShader: vertexSource,
    //   fragmentShader: displayShader,
    //   uniforms: {
    //     iTime,
    //     iResolution,
    //     iFluid: { value: readTarget.texture },
    //     uDistortionAmount,
    //     uColor1,
    //     uColor2,
    //     uColor3,
    //     uColor4,
    //     uColorIntensity,
    //     uSoftness,
    //   },
    // });
    // const displayScene = new THREE.Scene();
    // displayScene.add(new THREE.Mesh(geometry, displayMaterial));

    // // 마우스 입력 처리(캔버스 좌표 → 픽셀, 좌표계 보정)
    // let prevX = 0;
    // let prevY = 0;
    // let isPointerDown = false;

    // const getRelativePointer = (ev: PointerEvent) => {
    //   const rect = canvas.getBoundingClientRect();
    //   const sx = renderer.domElement.width / rect.width;
    //   const sy = renderer.domElement.height / rect.height;
    //   const x = (ev.clientX - rect.left) * sx;
    //   const yTop = (ev.clientY - rect.top) * sy;
    //   // uv(0,0)은 보통 좌하단이므로 y 반전
    //   const y = renderer.domElement.height - yTop;
    //   return { x, y };
    // };

    // const onPointerDown = (ev: PointerEvent) => {
    //   isPointerDown = true;
    //   const p = getRelativePointer(ev);
    //   prevX = p.x;
    //   prevY = p.y;
    // };
    // const onPointerMove = (ev: PointerEvent) => {
    //   const p = getRelativePointer(ev);
    //   // iMouse = vec4(curr.xy, prev.xy)
    //   iMouse.value.set(p.x, p.y, prevX, prevY);
    //   // 셰이더에서 클릭 상태를 별도로 쓰지 않으므로, prev 갱신만 수행
    //   if (isPointerDown) {
    //     prevX = p.x;
    //     prevY = p.y;
    //   }
    // };
    // const onPointerUp = () => {
    //   isPointerDown = false;
    // };

    // canvas.addEventListener("pointerdown", onPointerDown);
    // window.addEventListener("pointerup", onPointerUp);
    // canvas.addEventListener("pointermove", onPointerMove);

    // // 리사이즈 핸들러 초기 실행
    // resize();
    // window.addEventListener("resize", resize);

    // let raf = 0;
    // const clock = new THREE.Clock();
    // const renderLoop = () => {
    //   raf = requestAnimationFrame(renderLoop);

    //   iTime.value = clock.getElapsedTime();
    //   iFrame.value += 1;

    //   // 시뮬레이션 패스: 이전 프레임 텍스처 설정 후 오프로 스크린 렌더
    //   (
    //     simMaterial.uniforms as unknown as {
    //       [k: string]: { value: unknown };
    //     }
    //   ).iPreviousFrame.value = readTarget.texture;
    //   renderer.setRenderTarget(writeTarget);
    //   renderer.render(simScene, camera);

    //   // 디스플레이 패스: 최신 결과 텍스처로 화면 렌더
    //   (
    //     displayMaterial.uniforms as unknown as {
    //       [k: string]: { value: unknown };
    //     }
    //   ).iFluid.value = writeTarget.texture;
    //   renderer.setRenderTarget(null);
    //   renderer.render(displayScene, camera);

    //   // 핑퐁 스왑
    //   const tmp = readTarget;
    //   readTarget = writeTarget;
    //   writeTarget = tmp;
    // };
    // renderLoop();

    // return () => {
    //   cancelAnimationFrame(raf);
    //   window.removeEventListener("resize", resize);
    //   canvas.removeEventListener("pointerdown", onPointerDown);
    //   window.removeEventListener("pointerup", onPointerUp);
    //   canvas.removeEventListener("pointermove", onPointerMove);

    //   geometry.dispose();
    //   simMaterial.dispose();
    //   displayMaterial.dispose();
    //   rtA.dispose();
    //   rtB.dispose();
    //   renderer.dispose();
    // };
  }, [height, useDevicePixelRatio, width]);

  return (
    <div
      className={className}
      style={{
        width,
        height,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
