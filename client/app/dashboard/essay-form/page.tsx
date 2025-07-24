import React from "react";
import EssayUpPage from "./EssayUpPage";
import { requireUser } from "@/lib/cookies";

const page = async () => {
  const user = await requireUser();
  return <EssayUpPage user={user} />;
};

export default page;
