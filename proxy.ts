/**
 * Next.js Proxy for route protection
 *
 * Replaces deprecated middleware.ts in Next.js 16+.
 * Protects routes by redirecting unauthenticated users to sign-in.
 */

import { NextRequest, NextResponse } from "next/server"

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-out",
  "/sign-up",
  "/api/auth",
  "/api/health",
  "/_next",
  "/favicon.ico",
  "/",
]

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes without authentication check
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check for session token in cookies
  const sessionToken = req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token")

  // If no session token and not a public route, redirect to sign-in
  if (!sessionToken) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}