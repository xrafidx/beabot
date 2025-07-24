// components/Page.tsx (atau file page dashboard Anda)
"use client";

import React, { useMemo, useState } from "react";
import InterviewCard from "@/components/InterviewCard";
import { useQuery } from "@tanstack/react-query";
import { BackendInterviewData, Category, InterviewCardProps, InterviewStatus } from "@/Types"; // Pastikan InterviewStatus diimpor
import { API_ENDPOINTS, BASE_URL } from "@/constants";
// import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import CategoryTabs from "@/components/CategoryTabs";
import Link from "next/link";
import DataStatusDisplay from "@/components/DataStatusDisplay";
import { useRouter } from "next/navigation";

const MyInterview = ({ user }: { user: any }) => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const router = useRouter();

  const {
    data: userInterviews,
    isLoading,
    isError,
    refetch,
  } = useQuery<BackendInterviewData[], Error>({
    queryKey: ["userInterviewsDashboard"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.GET_ALL_INTERVIEW_CARDS}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          router.push("/sign-in");
          throw new Error("Authentication invalid. Please try signing in back.");
        }
        throw new Error(errorData.message || `Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      if (!Array.isArray(result.data)) {
        console.error("Backend response data is not an array:", result);
        throw new Error("Backend did not return an array of interviews.");
      }
      return result.data as BackendInterviewData[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const mappedCards: InterviewCardProps[] = useMemo(() => {
    if (!userInterviews) return [];
    return userInterviews.map((card) => {
      // ***** KOREKSI UTAMA DI SINI *****
      // Langsung gunakan interviewstatus dari backend karena sudah ada di sana
      const status: InterviewStatus = card.interviewstatus;

      return {
        id: String(card.id), // Pastikan ID adalah string jika ada kemungkinan number dari backend
        uid: card.uid,
        judulinterview: card.judulinterview,
        namabeasiswa: card.namabeasiswa || "",
        jenispertanyaan: (card.jenispertanyaan || "regular").toLowerCase() as "regular" | "essay-driven",
        tanggal: card.tanggal,
        rating: card.rating, // Pastikan rating juga di-map
        interviewstatus: status, // Langsung gunakan status dari backend
      };
    });
  }, [userInterviews]);

  const filteredInterviews: InterviewCardProps[] = useMemo(() => {
    if (activeCategory === "completed") {
      return mappedCards.filter((card) => card.interviewstatus === InterviewStatus.INTERVIEW_COMPLETED);
    } else if (activeCategory === "incomplete") {
      // Interview dianggap 'incomplete' jika BUKAN 'INTERVIEW_COMPLETED'
      // Ini akan mencakup PENDING_SETUP, PENDING_QUESTIONS, QUESTIONS_GENERATED, CANCELLED, dll.
      return mappedCards.filter((card) => card.interviewstatus !== InterviewStatus.INTERVIEW_COMPLETED);
    }
    return mappedCards;
  }, [activeCategory, mappedCards]);

  const allCount = mappedCards.length;
  // Perhitungan count harus berdasarkan interviewstatus
  const completedCount = mappedCards.filter((card) => card.interviewstatus === InterviewStatus.INTERVIEW_COMPLETED).length;
  const incompleteCount = mappedCards.filter((card) => card.interviewstatus !== InterviewStatus.INTERVIEW_COMPLETED).length;

  if (isError || isLoading) {
    return <DataStatusDisplay isLoading={isLoading} isError={isError} onRetry={refetch} loadingMessage="Memuat interview anda." errorMessage="Gagal memuat daftar Interview"></DataStatusDisplay>;
  }

  return (
    <section className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Interview Saya</h1>
        <Link href="/dashboard/interview-form" className="btn btn-primary mt-4 md:mt-0">
          {" "}
          {/* Tambah margin top di mobile, hilangkan di md */}
          Mulai Interview baru
        </Link>
      </div>
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} allCount={allCount} completedCount={completedCount} incompleteCount={incompleteCount} />

      <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              id={interview.id}
              uid={interview.uid}
              jenispertanyaan={interview.jenispertanyaan}
              judulinterview={interview.judulinterview}
              namabeasiswa={interview.namabeasiswa}
              tanggal={interview.tanggal}
              interviewstatus={interview.interviewstatus} // Pastikan ini meneruskan status yang benar
              rating={interview.rating} // Jangan lupa meneruskan rating
              // completestatus={interview.completestatus}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-600 mb-4">
              {activeCategory === "all" ? "Anda belum membuat interview apapun." : activeCategory === "completed" ? "Anda belum menyelesaikan interview manapun." : "Tidak ada interview yang belum selesai."}
            </p>
            {activeCategory === "all" && (
              <Link href="/create-interview">
                <Button className="btn-primary px-6 py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition">Buat Interview Baru</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyInterview;
