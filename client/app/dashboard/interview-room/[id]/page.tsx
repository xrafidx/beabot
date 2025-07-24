import React from "react";
import VapiWorkflowButton from "./InterviewRoom";
import { requireUser } from "@/lib/cookies";

const page = async () => {
  const user = await requireUser();
  return <VapiWorkflowButton usercookies={user} />;
};

export default page;
