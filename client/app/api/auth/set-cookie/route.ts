// app/api/auth/set-cookie/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ message: "Access token missing" }, { status: 400 });
    }

    (await cookies()).set("accessToken", accessToken as string, {
      // <<-- Tambahkan 'as string' untuk memastikan tipenya
      httpOnly: true,
      secure: true, // <<-- Pastikan ini literal 'true', bukan variabel boolean jika ada
      sameSite: "none", // <<-- PERBAIKAN DI SINI: Gunakan huruf kecil "none"
      path: "/",
      maxAge: 2 * 24 * 60 * 60, // 2 hari dalam detik
      domain: ".beabot-fe.vercel.app", // Opsional: Sesuaikan jika perlu
    });

    return NextResponse.json({ success: true, message: "Cookie set" });
  } catch (error) {
    console.error("Error setting cookie in API route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
