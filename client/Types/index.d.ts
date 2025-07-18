import { FieldValues } from "react-hook-form";

type FormType = "sign-in" | "register";

type BackendCardData = BackendInterviewData | BackendEssayData;

type CardProps = InterviewCardProps | EssayCardProps;

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
  tanggal: string;
  completeStatus: boolean;
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
  tanggal: string;
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

interface BackendEssayData {
  essayid: string;
  userid: string;
  aireview: string | null;
}

interface EssayCardProps {
  essayid: string;
  uid: string;
  judulessay: string;
  rating?: number | null;
  tanggal: string;
  completestatus: boolean;
}

interface EssayUploadFormData {
  file: FileList;
}

interface AiReviewContent {
  rating: number | null;
  masukan: string | null;
  tanggal: string;
  kelebihan: string[] | null;
  kesalahan: string[] | null;
  judulessay: string;
}

type Category = "all" | "completed" | "incomplete";

interface DataStatusDisplayProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;
  loadingMessage?: string;
  errorMessage?: string;
}

type CardComponentType = React.FC<AnycardProps>;

interface CardListProps {
  cards: AnyCardsProps[];
  activeCategory: Category;
  createNewUrl?: string;
  noDataButtonText?: string;
  CardComponent: CardComponentType;
  title: string;
}
