import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const COOKIE_NAME = "admin_session";
const MAX_AGE_MS         = 24 * 60 * 60 * 1000; // 24 hours

export function createSessionToken(secret: string): string {
  const ts  = Date.now().toString();
  const mac = createHmac("sha256", secret).update(ts).digest("hex");
  return Buffer.from(`${ts}.${mac}`).toString("base64url");
}

export function verifySessionToken(token: string, secret: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const dot     = decoded.indexOf(".");
    if (dot === -1) return false;

    const ts  = decoded.slice(0, dot);
    const mac = decoded.slice(dot + 1);

    if (Date.now() - parseInt(ts, 10) > MAX_AGE_MS) return false;

    const expected = createHmac("sha256", secret).update(ts).digest("hex");
    const aBuf     = Buffer.from(mac,      "hex");
    const bBuf     = Buffer.from(expected, "hex");
    if (aBuf.length !== bBuf.length) return false;

    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export function isAdminAuthorized(
  req: NextRequest,
  body: Record<string, unknown> = {}
): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  // Raw password in body (used only during initial login before cookie is set)
  if (typeof body.password === "string" && body.password === secret) return true;

  // Signed session cookie — all subsequent requests after login use this
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!(token && verifySessionToken(token, secret));
}
