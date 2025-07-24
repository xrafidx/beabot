// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Definisikan rute yang diproteksi
  const protectedRoutes = ["/dashboard", "/dashboard/"]; // Tambahkan juga '/' untuk memastikan
  // Gunakan regex yang lebih kuat jika ada sub-route lain
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Definisikan rute autentikasi (yang tidak boleh diakses jika sudah login)
  const authRoutes = ["/sign-in", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);

  // Dapatkan token dari cookie permintaan masuk
  // Pastikan nama cookie ('accessToken') sama persis dengan yang disetel backend
  const token = request.cookies.get("accessToken")?.value;

  // buat debug ini
  console.log("--- NEXT.JS MIDDLEWARE DEBUG ---");
  console.log("Current Pathname:", pathname);
  console.log("Is Protected Route:", isProtectedRoute);
  console.log("Is Auth Route:", isAuthRoute);
  console.log("Token from Cookie:", token ? "FOUND" : "NOT FOUND");
  console.log("------------------------------");

  // 1. Jika user mencoba mengakses rute yang diproteksi DAN TIDAK ADA TOKEN
  if (isProtectedRoute && !token) {
    console.log("ACTION: Redirecting to /sign-in (User not authenticated)");
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`, request.url));
  }

  // 2. Jika user mencoba mengakses rute autentikasi (login/register) SAAT SUDAH ADA TOKEN
  if (isAuthRoute && token) {
    console.log("ACTION: Redirecting to /dashboard (User already authenticated)");
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`, request.url));
  }

  console.log("ACTION: Continuing to requested path.");
  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
// Ini penting agar middleware hanya berjalan untuk rute yang relevan
export const config = {
  matcher: [
    "/dashboard/:path*", // Match /dashboard dan semua sub-rutenya
    "/sign-in",
    "/register",
    // '/api/:path*', // Jika Anda ingin memproteksi API Routes Next.js juga
  ],
};
