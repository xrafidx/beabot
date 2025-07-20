"use client";

import Image from "next/image";

// import { FaInstagram, FaGlobe } from "react-icons/fa";
// import { FaFacebookF } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#753a88] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kiri */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/beabot-icon/beabot-logo-putih-samping.png" alt="beabot logo" width={100} height={100}></Image>
          </div>
          <p className="text-sm text-gray-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
        </div>

        {/* Tengah */}
        <div>
          <h3 className="font-bold mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <a href="/dashboard" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="/help" className="hover:underline">
                Help
              </a>
            </li>
            <li>
              <a href="/logout" className="hover:underline">
                Logout
              </a>
            </li>
          </ul>
        </div>

        {/* Kanan */}
        <div>
          <h3 className="font-bold mb-4">Social Media</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-center gap-2">@beabot</li>
            <li className="flex items-center gap-2">Beabot</li>
            <li className="flex items-center gap-2">@beabot</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-xs text-gray-300 border-t border-white/20 pt-4">2025 Digidaw Team. All right reserved</div>
    </footer>
  );
}
