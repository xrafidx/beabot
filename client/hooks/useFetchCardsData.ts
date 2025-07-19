import { AiReviewContent, BackendCardData, BackendEssayData, BackendInterviewData, CardProps, EssayCardProps, InterviewCardProps } from "@/Types";
import { string } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { extend } from "dayjs";

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
  const judulInterviewMapped = card.judulinterview;
  const namaBeasiswaMapped = card.namabeasiswa || "";

  const jenisPertanyaanMapped = (card.jenispertanyaan || "regular").toLowerCase() as "regular" | "essay-driven";
  const userIdMapped = card.uid || "";
  const completeStatus = card.rating !== null && card.rating !== undefined;

  return {
    id: card.id.toString(),
    uid: userIdMapped,
    judulinterview: judulInterviewMapped,
    namabeasiswa: namaBeasiswaMapped,
    jenispertanyaan: jenisPertanyaanMapped,
    completeStatus: completeStatus,
    rating: card.rating,
    tanggal: card.tanggal,
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
