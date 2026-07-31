import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { createChildLogger } from "./logger.js";
import { secureFetchImage, SHARP_MAX_INPUT_PIXELS } from "./secureFetch.js";

import "../env.js";

const logger = createChildLogger({ module: "r2" });

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export const RESPONSIVE_WIDTHS = [640, 1024, 1440] as const;
const ICON_WIDTH = 128;

function getUrlDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return text
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * 보안 강화된 이미지 다운로드 (공통 함수)
 * secureFetch를 사용하여 HTTPS, 허용 호스트, DNS 검증, timeout, max bytes, MIME 검증 수행
 */
async function downloadImageSecure(
  url: string,
): Promise<{ buffer: Buffer; contentType: string }> {
  const startedAt = performance.now();
  const sourceDomain = getUrlDomain(url);

  logger.debug({ sourceDomain }, "Downloading image (secure)");

  const result = await secureFetchImage(url);

  logger.debug(
    {
      sourceDomain,
      sizeBytes: result.buffer.length,
      contentType: result.contentType,
      durationMs: Math.round(performance.now() - startedAt),
    },
    "Image downloaded (secure)",
  );

  return { buffer: result.buffer, contentType: result.contentType };
}

function inferContentType(url: string, fetchedContentType?: string): string {
  if (fetchedContentType && fetchedContentType.startsWith("image/")) {
    return fetchedContentType;
  }

  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    avif: "image/avif",
  };

  return map[ext ?? ""] ?? "image/png";
}

/**
 * Sharp 파이프라인 생성 (픽셀 제한 적용)
 */
function createSharpPipeline(buffer: Buffer): ReturnType<typeof sharp> {
  return sharp(buffer, {
    limitInputPixels: SHARP_MAX_INPUT_PIXELS,
  }).rotate();
}

async function optimizeImageMultiSize(
  buffer: Buffer,
  contentType: string,
): Promise<{ data: Buffer; width: number }[]> {
  if (contentType.includes("svg")) {
    return [
      {
        data: buffer,
        width: RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1],
      },
    ];
  }

  const basePipeline = createSharpPipeline(buffer);

  const variants = await Promise.all(
    RESPONSIVE_WIDTHS.map(async (width) => {
      const data = await basePipeline
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      return { data, width };
    }),
  );

  return variants.sort((a, b) => a.width - b.width);
}

async function optimizeIcon(
  buffer: Buffer,
  contentType: string,
): Promise<{ data: Buffer; mimeType: string; ext: string }> {
  if (contentType.includes("svg")) {
    return { data: buffer, mimeType: "image/svg+xml", ext: "svg" };
  }

  const optimized = await createSharpPipeline(buffer)
    .resize({ width: ICON_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return { data: optimized, mimeType: "image/webp", ext: "webp" };
}

interface UploadOptions {
  category: string;
  name: string;
  label?: string;
  variant?: "responsive" | "icon";
}

// 경로: {category}/{slug}/{label}.{ext}
export async function uploadImageToR2(
  sourceUrl: string,
  options: UploadOptions,
): Promise<string> {
  const startedAt = performance.now();
  const { category, name, label = "image", variant = "responsive" } = options;
  const sourceDomain = getUrlDomain(sourceUrl);

  logger.info(
    { category, name, label, variant, sourceDomain },
    "R2 image upload started",
  );

  // 공통 보안 다운로드 함수 사용
  const { buffer, contentType: fetchedContentType } =
    await downloadImageSecure(sourceUrl);
  const contentType = inferContentType(sourceUrl, fetchedContentType);
  const slug = slugify(name);

  logger.info(
    {
      category,
      name,
      label,
      variant,
      sourceDomain,
      contentType,
      sizeBytes: buffer.length,
    },
    "R2 image download succeeded",
  );

  if (variant === "icon" || contentType.includes("svg")) {
    logger.debug(
      { category, name, label, variant, contentType, sizeBytes: buffer.length },
      "Optimizing image for icon upload",
    );

    const { data, mimeType, ext } = await optimizeIcon(buffer, contentType);
    const key = `${category}/${slug}/${label}.${ext}`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: data,
          ContentType: mimeType,
        }),
      );
    } catch (error) {
      logger.error(
        {
          err: error,
          category,
          name,
          label,
          variant,
          key,
          sizeBytes: data.length,
          durationMs: Math.round(performance.now() - startedAt),
        },
        "R2 image upload failed",
      );

      throw error;
    }

    const finalUrl = `${PUBLIC_URL}/${key}`;

    logger.info(
      {
        category,
        name,
        label,
        variant,
        key,
        sizeBytes: data.length,
        durationMs: Math.round(performance.now() - startedAt),
      },
      "R2 image upload succeeded",
    );

    return finalUrl;
  }

  logger.debug(
    { category, name, label, variant, contentType, sizeBytes: buffer.length },
    "Optimizing responsive image variants",
  );

  const variants = await optimizeImageMultiSize(buffer, contentType);
  const largestVariant = variants[variants.length - 1];
  const key = `${category}/${slug}/${label}.webp`;

  const uploadObjects = [
    ...variants.map(({ data, width }) => ({
      key: `${category}/${slug}/${label}-${width}w.webp`,
      data,
    })),
    {
      key,
      data: largestVariant.data,
    },
  ];

  try {
    await Promise.all(
      uploadObjects.map(({ key: uploadKey, data }) =>
        s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: uploadKey,
            Body: data,
            ContentType: "image/webp",
          }),
        ),
      ),
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        category,
        name,
        label,
        variant,
        key,
        uploadKeys: uploadObjects.map(({ key: uploadKey }) => uploadKey),
        durationMs: Math.round(performance.now() - startedAt),
      },
      "R2 image upload failed",
    );

    throw error;
  }

  const finalUrl = `${PUBLIC_URL}/${key}`;

  logger.info(
    {
      category,
      name,
      label,
      variant,
      key,
      variants: variants.map(({ data, width }) => ({
        width,
        sizeBytes: data.length,
      })),
      durationMs: Math.round(performance.now() - startedAt),
    },
    "R2 image upload succeeded",
  );

  return finalUrl;
}

export async function uploadImagesToR2(
  sourceUrls: string[],
  options: UploadOptions,
): Promise<string[]> {
  const startedAt = performance.now();
  const results: string[] = [];

  logger.info(
    { count: sourceUrls.length, category: options.category, name: options.name },
    "R2 batch image upload started",
  );

  for (let i = 0; i < sourceUrls.length; i++) {
    const label =
      sourceUrls.length === 1
        ? (options.label ?? "image")
        : `${options.label ?? "image"}-${i + 1}`;

    logger.debug(
      {
        index: i + 1,
        count: sourceUrls.length,
        label,
        category: options.category,
        name: options.name,
        sourceDomain: getUrlDomain(sourceUrls[i]),
      },
      "R2 batch image upload item started",
    );

    const url = await uploadImageToR2(sourceUrls[i], {
      ...options,
      label,
    });

    results.push(url);

    logger.debug(
      {
        index: i + 1,
        count: sourceUrls.length,
        label,
        category: options.category,
        name: options.name,
      },
      "R2 batch image upload item completed",
    );
  }

  logger.info(
    {
      count: sourceUrls.length,
      category: options.category,
      name: options.name,
      durationMs: Math.round(performance.now() - startedAt),
    },
    "R2 batch image upload completed",
  );

  return results;
}
