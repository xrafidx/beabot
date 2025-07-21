"use client";

import Footer from "@/components/Footer";
// import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import UserNavbar from "@/components/UserNavbar";
import Link from "next/link";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <UserNavbar></UserNavbar>
      <div className="root-layout">{children}</div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
