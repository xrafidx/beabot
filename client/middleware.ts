import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/dashboard/"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const authRoutes = ["/sign-in", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);

  const token = request.cookies.get("accessToken")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
      isAuthenticated = true;
    } catch (err) {
      console.log("Invalid token", err);
    }
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/register"],
};
