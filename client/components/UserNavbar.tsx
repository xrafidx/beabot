"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MenuIcon, UserCircleIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { API_ENDPOINTS, BASE_URL } from "@/constants";
import Image from "next/image";

export default function UserNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: "Guest", email: "-" });

  useEffect(() => {
    fetch(`${BASE_URL}${API_ENDPOINTS.USER_DATA}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser({
          name: data.data.name,
          email: data.data.email,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "About Us", href: "/dashboard/about-us" },
    { name: "Help", href: "/dashboard/help" },
  ];

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold text-purple-600">
        <Image src="/beabot-icon/beabot-logo-ungu-samping.png" alt="beabot icon" width={120} height={120}></Image>
      </Link>

      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} className={`text-gray-700 hover:text-purple-600 transition-colors duration-200 ${pathname === link.href ? "text-purple-600 font-semibold" : ""}`}>
            {link.name}
          </Link>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative p-0 h-auto rounded-full focus-visible: ring-offset-0 focus-visible:ring-0">
              <UserCircleIcon className="w-8 h-8 hover:text-purple-600 transition-colors duration-200">
                <span className="sr-only">User Profile Menu</span>
              </UserCircleIcon>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-xs">
            <div className="flex flex-col justify-between h-full py-6">
              {/* User Info + Nav Links */}
              <div>
                <div className="flex items-center gap-x-3 px-2 mb-6">
                  <UserCircleIcon className="w-8 h-8 text-gray-600" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <hr className="mb-4" />

                <div className="flex flex-col gap-3 px-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.name}>
                      <Link href={link.href} className={`block w-full px-2 py-2 rounded-md transition-colors duration-200 ${pathname === link.href ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-600"}`}>
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="mt-8 px-2">
                <hr className="mb-3" />
                <SheetClose asChild>
                  <LogoutButton />
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
