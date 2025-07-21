import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6 sm:p-10">
      {/* Logo dan 404 */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <Image src="/beabot-icon/beabot-logosad-ungu.png" alt="Error image" width={90} height={90} className="drop-shadow-md" />
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-[#753a88] drop-shadow-lg">404</h1>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">Halaman tidak ditemukan</h2>
      <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-md">Sepertinya halaman yang Anda cari sudah tidak tersedia atau URL-nya salah.</p>

      <Link href="/" className="px-6 py-3 rounded-xl bg-[#753a88] text-white font-medium shadow-md hover:bg-purple-700 transition-all duration-300">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
