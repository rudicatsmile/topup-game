// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "topupgame-ultra-secure-auth-secret-key-32-chars!!"
);
const COOKIE_NAME = "topupgame_session";

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "joki" | "admin" | "super_admin";
  sessionId: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: SessionPayload | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as unknown as SessionPayload;
    } catch {
      session = null;
    }
  }

  // 1. Redirect already logged-in users away from auth pages
  if (session && (pathname === "/login" || pathname === "/register")) {
    if (session.role === "admin" || session.role === "super_admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (session.role === "joki") {
      return NextResponse.redirect(new URL("/joki-panel", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Protected paths require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isJokiRoute = pathname.startsWith("/joki-panel");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isDashboardRoute || isJokiRoute || isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based authorization
    if (isAdminRoute) {
      if (session.role !== "admin" && session.role !== "super_admin") {
        const forbiddenUrl = new URL("/dashboard", request.url);
        forbiddenUrl.searchParams.set("error", "forbidden_admin_access");
        return NextResponse.redirect(forbiddenUrl);
      }
    }

    if (isJokiRoute) {
      if (session.role !== "joki" && session.role !== "admin" && session.role !== "super_admin") {
        const forbiddenUrl = new URL("/dashboard", request.url);
        forbiddenUrl.searchParams.set("error", "forbidden_joki_access");
        return NextResponse.redirect(forbiddenUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/joki-panel/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
