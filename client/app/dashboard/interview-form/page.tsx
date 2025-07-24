import InterviewForm from "@/components/InterviewForm";
import { requireUser } from "@/lib/cookies";
import React from "react";

const page = async () => {
  const user = await requireUser();

  return (
    <div>
      <InterviewForm user={user}></InterviewForm>
    </div>
  );
};

export default page;
