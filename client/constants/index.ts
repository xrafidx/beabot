export const mappings: { [key: string]: string } = {
  tanoto: "/covers/tanoto.svg",
  kemdikbud: "/covers/kemdikbud.svg",
  "kementerian pendidikan": "/covers/kemdikbud.svg",
  unggulan: "/covers/kemdikbud.svg",
  kip: "/covers/kemdikbud.svg",
  "kartu indonesia pintar": "/covers/kemdikbud.svg",
  bpi: "/covers/bpi-logo.png",
  "beasiswa bpi": "/covers/bpi-logo.png",
  jfls: "/covers/jfls-logo",
  "jabar future leadership scholarship": "/covers/jfls-logo.jpg",
  sampoena: "/covers/logo-sampoerna.png",
  psf: "/covers/logo-sampoerna.png",
  "putra sampoerna foundation": "/covers/logo-sampoerna.png",
  "sampoerna-foundation": "/covers/logo-sampoerna.png",
  lpdp: "/covers/lpdp-logo.png",
  sinarmas: "/covers/sinarmas-logo.png",
  yapi: "/covers/Yayasan-Alumni-IPB.png",
  "yayasan alumni ipb": "/covers/Yayasan-Alumni-IPB.png",
  "Yayasan Alumni IPB": "/covers/Yayasan-Alumni-IPB.png",
};

export const interviewCovers = ["/kemdikbud.svg", "/tanoto.svg"];

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const API_ENDPOINTS = {
  // Buat ambil semua kartu interview
  GET_ALL_INTERVIEW_CARDS: "/api/v1/cards",

  // Buat bikin kartu interview
  CREATE_INTERVIEW_CARD: "/api/v1/cards",

  BASE_INTERVIEW_CARD_BY_ID: "/api/v1/cards",

  ESSAY_REVIEW: "/api/v1/essay-review",

  REGISTER: "/api/v1/auth/register",

  SIGN_IN: "/api/v1/auth/sign-in",

  LOGOUT: "/api/v1/auth/logout",

  USER_DATA: "/api/v1/user-data",

  GENERATE_REGULAR_QUESTION: "/api/v1/question-regular",

  GENERATE_ESSAY_QUESTION: "/api/v1/question-essay",
};

export const INTERVIEW_TYPES_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "essay-driven", label: "Essay-driven" },
];

export const INTERVIEW_LANGUAGE_OPTIONS = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
];

export const INTERVIEW_DURATION_OPTIONS = [
  { label: "Pendek", value: "1" },
  { label: "Normal", value: "3" },
  { label: "Panjang", value: "5" },
];
