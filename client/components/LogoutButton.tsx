"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { API_ENDPOINTS, BASE_URL } from "@/constants";
import { deleteCookie, getCookie } from "cookies-next/client";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const token = getCookie("accessToken");
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Logout success.");
        deleteCookie("accessToken", `${token}`);
        window.location.href = "/sign-in";
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Gagal logout.");
        console.error("Logout failed");
      }
    } catch (error) {
      toast.error(`An error occured while logout: ${error instanceof Error ? error.message : "Unknown error."}`);
    }
  };

  return (
    <div>
      <Button onClick={handleLogout} className="text-red-500">
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
