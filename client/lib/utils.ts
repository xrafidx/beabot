import { interviewCovers } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLogo = async (fieldArray: string[]) => {
  const logoURLs = fieldArray.map((field) => {
    return {
      field,
      url: `${fieldIconBaseURL}`,
    };
  });
};

// const fieldIconBaseURL = "./public/CompanyName";

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
