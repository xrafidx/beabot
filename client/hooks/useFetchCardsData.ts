import { AiReviewContent, BackendCardData, BackendEssayData, BackendInterviewData, CardProps, EssayCardProps, InterviewCardProps, InterviewStatus } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseFetchCardsDataProps<TBackend extends BackendCardData, TFrontend extends CardProps> {
  queryKey: string[];
  apiEndpoint: string;
  mapper: (card: TBackend) => TFrontend;
}

export function useFetchCardsData<TBackend extends BackendCardData, TFrontend extends CardProps>({ queryKey, apiEndpoint, mapper }: UseFetchCardsDataProps<TBackend, TFrontend>) {
  const {
    data: rawData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TBackend[], Error>({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000${apiEndpoint}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch data from ${apiEndpoint}: ${response.status}`);
      }

      const result = await response.json();
      if (!Array.isArray(result.data)) {
        throw new Error(`Backend did not return an array of cards from ${apiEndpoint}.`);
      }
      return result.data as TBackend[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const mappedCards: TFrontend[] = useMemo(() => {
    return rawData.map(mapper);
  }, [rawData, mapper]);
  return { mappedCards, isLoading, isError, error, refetch };
}
export const mapBackendInterviewToCard = (card: BackendInterviewData): InterviewCardProps => {
  // Ambil properti dari card (sesuai casing backend yang Anda konfirmasi)
  const idFromBackend = card.id;
  const uidFromBackend = card.uid;
  const judulinterviewFromBackend = card.judulinterview;
  const namabeasiswaFromBackend = card.namabeasiswa;
  const jenispertanyaanFromBackend = card.jenispertanyaan;
  const tanggalFromBackend = card.tanggal;
  const ratingFromBackend = card.rating;
  const completeFromBackend = card.complete;
  const interviewstatusFromBackend = card.interviewstatus; // <-- Ini adalah status aktual dari backend JSON

  let inferredStatus: InterviewStatus;

  // KOREKSI UTAMA: Prioritaskan status yang dikirim oleh backend terlebih dahulu
  if (interviewstatusFromBackend === InterviewStatus.INTERVIEW_COMPLETED) {
    inferredStatus = InterviewStatus.INTERVIEW_COMPLETED;
  } else if (interviewstatusFromBackend === InterviewStatus.QUESTIONS_GENERATED) {
    inferredStatus = InterviewStatus.QUESTIONS_GENERATED; // <-- INI YANG AKAN TERPICU JIKA BACKEND MENGIRIM INI
  } else if (interviewstatusFromBackend === InterviewStatus.PENDING_QUESTIONS) {
    inferredStatus = InterviewStatus.PENDING_QUESTIONS;
  } else if (interviewstatusFromBackend === InterviewStatus.PENDING_SETUP) {
    inferredStatus = InterviewStatus.PENDING_SETUP;
  } else if (interviewstatusFromBackend === InterviewStatus.INTERVIEW_CANCELLED) {
    inferredStatus = InterviewStatus.INTERVIEW_CANCELLED;
  }
  // Jika backend mengembalikan status yang tidak cocok dengan enum yang valid, baru gunakan inferensi lain
  // Atau default ke PENDING_SETUP/QUESTIONS
  else {
    // Fallback jika status dari backend tidak valid atau tidak ada
    inferredStatus = InterviewStatus.PENDING_SETUP; // Atau PENDING_QUESTIONS
  }

  // ... (return objek, tidak ada perubahan di sini) ...
  return {
    id: idFromBackend,
    uid: uidFromBackend,
    judulinterview: judulinterviewFromBackend,
    namabeasiswa: namabeasiswaFromBackend,
    jenispertanyaan: jenispertanyaanFromBackend as "regular" | "essay-driven",
    tanggal: tanggalFromBackend,
    completestatus: completeFromBackend, // Ini sesuai dengan complete dari backend
    rating: ratingFromBackend,
    interviewstatus: inferredStatus, // Status yang sudah disimpulkan (berdasarkan prioritas status backend)
  };
};
export const mapBackendEssayToCard = (card: BackendEssayData): EssayCardProps => {
  let aiReviewParsed = card.aireview; // Sekarang ini langsung objek AiReviewContent atau null
  let judulEssayFromReview = "Judul Essay Tidak Ditemukan";
  let ratingFromReview: number | null = null;
  let completeStatusCalculated = false;
  let masukanReview: string[] | null = null;
  let kelebihanReview: string[] | null = null;
  let kesalahanReview: string[] | null = null;
  let tanggalReview: string = "";

  if (aiReviewParsed) {
    judulEssayFromReview = aiReviewParsed.judulessay || judulEssayFromReview;
    ratingFromReview = aiReviewParsed.rating;
    completeStatusCalculated = ratingFromReview !== null && ratingFromReview !== undefined;
    masukanReview = aiReviewParsed.masukan; // Ambil masukan
    kelebihanReview = aiReviewParsed.kelebihan; // Ambil kelebihan
    kesalahanReview = aiReviewParsed.kesalahan; // Ambil kesalahan
    tanggalReview = aiReviewParsed.tanggal; // Tanggal sudah string dari backend
  } // Default untuk namaBeasiswa (karena tidak ada di JSON essay)

  const essayNamaBeasiswa = "";

  return {
    id: card.id.toString(), // Gunakan card.id, bukan essayid, dan konversi ke string
    uid: card.userid, // <-- KOREKSI: Gunakan userId (camelCase)
    judulessay: judulEssayFromReview, // <-- KOREKSI: Gunakan judulEssay (camelCase)

    tanggal: tanggalReview, // Tanggal sudah string dari backend
    rating: ratingFromReview,
    completestatus: completeStatusCalculated, // <-- KOREKSI: Gunakan completeStatus (camelCase)
    // Tambahkan properti review lainnya jika EssayCardProps menampilkannya
    masukanReview: masukanReview,
    kelebihanReview: kelebihanReview,
    kesalahanReview: kesalahanReview,
  };
};
