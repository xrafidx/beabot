// app/help/page.tsx (Ini akan menjadi halaman utama Help Anda)
"use client";

import React from "react";
import FAQItem from "@/components/FAQItem"; // Pastikan path ini benar
import Link from "next/link";

const HelpPage: React.FC = () => {
  // Data dummy untuk FAQ Anda
  const faqData = [
    {
      question: "Bagaimana cara kerja AI Interview?",
      answer:
        "AI Interview kami menggunakan pemrosesan bahasa alami canggih untuk mensimulasikan pengalaman wawancara sungguhan. Ini mengajukan pertanyaan, mendengarkan jawaban Anda, dan memberikan umpan balik instan tentang ucapan, konten, dan bahasa tubuh Anda (jika webcam digunakan).",
    },
    {
      question: "Apa itu mode Regular dan Essay-driven?",
      answer:
        "Beabot menyediakan dua mode interview untuk mensimulasikan situasi wawancara seperti di dunia nyata. Pada mode regular, AI akan bertanya pertanyaan umum seputar diri anda untuk menerima Beasiswa. Sementara Essay-driven mewajibkan user untuk mengupload sebuah pdf essay. Nantinya isi .pdf tersebut akan dirangkum oleh AI kami dan akan men-generate pertanyaan yang berhubungan dengan seputar isi essay",
    },
    {
      question: "Jenis beasiswa apa saja yang didukung Beabot?",
      answer:
        "Beabot dirancang untuk membantu berbagai jenis beasiswa, termasuk akademik, berbasis prestasi, berbasis kebutuhan, dan beasiswa program khusus. Platform kami dapat disesuaikan dengan persyaratan spesifik berbagai aplikasi beasiswa.",
    },
    {
      question: "Apakah Beabot gratis untuk digunakan?",
      answer: "Kami menawarkan tingkatan gratis dengan fitur dasar untuk Anda memulai. Untuk akses tak terbatas ke alat AI canggih, ulasan manusia, dan fitur komunitas premium, kami menawarkan paket langganan yang fleksibel.",
    },
    {
      question: "Bagaimana cara menghapus riwayat interview saya?",
      answer: "Anda dapat menghapus riwayat interview Anda dari halaman 'My Interviews' dengan mengklik ikon tiga titik vertikal di pojok kanan atas kartu interview yang ingin Anda hapus, lalu pilih 'Hapus'.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Help</h1>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpenInitially={index === 0} // Buat pertanyaan pertama terbuka secara default
            />
          ))}
        </div>

        {/* Anda bisa menambahkan bagian lain di sini, seperti Contact Us atau More Resources */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
          <Link href="/contact" className="px-6 py-3 bg-purple-700 text-white rounded-md font-semibold hover:bg-purple-800 transition duration-300">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
