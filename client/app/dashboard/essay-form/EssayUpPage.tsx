"use client";
import EssayUploadForm from "@/components/EssayUploadForm";
import { requireUser } from "@/lib/cookies";
import React from "react";

const EssayUpPage = ({ user }: { user: any }) => {
  return (
    <div>
      <EssayUploadForm></EssayUploadForm>
    </div>
  );
};

export default EssayUpPage;
