"use client";

// import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <nav className="p-4">
        <Link href="/" className="flex items-center py-3">
          <h2 className="gap-2">Beabot</h2>
        </Link>

        <LogoutButton></LogoutButton>
      </nav>

      <div className="root-layout">{children}</div>
    </div>
  );
};

export default RootLayout;
