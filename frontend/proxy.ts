import { NextRequest, NextResponse } from "next/server";

// Routes that require login
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

// Routes that logged-in users should not see (redirect to dashboard)
const authRoutes = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const token    = request.cookies.get("fb_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute  = authRoutes.some(route => pathname.startsWith(route));

  // No token + protected route → redirect to login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Has token + auth page → redirect to dashboard (already logged in)
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
