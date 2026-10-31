import { useEffect, useState } from "react";

export type BackdropTone = "light" | "dark";

interface Options {
  /** 스크롤 없이 바뀌는 배경(히어로 슬라이드 등)을 따라가기 위한 재측정 간격(ms). */
  interval?: number;
}

const SAMPLE_X_RATIOS = [0.1, 0.3, 0.5, 0.7, 0.9];
const SAMPLE_SIZE = 64;
const LIGHT_THRESHOLD = 0.5;

const imageCanvasCache = new Map<string, CanvasRenderingContext2D | null>();

const toLuminance = (r: number, g: number, b: number) =>
  (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** 이미지를 축소 캔버스로 한 번만 그려 캐시한다. CORS로 막히면 null. */
function getImageContext(img: HTMLImageElement) {
  const key = img.currentSrc || img.src;
  if (imageCanvasCache.has(key)) return imageCanvasCache.get(key) ?? null;

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  try {
    ctx?.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    ctx?.getImageData(0, 0, 1, 1);
    imageCanvasCache.set(key, ctx);
    return ctx;
  } catch {
    imageCanvasCache.set(key, null);
    return null;
  }
}

/** 화면 좌표(x, y)가 가리키는 이미지 픽셀의 밝기. 읽을 수 없으면 null. */
function sampleImage(img: HTMLImageElement, x: number, y: number) {
  if (!img.complete || img.naturalWidth === 0) return null;

  const ctx = getImageContext(img);
  if (!ctx) return null;

  const rect = img.getBoundingClientRect();
  const u = (x - rect.left) / rect.width;
  const v = (y - rect.top) / rect.height;
  if (u < 0 || u > 1 || v < 0 || v > 1) return null;

  // object-fit: cover 기준으로 보이는 영역만 이미지 좌표로 환산한다.
  const scale = Math.max(
    rect.width / img.naturalWidth,
    rect.height / img.naturalHeight,
  );
  const visibleU = Math.min(1, rect.width / (img.naturalWidth * scale));
  const visibleV = Math.min(1, rect.height / (img.naturalHeight * scale));
  const imgU = 0.5 + (u - 0.5) * visibleU;
  const imgV = 0.5 + (v - 0.5) * visibleV;

  const px = Math.min(SAMPLE_SIZE - 1, Math.floor(imgU * SAMPLE_SIZE));
  const py = Math.min(SAMPLE_SIZE - 1, Math.floor(imgV * SAMPLE_SIZE));
  const [r, g, b] = ctx.getImageData(px, py, 1, 1).data;

  return toLuminance(r, g, b);
}

/** 불투명한 배경색을 가진 요소의 밝기. 투명이면 null. */
function sampleBackground(element: Element) {
  const match =
    getComputedStyle(element).backgroundColor.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const [r, g, b, a = 1] = match[1]
    .split(/[,\s/]+/)
    .filter(Boolean)
    .map(Number);
  return a < 0.5 ? null : toLuminance(r, g, b);
}

function sampleAt(x: number, y: number) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element.closest("header")) continue;

    if (element instanceof HTMLImageElement) {
      const luminance = sampleImage(element, x, y);
      if (luminance !== null) return luminance;
      continue;
    }

    const luminance = sampleBackground(element);
    if (luminance !== null) return luminance;
  }

  return 1;
}

/**
 * 헤더 바로 아래 배경의 평균 밝기를 읽어 "light" | "dark"로 돌려준다.
 * 이미지·배경색 모두 읽을 수 없는 경우엔 흰 배경으로 간주한다.
 */
export function useBackdropTone({ interval = 300 }: Options = {}) {
  const [tone, setTone] = useState<BackdropTone>("dark");

  useEffect(() => {
    const measure = () => {
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      const y = headerHeight / 2;
      const total = SAMPLE_X_RATIOS.reduce(
        (sum, ratio) => sum + sampleAt(window.innerWidth * ratio, y),
        0,
      );
      const average = total / SAMPLE_X_RATIOS.length;

      setTone(average > LIGHT_THRESHOLD ? "light" : "dark");
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const timer = window.setInterval(measure, interval);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.clearInterval(timer);
    };
  }, [interval]);

  return tone;
}
