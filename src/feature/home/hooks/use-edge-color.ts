import type { CSSProperties, SyntheticEvent } from "react";
import { useCallback, useEffect, useState } from "react";

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

interface EdgeColorPalette {
  base: string;
  light: string;
  dark: string;
  innerShadow: string;
  border: string;
}

interface UseEdgeColorResult {
  style: CSSProperties | undefined;
  handleLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
}

const SAMPLE_SIZE = 32;
const EDGE_SIZE = 4;

const WHITE: RgbColor = { red: 255, green: 255, blue: 255 };
const BLACK: RgbColor = { red: 0, green: 0, blue: 0 };

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mixColors(
  color: RgbColor,
  target: RgbColor,
  amount: number,
): RgbColor {
  return {
    red: color.red + (target.red - color.red) * amount,
    green: color.green + (target.green - color.green) * amount,
    blue: color.blue + (target.blue - color.blue) * amount,
  };
}

function toRgb(color: RgbColor): string {
  return `rgb(${clampChannel(color.red)}, ${clampChannel(color.green)}, ${clampChannel(color.blue)})`;
}

function toRgba(color: RgbColor, alpha: number): string {
  return `rgba(${clampChannel(color.red)}, ${clampChannel(color.green)}, ${clampChannel(color.blue)}, ${alpha})`;
}

function getEdgeColor(image: HTMLImageElement): RgbColor | null {
  if (!image.naturalWidth || !image.naturalHeight) return null;

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  try {
    context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const pixels = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;

    let red = 0;
    let green = 0;
    let blue = 0;
    let weight = 0;

    for (let y = 0; y < SAMPLE_SIZE; y += 1) {
      for (let x = 0; x < SAMPLE_SIZE; x += 1) {
        const isEdge =
          x < EDGE_SIZE ||
          x >= SAMPLE_SIZE - EDGE_SIZE ||
          y < EDGE_SIZE ||
          y >= SAMPLE_SIZE - EDGE_SIZE;

        if (!isEdge) continue;

        const pixelIndex = (y * SAMPLE_SIZE + x) * 4;
        const alpha = pixels[pixelIndex + 3] / 255;
        if (alpha < 0.1) continue;

        red += pixels[pixelIndex] * alpha;
        green += pixels[pixelIndex + 1] * alpha;
        blue += pixels[pixelIndex + 2] * alpha;
        weight += alpha;
      }
    }

    if (weight === 0) return null;

    return {
      red: red / weight,
      green: green / weight,
      blue: blue / weight,
    };
  } catch {
    // CORS가 허용되지 않은 원격 이미지는 브라우저가 픽셀 접근을 차단한다.
    return null;
  }
}

function createPalette(color: RgbColor): EdgeColorPalette {
  const light = mixColors(color, WHITE, 0.38);
  const dark = mixColors(color, BLACK, 0.3);

  return {
    base: toRgb(color),
    light: toRgb(light),
    dark: toRgb(dark),
    innerShadow: toRgba(dark, 0.28),
    border: toRgba(light, 0.82),
  };
}

function createStyle(palette: EdgeColorPalette): CSSProperties {
  return {
    "--icon-edge-base": palette.base,
    "--icon-edge-light": palette.light,
    "--icon-edge-dark": palette.dark,
    "--icon-edge-inner-shadow": palette.innerShadow,
    "--icon-edge-border": palette.border,
  } as CSSProperties;
}

export function useEdgeColor(source: string): UseEdgeColorResult {
  const [style, setStyle] = useState<CSSProperties | undefined>();

  useEffect(() => {
    setStyle(undefined);
  }, [source]);

  const handleLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const color = getEdgeColor(event.currentTarget);
    setStyle(color ? createStyle(createPalette(color)) : undefined);
  }, []);

  return { style, handleLoad };
}
