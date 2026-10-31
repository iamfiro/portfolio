import type { ReelFont, ReelTextMetrics } from "../stage.type";

/**
 * 쇼릴 글꼴. 세리프 디스플레이(Instrument Serif)로 이름과 프로젝트명을,
 * 한글 세리프(Gowun Batang)로 태그라인을, 모노(Geist Mono)로 캡션을 짠다.
 * logo는 사이트 로고(public/logo.svg)를 글자처럼 쓰는 가짜 글꼴이다(M 마크 · W 픽셀 워드마크).
 */
export const REEL_FONTS = {
  display: {
    family: "Instrument Serif",
    weight: 400,
    style: "normal",
    raster: 160,
    tracking: -0.015,
  },
  displayItalic: {
    family: "Instrument Serif",
    weight: 400,
    style: "italic",
    raster: 160,
    tracking: -0.015,
  },
  korean: {
    family: "Gowun Batang",
    weight: 700,
    style: "normal",
    raster: 112,
    tracking: -0.03,
  },
  mono: {
    family: "Geist Mono",
    weight: 500,
    style: "normal",
    raster: 64,
    tracking: 0.06,
  },
  logo: {
    family: "logo",
    weight: 400,
    style: "normal",
    raster: 128,
    tracking: 0,
  },
} satisfies Record<string, ReelFont>;

export type ReelFontKey = keyof typeof REEL_FONTS;

/** 대문자 높이를 재는 기준 글자 */
const CAP_REFERENCE: Record<ReelFontKey, string> = {
  display: "H",
  displayItalic: "H",
  korean: "한",
  mono: "H",
  logo: "M",
};

const ATLAS_SIZE = 2048;
/** 거리장 여백(글자 크기 배). 이 거리까지 가장자리 밖·안을 기록한다 */
const SDF_PAD = 0.14;
const CELL_GAP = 2;
const INF = 1e20;

const LOGO_SRC = "/logo.svg";
const LOGO_HEIGHT = 36;
/** 앞 두 패스는 마크, 나머지는 픽셀 워드마크이고 viewBox 높이는 36이다 */
const LOGO_PARTS: Record<
  string,
  { paths: [number, number]; x0: number; x1: number }
> = {
  M: { paths: [0, 2], x0: 0, x1: 40 },
  W: { paths: [2, 11], x0: 56, x1: 336 },
};

export interface ReelGlyph {
  uv: [number, number, number, number];
  /** 펜 자리·기준선에서 칸 왼쪽 위까지(raster px) */
  left: number;
  top: number;
  width: number;
  height: number;
  raster: number;
}

const cssFont = ({ family, weight, style, raster }: ReelFont) =>
  `${style} ${weight} ${raster}px "${family}"`;

/** 한 줄 제곱 거리 변환(Felzenszwalb) */
function edt1d(
  grid: Float64Array,
  offset: number,
  stride: number,
  length: number,
  f: Float64Array,
  v: Uint16Array,
  z: Float64Array,
) {
  for (let i = 0; i < length; i++) f[i] = grid[offset + i * stride];
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1, k = 0; q < length; q++) {
    let s: number;
    do {
      const r = v[k];
      s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  for (let q = 0, k = 0; q < length; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    grid[offset + q * stride] = f[r] + (q - r) * (q - r);
  }
}

function edt(grid: Float64Array, width: number, height: number) {
  const size = Math.max(width, height);
  const f = new Float64Array(size);
  const v = new Uint16Array(size);
  const z = new Float64Array(size + 1);
  for (let x = 0; x < width; x++) edt1d(grid, x, width, height, f, v, z);
  for (let y = 0; y < height; y++) edt1d(grid, y * width, 1, width, f, v, z);
}

/**
 * 덮임(알파)에서 부호 있는 거리장을 만든다.
 * 0.5가 가장자리, 안쪽으로 1, 바깥으로 0이며 radius px에서 끝난다.
 */
function signedDistance(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
) {
  const count = width * height;
  const outer = new Float64Array(count);
  const inner = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const a = rgba[i * 4 + 3] / 255;
    if (a >= 1) {
      inner[i] = INF;
    } else if (a <= 0) {
      outer[i] = INF;
    } else {
      // 가장자리 픽셀은 덮인 만큼 경계가 안팎으로 밀려 있다
      const d = 0.5 - a;
      outer[i] = d > 0 ? d * d : 0;
      inner[i] = d < 0 ? d * d : 0;
    }
  }
  edt(outer, width, height);
  edt(inner, width, height);

  const out = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    const distance = Math.sqrt(outer[i]) - Math.sqrt(inner[i]);
    out[i] = Math.max(
      0,
      Math.min(255, Math.round(255 * (0.5 - distance / (2 * radius)))),
    );
  }
  return out;
}

/**
 * 쇼릴 글자 아틀라스. 장면들이 쓸 글자를 미리 알려 두면(request),
 * 글꼴을 받은 뒤 한 번에 거리장으로 그려 한 장의 한 채널 텍스처에 모은다.
 */
export function createGlyphAtlas() {
  const data = new Uint8Array(ATLAS_SIZE * ATLAS_SIZE);
  const glyphs = new Map<string, ReelGlyph>();
  const requested = new Map<ReelFontKey, Set<string>>();
  const metricsCache = new Map<string, ReelTextMetrics>();
  const scratch = document.createElement("canvas");
  const scratchContext = scratch.getContext("2d", { willReadFrequently: true });
  const measureContext = document.createElement("canvas").getContext("2d");
  if (!scratchContext || !measureContext)
    throw new Error("글자 캔버스를 만들 수 없습니다");

  let logoPaths: string[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let shelfHeight = 0;

  const setFont = (
    context: CanvasRenderingContext2D,
    font: ReelFont,
    tracking: number,
  ) => {
    context.font = cssFont(font);
    context.letterSpacing = `${font.raster * tracking}px`;
  };

  /** 칸 자리를 잡는다. 한 줄이 차면 다음 줄로 넘어간다 */
  const pack = (width: number, height: number) => {
    if (cursorX + width > ATLAS_SIZE) {
      cursorX = 0;
      cursorY += shelfHeight + CELL_GAP;
      shelfHeight = 0;
    }
    if (cursorY + height > ATLAS_SIZE)
      throw new Error("글자 아틀라스가 가득 찼습니다");
    const spot = [cursorX, cursorY];
    cursorX += width + CELL_GAP;
    shelfHeight = Math.max(shelfHeight, height);
    return spot;
  };

  const place = (
    key: string,
    sdf: Uint8Array,
    width: number,
    height: number,
    left: number,
    top: number,
    raster: number,
  ) => {
    const [x, y] = pack(width, height);
    for (let row = 0; row < height; row++) {
      data.set(
        sdf.subarray(row * width, (row + 1) * width),
        (y + row) * ATLAS_SIZE + x,
      );
    }
    glyphs.set(key, {
      uv: [
        x / ATLAS_SIZE,
        y / ATLAS_SIZE,
        (x + width) / ATLAS_SIZE,
        (y + height) / ATLAS_SIZE,
      ],
      left,
      top,
      width,
      height,
      raster,
    });
  };

  const rasterizeCharacter = (fontKey: ReelFontKey, character: string) => {
    const font = REEL_FONTS[fontKey];
    const pad = Math.ceil(font.raster * SDF_PAD);
    setFont(scratchContext, font, 0);
    const box = scratchContext.measureText(character);
    const left = Math.ceil(box.actualBoundingBoxLeft);
    const right = Math.ceil(box.actualBoundingBoxRight);
    const ascent = Math.ceil(box.actualBoundingBoxAscent);
    const descent = Math.ceil(box.actualBoundingBoxDescent);
    const width = Math.max(1, left + right) + pad * 2;
    const height = Math.max(1, ascent + descent) + pad * 2;

    scratch.width = width;
    scratch.height = height;
    // 캔버스 크기를 바꾸면 그리기 상태가 초기화되므로 다시 잡는다
    setFont(scratchContext, font, 0);
    scratchContext.fillStyle = "#000000";
    scratchContext.textBaseline = "alphabetic";
    scratchContext.fillText(character, pad + left, pad + ascent);

    const pixels = scratchContext.getImageData(0, 0, width, height).data;
    place(
      `${fontKey}:${character}`,
      signedDistance(pixels, width, height, pad),
      width,
      height,
      -(left + pad),
      -(ascent + pad),
      font.raster,
    );
  };

  /** 로고는 바닥을 기준선에 두고 높이를 raster로 그린다 */
  const rasterizeLogo = (character: string) => {
    const part = LOGO_PARTS[character];
    if (!part) return;
    const { raster } = REEL_FONTS.logo;
    const pad = Math.ceil(raster * SDF_PAD);
    const scale = raster / LOGO_HEIGHT;
    const width = Math.ceil((part.x1 - part.x0) * scale) + pad * 2;
    const height = raster + pad * 2;

    scratch.width = width;
    scratch.height = height;
    scratchContext.fillStyle = "#000000";
    scratchContext.setTransform(scale, 0, 0, scale, pad - part.x0 * scale, pad);
    logoPaths
      .slice(...part.paths)
      .forEach((path) => scratchContext.fill(new Path2D(path)));
    scratchContext.setTransform(1, 0, 0, 1, 0, 0);

    const pixels = scratchContext.getImageData(0, 0, width, height).data;
    place(
      `logo:${character}`,
      signedDistance(pixels, width, height, pad),
      width,
      height,
      -pad,
      -(raster + pad),
      raster,
    );
  };

  return {
    data,
    size: ATLAS_SIZE,

    /** 이 글꼴로 이 글자들을 쓸 것이라고 알려 둔다 */
    request(fontKey: ReelFontKey, text: string) {
      const set = requested.get(fontKey) ?? new Set<string>();
      Array.from(text).forEach((character) => {
        if (character.trim()) set.add(character);
      });
      requested.set(fontKey, set);
    },

    /** 글꼴과 로고를 받고 알려 둔 글자를 모두 그린다 */
    async build() {
      const [svg] = await Promise.all([
        fetch(LOGO_SRC)
          .then((response) => response.text())
          // 로고를 못 받으면 로고 자리만 비운다
          .catch(() => ""),
        ...[...requested].map(([fontKey, characters]) =>
          fontKey === "logo"
            ? Promise.resolve()
            : document.fonts.load(
                cssFont(REEL_FONTS[fontKey]),
                [...characters].join(""),
              ),
        ),
      ]);
      await document.fonts.ready;
      logoPaths = [...svg.matchAll(/<path d="([^"]+)"/g)].map(([, d]) => d);

      requested.forEach((characters, fontKey) =>
        characters.forEach((character) =>
          fontKey === "logo"
            ? rasterizeLogo(character)
            : rasterizeCharacter(fontKey, character),
        ),
      );
      // 글꼴을 받기 전에 잰 값은 대체 글꼴 기준이라 버린다
      metricsCache.clear();
    },

    glyph(fontKey: ReelFontKey, character: string) {
      return glyphs.get(`${fontKey}:${character}`);
    },

    /** 글자 크기 1 기준 모양 정보. 자간과 짝 맞춤(커닝)까지 반영한 펜 자리를 앞에서부터 잰다 */
    metrics(fontKey: ReelFontKey, text: string): ReelTextMetrics {
      const key = `${fontKey}:${text}`;
      const cached = metricsCache.get(key);
      if (cached) return cached;

      const font = REEL_FONTS[fontKey];
      const characters = Array.from(text);
      let result: ReelTextMetrics;

      if (fontKey === "logo") {
        const part = LOGO_PARTS[text];
        result = {
          width: part ? (part.x1 - part.x0) / LOGO_HEIGHT : 0,
          offsets: [0],
          capHeight: 1,
          ascent: 1,
          descent: 0,
        };
      } else {
        setFont(measureContext, font, font.tracking);
        const offsets = characters.map(
          (_, i) =>
            measureContext.measureText(characters.slice(0, i).join("")).width /
            font.raster,
        );
        const whole = measureContext.measureText(text);
        const cap = measureContext.measureText(CAP_REFERENCE[fontKey]);
        result = {
          width: whole.width / font.raster,
          offsets,
          capHeight: cap.actualBoundingBoxAscent / font.raster,
          ascent: whole.actualBoundingBoxAscent / font.raster,
          descent: whole.actualBoundingBoxDescent / font.raster,
        };
      }
      metricsCache.set(key, result);
      return result;
    },
  };
}

export type ReelGlyphAtlas = ReturnType<typeof createGlyphAtlas>;
