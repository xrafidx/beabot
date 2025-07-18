"use client";
import React from "react";
import { z } from "zod";

const EssayUploadFormSchema = z.object({
  file: typeof window === "undefined" ? z.any().optional() : z.instanceof(FileList, { message: "Harap unggah file." }).refine().refine().refine(),
});

const page = () => {
  return <div></div>;
};

export default page;
