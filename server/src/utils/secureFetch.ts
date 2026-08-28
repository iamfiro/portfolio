import { createChildLogger } from "./logger.js";

const logger = createChildLogger({ module: "secure-fetch" });

// 기본 허용 호스트 (Notion CDN)
const DEFAULT_ALLOWED_HOSTS = [
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "www.notion.so",
  "notion.so",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
];

// 환경 변수에서 추가 허용 호스트 로드
function getAllowedHosts(): string[] {
  const envHosts = process.env.R2_ALLOWED_IMAGE_HOSTS;
  const additional = envHosts
    ? envHosts
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean)
    : [];
  return [...DEFAULT_ALLOWED_HOSTS, ...additional];
}

// Private/link-local IP 범위 감지
function isPrivateOrLinkLocal(ip: string): boolean {
  // IPv4 private ranges
  if (/^10\./.test(ip)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (/^192\.168\./.test(ip)) return true;
  // Loopback
  if (/^127\./.test(ip)) return true;
  if (ip === "0.0.0.0") return true;
  // Link-local
  if (/^169\.254\./.test(ip)) return true;
  // IPv6 private/loopback/link-local
  if (ip === "::1" || ip === "::") return true;
  if (/^fe80:/i.test(ip)) return true;
  if (/^fc00:/i.test(ip)) return true;
  if (/^fd[0-9a-f]{2}:/i.test(ip)) return true;

  return false;
}

// DNS 확인 후 IP가 private인지 검사
async function validateDnsResolution(hostname: string): Promise<void> {
  // Node.js의 dns/promises 사용
  const dns = await import("node:dns/promises");

  try {
    const addresses = await dns.resolve4(hostname);
    for (const addr of addresses) {
      if (isPrivateOrLinkLocal(addr)) {
        throw new Error(
          `DNS resolution for ${hostname} returned private/link-local IP: ${addr}`,
        );
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("private/link-local")) {
      throw err;
    }
    // IPv4 실패 시 IPv6 시도
    try {
      const addresses6 = await dns.resolve6(hostname);
      for (const addr of addresses6) {
        if (isPrivateOrLinkLocal(addr)) {
          throw new Error(
            `DNS resolution for ${hostname} returned private/link-local IP: ${addr}`,
          );
        }
      }
    } catch (err6) {
      if (err6 instanceof Error && err6.message.includes("private/link-local")) {
        throw err6;
      }
      // DNS 해석 자체 실패 → 호스트 불가
      throw new Error(`DNS resolution failed for ${hostname}`);
    }
  }
}

const IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
]);

/** 기본 타임아웃 (ms) */
const DEFAULT_TIMEOUT_MS = 30_000;
/** 기본 최대 다운로드 크기 (bytes) - 20MB */
const DEFAULT_MAX_BYTES = 20 * 1024 * 1024;
/** Sharp 입력 픽셀 제한 (px) - 100MP */
export const SHARP_MAX_INPUT_PIXELS = 100_000_000;

export interface SecureFetchOptions {
  /** 타임아웃 (ms) */
  timeoutMs?: number;
  /** 최대 다운로드 크기 (bytes) */
  maxBytes?: number;
  /** MIME 타입 검증 여부 */
  validateMime?: boolean;
  /** 최대 리다이렉트 횟수 */
  maxRedirects?: number;
}

export interface SecureFetchResult {
  buffer: Buffer;
  contentType: string;
  finalUrl: string;
}

/**
 * 보안 강화된 이미지 다운로드 함수
 * - HTTPS 전용
 * - 허용 호스트 검증
 * - DNS private/link-local IP 차단
 * - 리다이렉트 시 재검증
 * - 타임아웃
 * - 최대 바이트 제한
 * - 이미지 MIME 타입 확인
 */
export async function secureFetchImage(
  url: string,
  options: SecureFetchOptions = {},
): Promise<SecureFetchResult> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxBytes = DEFAULT_MAX_BYTES,
    validateMime = true,
    maxRedirects = 5,
  } = options;

  const allowedHosts = getAllowedHosts();

  // 리다이렉트 수동 추적
  let currentUrl = url;
  let redirectCount = 0;
  let response: Response | null = null;

  while (redirectCount <= maxRedirects) {
    // 1. URL 파싱 및 HTTPS 검증
    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      throw new Error(`Invalid URL: ${currentUrl}`);
    }

    if (parsed.protocol !== "https:") {
      throw new Error(`Only HTTPS URLs are allowed: ${currentUrl}`);
    }

    // 2. 허용 호스트 검증
    if (!allowedHosts.includes(parsed.hostname)) {
      throw new Error(
        `Host not in allowlist: ${parsed.hostname}. Allowed: ${allowedHosts.join(", ")}`,
      );
    }

    // 3. DNS private/link-local IP 차단
    await validateDnsResolution(parsed.hostname);

    // 4. Fetch with timeout, no auto-redirect (수동 리다이렉트 검증)
    response = await fetch(currentUrl, {
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "manual",
      headers: {
        "User-Agent": "portfolio-api/1.0",
      },
    });

    // 5. 리다이렉트 처리
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error(`Redirect without Location header from ${currentUrl}`);
      }

      // 상대 경로 리다이렉트 처리
      currentUrl = new URL(location, currentUrl).toString();
      redirectCount++;

      logger.debug(
        { redirectCount, newUrl: currentUrl },
        "Following redirect (will re-validate)",
      );

      continue;
    }

    break;
  }

  if (redirectCount > maxRedirects) {
    throw new Error(`Too many redirects (max ${maxRedirects})`);
  }

  if (!response || !response.ok) {
    const status = response?.status ?? "unknown";
    throw new Error(`Image fetch failed with status ${status}: ${currentUrl}`);
  }

  // 6. MIME 타입 검증
  const contentType = response.headers.get("content-type") ?? "";
  if (validateMime) {
    const mimeBase = contentType.split(";")[0].trim().toLowerCase();
    if (!IMAGE_MIME_TYPES.has(mimeBase)) {
      throw new Error(`Invalid image MIME type: "${contentType}" from ${currentUrl}`);
    }
  }

  // 7. Content-Length 사전 검증
  const contentLengthHeader = response.headers.get("content-length");
  if (contentLengthHeader) {
    const declaredSize = parseInt(contentLengthHeader, 10);
    if (!isNaN(declaredSize) && declaredSize > maxBytes) {
      throw new Error(
        `Image too large: ${declaredSize} bytes exceeds limit of ${maxBytes} bytes`,
      );
    }
  }

  // 8. 스트리밍으로 max bytes 검증
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.length;
      if (totalBytes > maxBytes) {
        reader.cancel();
        throw new Error(
          `Image download exceeded max size: ${totalBytes} > ${maxBytes} bytes`,
        );
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const buffer = Buffer.concat(chunks);

  logger.debug(
    {
      url: currentUrl,
      contentType,
      sizeBytes: buffer.length,
      redirectCount,
    },
    "Secure image fetch completed",
  );

  return {
    buffer,
    contentType: contentType.split(";")[0].trim() || "image/png",
    finalUrl: currentUrl,
  };
}
