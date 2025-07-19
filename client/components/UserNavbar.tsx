"use client";

import React, { createContext } from "react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (useData: User) => void;
  logout: () => void;
  refetchUser: () => void;
}

const UserNavbar = () => {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
};

export default UserNavbar;
