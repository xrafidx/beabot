"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";

const faqs = [
  {
    question: "Apa itu Beabot?",
    answer: "Beabot adalah platform AI yang membantu kamu mempersiapkan wawancara dan mereview esai untuk mengajukan beasiswa.",
  },
  {
    question: "Jadi apa yang bisa dilakukan oleh beabot?",
    answer:
      "Beabot dapat melakukan mockup interview untuk skenario wawancara beasiswa dan dapat memberikan feedback secara real time. Tidak hanya itu, Beabot juga dapat menilai esai buatanmu, serta memberi masukkan untuk perbaikan pada esai mu.",
  },
  {
    question: "Apakah perlu menyalakan microphone untuk melakukan interview?",
    answer: "Ya, pastikan kamu mengaktifkan microphone untuk berbicara langsung dengan Bella, sang asisten interview yang siap menemani kamu berlatih wawancara.",
  },
];

const Page = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* NAVBAR */}
      <nav className={`p-4 fixed top-0 left-0 w-full z-50 bg-${!scrolled ? "translate" : "white"}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image src={`/beabot-icon/${scrolled ? "beabot-logo-ungu-samping.png" : "beabot-logo-putih-samping.png"}`} alt="beabot icon" width={125} height={125}></Image>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/register" className={`transition-colors duration-300 ${scrolled ? "btn-primary text-white" : "btn-white text-black"}`}>
              Get Started
            </Link>
            <Link href="/sign-in" className={`transition-colors duration-300 ${scrolled ? "btn-outline-purple text-[#753a88]" : "btn-outline text-white"}`}>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold my-4">Ace Your Interviews & Perfect your Essays</h1>
          <p className="text-white my-4">Get expert feedback on your interview performance and essay writing. Our AI-powered platform and human reviewers help you succeed in your academic and career goals.</p>

          <div className="flex justify-center gap-5 mt-6">
            <Link href="/register" className="btn-outline">
              Start Free Review
            </Link>
            {/* <Link href="/" className="btn-outline">
              Watch Demo
            </Link> */}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Fitur Utama</h2>
        <div className="flex flex-wrap justify-center gap-8 px-4 max-w-6xl mx-auto">
          {[
            {
              title: "Mock Interview",
              desc: "Simulasi wawancara beasiswa dengan AI secara real-time.",
              points: ["Real-time AI feedback", "Analisis performa", "Pertanyaan adaptif"],
            },
            {
              title: "Essay Review",
              desc: "Dapatkan ulasan dan saran perbaikan untuk esai kamu.",
              points: ["Grammar & coherence check", "Struktur & ide utama", "AI + Reviewer manusia"],
            },
            {
              title: "Custom Feedback",
              desc: "Saran personal sesuai bidang studi & tujuanmu.",
              points: ["Scholarship-specific", "Multibahasa", "Personalized insights"],
            },
            {
              title: "Komunitas",
              desc: "Diskusi dengan kandidat lain dan mentor alumni.",
              points: ["Forum terbuka", "Live Q&A", "Mentorship"],
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-xl p-6 w-full md:w-[22%]">
              <h3 className="text-xl font-semibold mb-2 text-[#753a88]">{item.title}</h3>
              <p className="text-sm mb-2">{item.desc}</p>
              <ul className="text-sm list-disc ml-5 space-y-1">
                {item.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-[#753a88] mb-4">Tentang Beabot</h2>
          <p className="text-md text-gray-700">
            Beabot adalah platform yang dirancang untuk membantu pelajar dan mahasiswa dalam mempersiapkan wawancara dan esai beasiswa secara efektif. Kami menggabungkan teknologi AI dan keahlian manusia untuk memberikan pengalaman belajar
            terbaik.
          </p>
        </div>
      </section>

      {/* FAQ / HELP */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#753a88]">Help & FAQ</h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <FAQItem
                  question={item.question}
                  answer={item.answer}
                  isOpenInitially={index === 0} // Pertanyaan pertama terbuka default
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default Page;
