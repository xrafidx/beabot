import { requireUser } from "@/lib/cookies";
import React from "react";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

const page = async () => {
  const user = requireUser();
  console.log(user);
  if (!user) {
    console.log("user tidak ditemukan");
    redirect("/sign-in");
  }
  return <DashboardClient user={user}></DashboardClient>;
};

export default page;
