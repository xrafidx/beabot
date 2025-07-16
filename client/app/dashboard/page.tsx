// pages/dashboard.tsx atau app/dashboard/page.tsx

"use client";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { API_ENDPOINTS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { BackendInterviewData, InterviewCardProps } from "@/Types";

const Page = () => {
  const {
    data: rawInterviews, // Data mentah dari backend (BackendInterviewData[])
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BackendInterviewData[], Error>({
    // Output queryFn adalah BackendInterviewData[]
    queryKey: ["userInterviews"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000${API_ENDPOINTS.GET_ALL_INTERVIEW_CARDS}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error("Authentication invalid. Please try signing in back.");
        }
        throw new Error(errorData.message || `Failed to fetch user's data interview: ${response.status}`);
      }

      const result = await response.json();
      if (!Array.isArray(result.data)) {
        console.error("Backend response data is not an array, received:", result.data);
        throw new Error("Backend did not return an array of interviews.");
      }
      return result.data as BackendInterviewData[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // LOG DATA MENTAH UNTUK DEBUGGING (biarkan ini)
  console.log("Raw Interviews Data from Backend:", rawInterviews);

  // LOGIKA SORTING DAN SLICE DI FRONTEND
  const userInterviews: InterviewCardProps[] = React.useMemo(() => {
    if (!rawInterviews) return [];

    // Langkah 1: Map data mentah dari backend ke format InterviewCardProps
    // Ini menangani konversi casing dan memberikan fallback untuk properti yang hilang
    const mappedCards: InterviewCardProps[] = rawInterviews.map((card, index) => {
      // LOG SETIAP CARD YANG DIPROSES UNTUK DEBUGGING (biarkan ini)
      console.log(`Mapping card index ${index}: ID=${card.id}, judulinterview=${card.judulinterview}`);

      // Memastikan properti yang casingnya berbeda di-mapping dengan benar
      const judulInterviewMapped = card.judulinterview;
      const namaBeasiswaMapped = card.namabeasiswa || "";

      // Fallback untuk properti yang TIDAK ADA di JSON dari backend Anda
      const jenisPertanyaan = (card as BackendInterviewData).jenisPertanyaan ? (card as BackendInterviewData).jenisPertanyaan.toLowerCase() : "regular";

      const userId = (card as BackendInterviewData).userId || ""; // Misalnya, beri default string kosong

      return {
        id: card.id.toString(), // Konversi ID dari number ke string
        userId: userId,
        judulinterview: judulInterviewMapped,
        namabeasiswa: namaBeasiswaMapped,
        jenispertanyaan: jenisPertanyaan as "regular" | "essay-driven",
        tanggal: new Date(card.createdat), // Konversi string tanggal ke Date object
      };
    });

    // Langkah 2: Urutkan dan Ambil 3 Teratas
    // Asumsi 'id' adalah number dari backend, di sini sudah menjadi string, jadi perlu di-parse lagi untuk sort numerik
    return mappedCards
      .sort((a, b) => parseInt(b.id) - parseInt(a.id)) // Urutkan berdasarkan ID dari terbesar ke terkecil
      .slice(0, 3); // Ambil 3 data pertama setelah diurutkan
  }, [rawInterviews]); // Dependensi tetap pada rawInterviews

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-gray-500">Loading for your interview.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500">Error: {error?.message || "Failed to load data."}</p>
        <Button onClick={() => refetch()} className="btn-primary mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="card-cta flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl font-bold">Ace your interviews and perfect your essays.</h2>
          <p className="text-lg">Practice on real interview questions & get instant feedback.</p>
          <div className="flex flex-row gap-4">
            <Button asChild className="btn-primary">
              <Link href="/dashboard/interview-form">Start an Interview</Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link href="/essay-review">Start Essay Review</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 lg:mt-0">
          <Image src="/hero.png" alt="hero section image" width={400} height={400} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none" />
        </div>
      </section>

      <section className="flex flex-col gap-4 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userInterviews.length > 0 ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                id={interview.id}
                uid={interview.uid}
                jenispertanyaan={interview.jenispertanyaan}
                judulinterview={interview.judulinterview}
                namabeasiswa={interview.namabeasiswa || ""}
                createdat={interview.createdat}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600 mb-4">Anda belum memiliki interview yang dibuat.</p>
              <Link href="/dashboard/interview">
                <Button className="px-6 py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700">Buat Interview Pertama Anda</Button>
              </Link>
            </div>
          )}
        </div>

        <Link href="/my-interview" className="btn-primary text-center">
          See all my interview.
        </Link>
      </section>
    </>
  );
};

export default Page;
