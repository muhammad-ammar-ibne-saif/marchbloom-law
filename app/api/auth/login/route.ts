import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, createSessionToken } from "@/lib/session";

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal length to avoid leaking length via timing.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!adminUsername || !adminPassword || !sessionSecret) {
    console.error("[auth] ADMIN_USERNAME, ADMIN_PASSWORD, or SESSION_SECRET not configured.");
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { username = "", password = "" } = body;

  const usernameMatches = timingSafeStringEqual(username, adminUsername);
  const passwordMatches = timingSafeStringEqual(password, adminPassword);

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const token = await createSessionToken(sessionSecret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return response;
}
