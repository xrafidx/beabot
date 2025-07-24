// app/dashboard/essay-review/[id]/page.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
// import dayjs from "dayjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DataStatusDisplay from "@/components/DataStatusDisplay";
import { API_ENDPOINTS } from "@/constants";
import { AiReviewContent, BackendEssayData } from "@/Types"; // Pastikan AiReviewContent diimpor

interface EssayDetailPageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: EssayDetailPageProps) => {
  const essayId =
    typeof params.id === "object" && params.id !== null && "then" in params.id
      ? React.use(params.id) // Jika params.id adalah Promise
      : params.id; // Jika params.id adalah string biasa

  const {
    data: rawEssayData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BackendEssayData, Error>({
    queryKey: ["essayDetail", essayId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000${API_ENDPOINTS.ESSAY_REVIEW}/${essayId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memuat detail esai.");
      }
      const result = await response.json();
      return result.data as BackendEssayData;
    },
    enabled: !!essayId && essayId !== "temp-user",
  });

  if (isLoading || isError) {
    return <DataStatusDisplay isLoading={isLoading} isError={isError} error={error} onRetry={refetch} loadingMessage="Memuat detail review essay..." errorMessage="Gagal memuat detail review essay."></DataStatusDisplay>;
  }

  if (!rawEssayData || !rawEssayData.aireview) {
    if (essayId.startsWith("temp-")) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-500 mb-4"></div>
          <p className="text-gray-600 mb-4">Review esai masih dalam proses...</p>
          <p className="text-sm text-gray-500">Halaman akan otomatis diperbarui ketika review selesai.</p>
          <Link href="/dashboard">
            <Button className="btn-secondary mt-4">Kembali ke Dashboard</Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-600">
        <p>Detail esai tidak ditemukan atau tidak dapat diproses.</p>
        <Link href="/dashboard">
          <Button className="btn-primary">Kembali ke Dashboard</Button>
        </Link>
      </div>
    );
  }

  // KOREKSI UTAMA: Tangani kedua kemungkinan tipe untuk rawEssayData.aireview
  let parsedReview: AiReviewContent;
  if (typeof rawEssayData.aireview === "string") {
    try {
      parsedReview = JSON.parse(rawEssayData.aireview) as AiReviewContent;
    } catch (e) {
      console.error("Failed to parse aireview JSON for detail page (string case):", essayId, e);
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <p className="text-red-500 mb-4">Format review tidak valid (kesalahan parsing string).</p>
          <Link href="/dashboard/my-essays">
            <Button className="btn-primary">Kembali ke Daftar Esai</Button>
          </Link>
        </div>
      );
    }
  } else {
    // Jika sudah objek (bukan string), langsung gunakan
    parsedReview = rawEssayData.aireview;
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Review Esai: {parsedReview.judulessay}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg text-gray-700">Tanggal Review: {dayjs(parsedReview.tanggal).format("DD MMMM YYYY")}</p>
          <p className="text-2xl font-bold text-blue-600">Skor: {parsedReview.rating !== null ? parsedReview.rating.toFixed(1) : "N/A"}</p>
        </div>

        <h3 className="text-xl font-semibold mt-4 mb-2">Masukan Umum:</h3>
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{parsedReview.masukan && parsedReview.masukan.length > 0 ? parsedReview.masukan.join("\n") : "Tidak ada masukan umum."}</p>

        <h3 className="text-xl font-semibold mt-4 mb-2">Kelebihan:</h3>
        <ul className="list-disc list-inside text-gray-800 mb-4">
          {parsedReview.kelebihan && parsedReview.kelebihan.length > 0 ? parsedReview.kelebihan.map((item, idx) => <li key={idx}>{item}</li>) : <li>Tidak ada kelebihan spesifik yang disebutkan.</li>}
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">Area Perbaikan:</h3>
        <ul className="list-disc list-inside text-gray-800 mb-4">
          {parsedReview.kesalahan && parsedReview.kesalahan.length > 0 ? parsedReview.kesalahan.map((item, idx) => <li key={idx}>{item}</li>) : <li>Tidak ada area perbaikan spesifik yang disebutkan.</li>}
        </ul>
      </div>

      <div className="text-center">
        <Link href="/dashboard/">
          <Button className="btn-secondary">Kembali ke Daftar Esai</Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
