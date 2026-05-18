import "../env.js";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

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

function slugify(text: string): string {
  return text
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
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
  const { category, name, label = "image", variant = "responsive" } = options;

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${sourceUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = inferContentType(sourceUrl, response.headers);
  const slug = slugify(name);

  if (variant === "icon" || contentType.includes("svg")) {
    const { data, mimeType, ext } = await optimizeIcon(buffer, contentType);
    const key = `${category}/${slug}/${label}.${ext}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: data,
        ContentType: mimeType,
      }),
    );

    return `${PUBLIC_URL}/${key}`;
  }

  const variants = await optimizeImageMultiSize(buffer, contentType);
  const largestVariant = variants[variants.length - 1];
  const key = `${category}/${slug}/${label}.webp`;

  await Promise.all(
    [
      ...variants.map(({ data, width }) => ({
        key: `${category}/${slug}/${label}-${width}w.webp`,
        data,
      })),
      {
        key,
        data: largestVariant.data,
      },
    ].map(({ key: uploadKey, data }) =>
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

  return `${PUBLIC_URL}/${key}`;
}

export async function uploadImagesToR2(
  sourceUrls: string[],
  options: UploadOptions,
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < sourceUrls.length; i++) {
    const label =
      sourceUrls.length === 1
        ? (options.label ?? "image")
        : `${options.label ?? "image"}-${i + 1}`;

    const url = await uploadImageToR2(sourceUrls[i], {
      ...options,
      label,
    });

    results.push(url);
  }

  return results;
}
