import { requireUser } from "@/lib/cookies";
import React from "react";
import MyEssays from "./MyEssays";

const page = async () => {
  const user = await requireUser();
  return <MyEssays user={user}></MyEssays>;
};

export default page;
