// app/about/page.tsx
"use client";

import React from "react";
import Link from "next/link";
// Jika Anda akan menggunakan ikon dari lucide-react, import di sini
// import { MessageSquare, FilePenLine, Users } from "lucide-react"; // Contoh ikon

const AboutPage: React.FC = () => {
  // Data untuk kartu-kartu About Us
  const aboutCardsData = [
    {
      id: 1,
      icon: "💬", // Placeholder ikon. Ganti dengan komponen atau <img> jika diperlukan
      title: "Simulasi Wawancara AI Realistis",
      description: "Latih kemampuan wawancara Anda kapan saja dan di mana saja. AI kami akan mengajukan pertanyaan-pertanyaan umum hingga skenario spesifik industri, memberikan Anda pengalaman wawancara yang paling otentik.",
      link: "/dashboard", // Ganti dengan link yang sesuai
    },
    {
      id: 2,
      icon: "✍️", // Placeholder ikon. Ganti dengan komponen atau <img> jika diperlukan
      title: "Review Esai Komprehensif",
      description:
        "Jangan biarkan esai yang kurang sempurna menghambat Anda. Unggah esai lamaran kerja, motivasi letter, atau tulisan penting lainnya. AI kami akan menganalisis tata bahasa, struktur, alur pemikiran, konsistensi, dan dampak keseluruhan.",
      link: "/dashboard", // Ganti dengan link yang sesuai
    },
    {
      id: 3,
      icon: "🚀", // Placeholder ikon. Ganti dengan komponen atau <img> jika diperlukan
      title: "Peningkatan Kepercayaan Diri",
      description: "Dengan latihan berkelanjutan dan umpan balik yang konstruktif, Beabot membantu Anda membangun kepercayaan diri secara signifikan.",
      link: "/dashboard", // Ganti dengan link yang sesuai
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Judul Halaman */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-12">About us</h1>

        {/* Bagian Kartu Layanan */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {aboutCardsData.map((card) => (
            <div
              key={card.id}
              className="relative w-full lg:w-1/3 flex flex-col p-6 rounded-xl border border-gray-200 shadow-lg
                         bg-white overflow-hidden"
              style={{
                // Styling untuk border ungu yang menonjol
                borderImageSlice: 1,
                borderImageSource: "linear-gradient(to right, #753a88, #C78FEB)", // Contoh gradien ungu
                borderWidth: "4px", // Ketebalan border
                padding: "2rem", // Menyesuaikan padding karena border tebal
              }}>
              {/* Ini adalah bagian border ungu di sudut. Bisa disesuaikan lagi */}
              {/* <div className="absolute inset-0 rounded-xl pointer-events-none"
                   style={{
                     border: '4px solid transparent',
                     background: 'linear-gradient(to right, #753a88, #C78FEB) border-box',
                     mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                     maskComposite: 'exclude',
                     WebkitMaskComposite: 'exclude',
                   }}
              ></div> */}

              {/* Ikon */}
              <div className="mb-4 flex justify-center">
                {/* Placeholder ikon: Ganti ini dengan komponen ikon (misal: <MessageSquare className="w-12 h-12 text-purple-700" />)
                    atau tag <img> jika Anda menggunakan gambar */}
                <span className="text-purple-700 text-5xl">{card.icon}</span>
                {/* Contoh jika menggunakan gambar:
                <img src="/path/to/your/icon.png" alt="Icon" className="w-12 h-12 text-purple-700" />
                */}
              </div>

              {/* Judul Kartu */}
              <h2 className="text-xl font-bold text-center text-gray-800 mb-2">{card.title}</h2>

              {/* Deskripsi */}
              <p className="text-gray-600 text-center text-sm mb-6 flex-grow">{card.description}</p>

              {/* Tombol Lihat Lebih Banyak */}
              <div className="text-center">
                <Link
                  href={card.link}
                  className="inline-flex items-center text-purple-700 font-semibold
                             hover:text-purple-900 transition-colors duration-300">
                  Lihat Lebih Banyak
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
