import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCoverImage = (namabeasiswa: string): string => {
  const lowerCaseName = namabeasiswa.toLowerCase();

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

export const grade = (rating: number) => {
  if (rating > 90) {
    return "A+";
  } else if (rating > 80) {
    return "A";
  } else if (rating > 70) {
    return "B";
  } else if (rating > 60) {
    return "C";
  } else {
    return "D";
  }
};
