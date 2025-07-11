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

interface Interview {
  id: string;
  topic: string;
  level: string;
  questions: string[];
  fieldOfStudy: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface InterviewCardProps {
  interviewId: string;
  userId: string;
  judulInterview: string;
  namaBeasiswa: string;
  jenisPertanyaan: "Regular" | "Essay-driven";
  createdAt: Date;
  coverImageUrl?: string;
  complete: boolean;
}

interface BackendInterviewData {
  interviewId: string;
  userId: string;
  judulInterview: string;
  namaBeasiswa: string;
  jenisPertanyaan: "Regular" | "Essay-driven";
  banyakPertanyaan: number;
  bahasa: "id" | "en";
  tanggal: string;
  rating?: number;
  complete: boolean;
}
