/**
 * HMAC 서명 기반 관리자 세션 쿠키 인증 미들웨어
 * HttpOnly, Secure, SameSite=Strict 쿠키 사용
 */
import { createHmac, timingSafeEqual } from "node:crypto";

import type { Context, Next } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import type { LoggerEnv } from "./logging.js";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8시간

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 characters");
  }
  return secret;
}

function createSessionToken(payload: string): string {
  const secret = getSessionSecret();
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  // Base64 인코딩: payload.signature
  const token = Buffer.from(`${payload}.${signature}`).toString("base64url");
  return token;
}

function verifySessionToken(token: string): string | null {
  try {
    const secret = getSessionSecret();
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const dotIndex = decoded.lastIndexOf(".");

    if (dotIndex === -1) return null;

    const payload = decoded.substring(0, dotIndex);
    const providedSignature = decoded.substring(dotIndex + 1);

    const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");

    // timingSafeEqual로 비교 (길이가 같아야 함)
    const providedBuffer = Buffer.from(providedSignature, "utf-8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");

    if (providedBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(providedBuffer, expectedBuffer)) return null;

    // 만료 시간 확인
    const data = JSON.parse(payload) as {
      sub?: unknown;
      iat?: unknown;
      exp?: unknown;
    };
    if (
      data.sub !== "admin" ||
      typeof data.iat !== "number" ||
      typeof data.exp !== "number" ||
      data.iat > Date.now() ||
      Date.now() >= data.exp
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(c: Context, adminId: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = JSON.stringify({ sub: adminId, iat: Date.now(), exp });
  const token = createSessionToken(payload);

  setCookie(c, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(c: Context): void {
  deleteCookie(c, SESSION_COOKIE_NAME, { path: "/" });
}

export function isAuthenticated(c: Context): boolean {
  const token = getCookie(c, SESSION_COOKIE_NAME);
  if (!token) return false;
  return verifySessionToken(token) !== null;
}

/**
 * timingSafeEqual을 사용한 비밀번호 비교
 */
export function safePasswordCompare(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided, "utf-8");
  const expectedBuffer = Buffer.from(expected, "utf-8");

  // 길이가 다르면 HMAC으로 래핑하여 일정 시간 비교
  const key = "password-compare-key";
  const providedHash = createHmac("sha256", key).update(providedBuffer).digest();
  const expectedHash = createHmac("sha256", key).update(expectedBuffer).digest();

  return timingSafeEqual(providedHash, expectedHash);
}

/**
 * mutation (POST/PUT/DELETE) 인증 guard 미들웨어
 */
export async function requireAuth(
  c: Context<LoggerEnv>,
  next: Next,
): Promise<Response | void> {
  const logger = c.get("logger");

  if (!isAuthenticated(c)) {
    logger.warn(
      { path: c.req.path, method: c.req.method },
      "unauthorized access attempt",
    );
    return c.json({ ok: false, message: "Authentication required" }, 401);
  }

  await next();
}
