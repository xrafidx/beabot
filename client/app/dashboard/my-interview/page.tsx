import { requireUser } from "@/lib/cookies";
import React from "react";
import MyInterview from "./MyInterview";

const page = async () => {
  const user = await requireUser();
  return <MyInterview user={user}></MyInterview>;
};

export default page;
