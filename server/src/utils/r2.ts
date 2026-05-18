import "../env.js";

import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
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

// 최대 1920px, WebP quality 80, SVG는 원본 유지
async function optimizeImage(
  buffer: Buffer,
  contentType: string,
): Promise<{ data: Buffer; mimeType: string; ext: string }> {
  if (contentType.includes("svg")) {
    return { data: buffer, mimeType: "image/svg+xml", ext: "svg" };
  }

  const optimized = await sharp(buffer)
    .resize({ width: 1920, withoutEnlargement: true })
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
}

// 경로: {category}/{slug}/{label}.{ext}
export async function uploadImageToR2(
  sourceUrl: string,
  options: UploadOptions,
): Promise<string> {
  const { category, name, label = "image" } = options;

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${sourceUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = inferContentType(sourceUrl, response.headers);
  const { data, mimeType, ext } = await optimizeImage(buffer, contentType);

  const slug = slugify(name);
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

export async function uploadImagesToR2(
  sourceUrls: string[],
  options: UploadOptions,
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < sourceUrls.length; i++) {
    const label = sourceUrls.length === 1
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
