import "../env.js";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { createChildLogger } from "./logger.js";

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

async function downloadImage(url: string): Promise<Buffer> {
  const startedAt = performance.now();
  const sourceDomain = getUrlDomain(url);

  logger.debug({ sourceDomain }, "Downloading image");

  const response = await fetch(url);

  if (!response.ok) {
    logger.error(
      {
        sourceDomain,
        status: response.status,
        durationMs: Math.round(performance.now() - startedAt),
      },
      "Image download failed",
    );

    throw new Error(`Failed to download image: ${response.status} ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  logger.debug(
    {
      sourceDomain,
      sizeBytes: buffer.length,
      durationMs: Math.round(performance.now() - startedAt),
    },
    "Image downloaded",
  );

  return buffer;
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

  const basePipeline = sharp(buffer).rotate();

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

  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: ICON_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return { data: optimized, mimeType: "image/webp", ext: "webp" };
}

function inferContentType(url: string, responseHeaders?: Headers): string {
  const fromHeader = responseHeaders?.get("content-type");
  if (fromHeader && fromHeader.startsWith("image/")) return fromHeader;

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

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    logger.error(
      {
        category,
        name,
        label,
        variant,
        sourceDomain,
        status: response.status,
        durationMs: Math.round(performance.now() - startedAt),
      },
      "R2 image download failed",
    );

    throw new Error(`Failed to download: ${response.status} ${sourceUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = inferContentType(sourceUrl, response.headers);
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
