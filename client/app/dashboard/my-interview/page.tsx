"use client";

import React, { useMemo, useState } from "react";
import InterviewCard from "@/components/InterviewCard";
import { useQuery } from "@tanstack/react-query";
import { BackendInterviewData, Category, InterviewCardProps } from "@/Types";
import { API_ENDPOINTS } from "@/constants";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import CategoryTabs from "@/components/CategoryTabs";
import Link from "next/link";

const Page = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const {
    data: userInterviews,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BackendInterviewData[], Error>({
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
        throw new Error(errorData.message || `Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      if (!Array.isArray(result.data)) {
        console.error("Backend response data is not an array");
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
      const judulInterviewMapped = card.judulinterview;
      const namaBeasiswaMapped = card.namabeasiswa;
      const jenisPertanyaanMapped = (card.jenispertanyaan || "regular").toLowerCase() as "regular" | "essay-driven";
      const completeStatus = card.complete;

      return {
        id: card.id,
        uid: card.uid,
        judulinterview: judulInterviewMapped,
        namabeasiswa: namaBeasiswaMapped,
        jenispertanyaan: jenisPertanyaanMapped,
        tanggal: card.tanggal,
        completeStatus: completeStatus,
      };
    });
  }, [userInterviews]);

  const filteredInterviews: InterviewCardProps[] = useMemo(() => {
    if (activeCategory === "completed") {
      return mappedCards.filter((card) => card.completeStatus);
    } else if (activeCategory === "incomplete") {
      return mappedCards.filter((card) => !card.completeStatus);
    }
    return mappedCards;
  }, [activeCategory, mappedCards]);

  const allCount = mappedCards.length;
  const completedCount = mappedCards.filter((card) => card.completeStatus).length;
  const incompleteCount = mappedCards.filter((card) => !card.completeStatus).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-500">Loading all your interviews</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-500">Error: {error?.message || "Gagal memuat interviews."}</p>
        <Button onClick={() => refetch()} className="btn-primary">
          Refresh Page
        </Button>
      </div>
    );
  }
  return (
    <section className="container mx-auto py-10">
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} allCount={allCount} completedCount={completedCount} incompleteCount={incompleteCount}></CategoryTabs>

      <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              id={interview.id}
              uid={interview.uid}
              jenispertanyaan={interview.jenispertanyaan}
              judulinterview={interview.judulinterview}
              namabeasiswa={interview.namabeasiswa || ""}
              tanggal={interview.tanggal}
              completeStatus={interview.completeStatus}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-600 mb-4">{activeCategory === "all" ? "Anda belum membuat interview" : activeCategory === "completed" ? "Anda belum menyelesaikan interview manapun" : "Tidak ada interview yang belum selesai"}</p>
            {activeCategory === "all" && <Button className="btn-primary">Buat Interview Baru</Button>}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
