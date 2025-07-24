import { requireUser } from "@/lib/cookies";
import React from "react";
import AboutPage from "./AboutUs";

const page = async () => {
  await requireUser();
  return <AboutPage></AboutPage>;
};

export default page;
