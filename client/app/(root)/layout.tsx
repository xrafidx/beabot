// import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <nav className="p-4">
        <Link href="/" className="flex items-center">
          <h2 className="gap-2">Beabot</h2>
        </Link>
      </nav>

      <div className="root-layout">{children}</div>
    </div>
  );
};

export default RootLayout;
