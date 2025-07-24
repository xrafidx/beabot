// components/FAQItem.tsx
// Ini akan menjadi komponen terpisah untuk setiap item FAQ agar lebih rapi
"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react"; // Import ikon dari lucide-react

interface FAQItemProps {
  question: string;
  answer: string;
  isOpenInitially?: boolean; // Opsional, untuk membuat item tertentu terbuka secara default
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpenInitially = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <button className="w-full flex justify-between items-center p-4 text-left focus:outline-none" onClick={toggleOpen} aria-expanded={isOpen}>
        <h3 className="text-lg font-semibold text-purple-700">{question}</h3>
        {/* Menggunakan ikon Chevron berdasarkan state isOpen */}
        {isOpen ? <ChevronDown className="h-5 w-5 text-purple-700 transition-transform duration-300" /> : <ChevronRight className="h-5 w-5 text-purple-700 transition-transform duration-300" />}
      </button>
      <div
        className={clsx(
          "px-4 pb-4 transition-all duration-300 ease-in-out",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0" // Animasi slide dan fade
        )}>
        <p className="text-gray-700">{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem;
