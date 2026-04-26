import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME } from "@/lib/adminSession";

const IS_PROD = process.env.NODE_ENV === "production";

export async function POST(req: NextRequest) {
  let body: { password?: string } = {};
  try { body = await req.json(); } catch {}

  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !body.password || body.password !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = createSessionToken(secret);
  const res   = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: "strict",
    maxAge:   24 * 60 * 60,
    path:     "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: "strict",
    maxAge:   0,
    path:     "/",
  });
  return res;
}
