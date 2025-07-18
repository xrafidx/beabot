import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 sm:p-8">
      <h1 className="text-6xl font-bold text-purple-600 sm:text-8xl">404</h1>
      <h2 className="text-3xl font-semibold text-gray-500 my-5 sm:text-3xl">Halaman tidak ditemukan.</h2>
      <p className="text-lg text-gray-600 mb-8 sm:text-xl">Maaf, halaman yang anda cari tidak ada.</p>
      <Link href="/">Kembali ke Halaman Utama</Link>
    </div>
  );
}
