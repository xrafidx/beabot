import { FieldValues } from "react-hook-form";

type FormType = "sign-in" | "register";

interface Feedback {
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

interface InterviewCardProps {
  id: string;
  uid: string;
  judulinterview: string;
  namabeasiswa: string;
  jenispertanyaan: "regular" | "essay-driven";
  createdat: Date;
  rating?: number | null;
}
interface BackendInterviewData {
  id: string;
  uid: string;
  judulinterview: string;
  namabeasiswa: string;
  jenispertanyaan: "regular" | "essay-driven";
  banyakPertanyaan: number;
  bahasa: "id" | "en";
  createdat: string;
  rating?: number;
  complete: boolean;
}

interface InterviewFormData {
  judulInterview: string;
  namaBeasiswa: string;
  jenisPertanyaan: "regular" | "essay-driven";
  banyakPertanyaan: number;
  bahasa: "id" | "en";
  essay?: FileList;
}

interface FormFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  description?: string;
}
