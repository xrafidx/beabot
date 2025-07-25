// app/help/page.tsx (Ini akan menjadi halaman utama Help Anda)
"use client";

import React from "react";
import FAQItem from "@/components/FAQItem"; // Pastikan path ini benar
// import Link from "next/link";

const HelpPage: React.FC = () => {
  // Data dummy untuk FAQ Anda
  const faqData = [
    {
      question: "Bagaimana cara kerja AI Interview?",
      answer:
        "Pertama, klik tombol Start an Interview, isi form interview untuk melakukan setup interview seperti durasi interview, bahasa, jenis interview dan sebagainya. Setelah klik submit, tunggu beberapa saat hingga interview anda muncul di dashboard, dan kamu bisa memulai interview dengan klik 'Mulai Interview'. (Pastikan akses microphone pada browser diizinkan.)",
    },
    {
      question: "Apa itu mode Regular dan Essay-driven?",
      answer:
        "Beabot menyediakan dua mode interview untuk mensimulasikan situasi wawancara seperti di dunia nyata. Pada mode regular, AI akan bertanya pertanyaan umum seputar diri anda untuk menerima Beasiswa. Sementara Essay-driven mewajibkan user untuk mengupload sebuah pdf essay. Nantinya isi .pdf tersebut akan dirangkum oleh AI kami dan akan men-generate pertanyaan yang berhubungan dengan seputar isi essay",
    },
    {
      question: "Mengapa setelah beberapa pertanyaan saya diharuskan menjawab selesai?",
      answer:
        "AI Interview akan memiliki 4 fase pada interview yang akan ditemani Bella sang assistant. Pada fase pertama Bella akan bertanya beberapa pertanyaan dasar seperti perkenalan, prestasi, kelebihan dan kekurangan, serta rencana masa depan. Lalu pada fase kedua Bella akan bertanya seputar pertanyaan lain (jika memilih essay-driven Bella akan bertanya terkait esai yang kamu buat). Lalu pada fase ketiga Bella akan menggali lebih dalam jawaban yang anda buat dari pertanyaan sebelumnya. Pada fase keempat, Bella akan memberikan penilaian oleh jawaban anda.",
    },
    {
      question: "Bagaimana cara saya memulai Essay Review?",
      answer: "Klik tombol 'Start Essay Review' pada halaman dashboard, lalu upload file essay dalam format .pdf, dan tunggu beberapa saat hingga review selesai. Setelah itu anda bisa melihat hasil penilaian anda.",
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
              isOpenInitially={false} // Buat pertanyaan pertama terbuka secara default
            />
          ))}
        </div>

        {/* Anda bisa menambahkan bagian lain di sini, seperti Contact Us atau More Resources */}
        <div className="text-center mt-12"></div>
      </div>
    </div>
  );
};

export default HelpPage;
