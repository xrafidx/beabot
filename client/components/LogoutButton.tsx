import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Logout success.");
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
      <Button onClick={handleLogout} className="btn-primary">
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
