import { Control, FieldValues, Path } from "react-hook-form";

export type FormType = "sign-in" | "register";

export type BackendCardData = BackendInterviewData | BackendEssayData;

export type CardProps = InterviewCardProps | EssayCardProps;

export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export enum InterviewStatus { // <-- Pastikan ini ada di sini dan diekspor
  PENDING_SETUP = "PENDING_SETUP",
  PENDING_QUESTIONS = "PENDING_QUESTIONS",
  QUESTIONS_GENERATED = "QUESTIONS_GENERATED",
  INTERVIEW_COMPLETED = "INTERVIEW_COMPLETED",
  INTERVIEW_CANCELLED = "INTERVIEW_CANCELLED",
}

export interface InterviewCardProps {
  id: string;
  uid: string;
  judulinterview: string;
  namabeasiswa: string;
  jenispertanyaan: "regular" | "essay-driven";
  tanggal: string;
  completestatus: boolean;
  rating?: number | null;
  interviewstatus: InterviewStatus;
}

export interface BackendInterviewData {
  id: string;
  uid: string;
  judulinterview: string;
  namabeasiswa: string;
  jenispertanyaan: "regular" | "essay-driven";
  banyakPertanyaan: number;
  bahasa: "id" | "en";
  tanggal: string;
  rating?: number;
  complete: boolean;
  interviewstatus: InterviewStatus;
}

export interface InterviewFormData {
  judulInterview: string;
  namaBeasiswa: string;
  jenisPertanyaan: "regular" | "essay-driven";
  banyakPertanyaan: number;
  bahasa: "id" | "en";
  essay?: FileList;
}

export interface FormFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  description?: string;
}

export interface BackendEssayData {
  id: string;
  userid: string;
  aireview: string | null;
}

export interface EssayCardProps {
  id: string;
  userid: string;
  judulessay: string;
  rating?: number | null;
  tanggal: string;
  masukanreview?: string[] | null;
  kelebihanreview?: string[] | null;
  kesalahanreview?: string[] | null;
}

export interface EssayUploadFormData {
  file: FileList;
}

export interface AiReviewContent {
  rating: number | null;
  masukan: string[] | null;
  tanggal: string;
  kelebihan: string[] | null;
  kesalahan: string[] | null;
  judulessay: string;
}

export type Category = "all" | "completed" | "incomplete";

export interface DataStatusDisplayProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;
  loadingMessage?: string;
  errorMessage?: string;
}

export type CardComponentType = React.FC<CardProps>;

export interface CardListProps {
  cards: CardProps[];
  activeCategory: Category;
  createNewUrl?: string;
  noDataButtonText?: string;
  CardComponent: CardComponentType;
  title: string;
}
