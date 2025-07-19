"use client";

// import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import UserNavbar from "@/components/UserNavbar";
import Link from "next/link";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <LogoutButton></LogoutButton>
      {/* <UserNavbar></UserNavbar> */}
      <div className="root-layout">{children}</div>
    </div>
  );
};

export default RootLayout;
