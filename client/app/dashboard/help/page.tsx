import { requireUser } from "@/lib/cookies";
import React from "react";
import HelpPage from "./HelpPage";
import Help from "./Help";

const page = async () => {
  const user = await requireUser();
  return <Help user={user}></Help>;
};

export default page;
