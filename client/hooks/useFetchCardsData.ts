import { BASE_URL } from "@/constants";
import { AiReviewContent, BackendCardData, BackendEssayData, BackendInterviewData, CardProps, EssayCardProps, InterviewCardProps, InterviewStatus } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseFetchCardsDataProps<TBackend extends BackendCardData, TFrontend extends CardProps> {
  queryKey: string[];
  apiEndpoint: string;
  mapper: (card: TBackend) => TFrontend;
  refetchInterval?: number | false | ((query: any) => number | false);
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
      const response = await fetch(`${BASE_URL}${apiEndpoint}`, {
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
  // const completeFromBackend = card.complete;
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
    // completestatus: completeFromBackend, // Ini sesuai dengan complete dari backend
    rating: ratingFromBackend,
    interviewstatus: inferredStatus, // Status yang sudah disimpulkan (berdasarkan prioritas status backend)
  };
};
export const mapBackendEssayToCard = (card: BackendEssayData): EssayCardProps => {
  let aiReviewContent: AiReviewContent | null = null; // Deklarasi baru untuk hasil parsing/penyimpanan objek review

  // ************ PERBAIKAN DI SINI: Parsing aiReviewParsed ************
  if (card.aireview) {
    if (typeof card.aireview === "string") {
      try {
        aiReviewContent = JSON.parse(card.aireview) as AiReviewContent;
      } catch (e) {
        console.error("Failed to parse aiReview string in mapBackendEssayToCard:", card.id, e);
        // Biarkan aiReviewContent tetap null atau handle error sesuai kebutuhan
      }
    } else {
      // Jika sudah objek, langsung gunakan
      aiReviewContent = card.aireview;
    }
  }
  // *******************************************************************

  let judulEssayFromReview = "Judul Essay Tidak Ditemukan";
  let ratingFromReview: number | null = null;
  let completeStatusCalculated = false;
  let masukanReview: string[] | null = null;
  let kelebihanReview: string[] | null = null;
  let kesalahanReview: string[] | null = null;
  let tanggalReview: string = "";

  // Gunakan aiReviewContent yang sudah dipastikan objek
  if (aiReviewContent) {
    judulEssayFromReview = aiReviewContent.judulessay || judulEssayFromReview;
    ratingFromReview = aiReviewContent.rating;
    completeStatusCalculated = ratingFromReview !== null && ratingFromReview !== undefined;
    masukanReview = aiReviewContent.masukan || masukanReview;
    kelebihanReview = aiReviewContent.kelebihan || kelebihanReview;
    kesalahanReview = aiReviewContent.kesalahan || kesalahanReview;
    tanggalReview = aiReviewContent.tanggal || tanggalReview;
  }

  // const essayNamaBeasiswa = ""; // Variabel ini sepertinya tidak terpakai, bisa dihapus

  return {
    id: card.id.toString(),
    userid: card.userid, // Pastikan 'userid' di BackendEssayData adalah properti yang benar
    judulessay: judulEssayFromReview,
    tanggal: tanggalReview,
    rating: ratingFromReview,
    // completestatus: completeStatusCalculated,
    masukanreview: masukanReview,
    kelebihanreview: kelebihanReview,
    kesalahanreview: kesalahanReview,
  };
};
