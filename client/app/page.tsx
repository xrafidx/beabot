"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
const Page = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav className="p-4 fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kiri: Logo */}
          <Link href="/">
            <h2
              className={`text-3xl font-bold transition-colors duration-300 
        ${scrolled ? "text-[#753a88]" : "text-white"}`}>
              Beabot
            </h2>
          </Link>

          {/* Kanan: Tombol */}
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

      <section className="hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl text-center font-extrabold my-4">Ace Your Interviews & Perfect your Essays</h1>
          <p className="text-white text-center my-4">Get expert feedback on your interview performance and essay writing. Our AI-powered platform and human reviewers help you succeed in your academic and career goals.</p>
        </div>

        <div className="flex flex-row gap-5">
          <Link href="/" className="btn-outline">
            Start Free Review
          </Link>
          <Link href="/" className="btn-outline">
            Watch Demo
          </Link>
        </div>
      </section>

      <div className="root-layout">
        <h2 className="text-center fw-extrabold my-8">Our Services</h2>

        <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center gap-8.5 mx-auto">
          <div className="w-full lg:w-[22%]">
            <div className="card-border border-[#753a88] p-5">
              <h3 className="text-center my-2">Mock Interview</h3>
              <p className="text-center my-2">Practice with AI-powered mock interviews tailored to scholarship preparation.</p>
              <ul className="text-md">
                <li>Scholarship-specific questions.</li>
                <li>Real-time feedback</li>
                <li>Performance analytics</li>
                <li>Unlimited practice sessions</li>
              </ul>
              <div className="w-full justify-center items-center my-3">
                <Link href="/" className="btn-outline-purple">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[22%]">
            <div className="card-border border-[#753a88] p-5">
              <h3 className="text-center">Essay Review</h3>
            </div>
          </div>

          <div className="w-full lg:w-[22%]">
            <div className="card-border border-[#753a88] p-5">
              <h3 className="text-center">AI Feedback</h3>
            </div>
          </div>

          <div className="w-full lg:w-[22%]">
            <div className="card-border border-[#753a88] p-5">
              <h3>Community</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
