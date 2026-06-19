import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its API route through untouched.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.SESSION_SECRET;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Fail closed: if the secret isn't configured, treat every request as
  // unauthenticated rather than risk an accidental open admin panel.
  const isValid = secret ? await verifySessionToken(token, secret) : false;

  if (!isValid) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
