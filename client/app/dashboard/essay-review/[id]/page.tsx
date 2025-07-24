import { requireUser } from "@/lib/cookies";
import React from "react";
import EssayReview from "./EssayReview";

const page = async () => {
  const user = await requireUser();
  return <EssayReview user={user}></EssayReview>;
};

export default page;
