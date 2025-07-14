import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCoverImage = (namaBeasiswa: string): string => {
  const lowerCaseName = namaBeasiswa.toLowerCase();

  if (mappings[lowerCaseName]) {
    return mappings[lowerCaseName];
  }

  for (const key in mappings) {
    if (lowerCaseName.includes(key)) {
      return mappings[key];
    }
  }
  return "/covers/defaultScholarship.svg";
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
