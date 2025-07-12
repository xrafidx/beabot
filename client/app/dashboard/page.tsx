"use client";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { API_ENDPOINTS } from "@/constants";
import { useQuery } from "@tanstack/react-query"; // Apakah ini yang Anda tulis?

const Page = () => {
  const {
    data: interviews,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BackendInterviewData[]>({
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
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div>
        <p className="text-center text-gray-500">Loading for your interview.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p className="text-center text-red-500">Error: {error?.message || "Failed to load data."}</p>
        <Button onClick={() => refetch()} className="btn-primary">
          Try Again
        </Button>
      </div>
    );
  }

  const userInterviews = interviews || [];

  return (
    <>
      {/* Hero Section */}
      <section className="card-cta flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Kontainer teks */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl font-bold">Ace your interviews and perfect your essays.</h2>
          <p className="text-lg">Practice on real interview questions & get instant feedback.</p>
          <div className="flex flex-row gap-4">
            <Button asChild className="btn-primary">
              <Link href="/dashboard/interview">Start an Interview</Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link href="/essay-review">Start Essay Review</Link>
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-6 lg:mt-0">
          <Image src="/hero.png" alt="hero section image" width={400} height={400} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none" />
        </div>
      </section>
      {/* Section Your Interviews */}
      <section className="flex flex-col gap-4 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userInterviews.length > 0 ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id} // Gunakan ID unik dari interview
                interviewId={interview.id}
                userId={interview.userId}
                jenisPertanyaan={interview.jenisPertanyaan} // Gunakan `jenisPertanyaan` dari backend
                judulInterview={interview.judulInterview} // Gunakan `judulInterview` dari backend
                namaBeasiswa={interview.namaBeasiswa || ""}
                createdAt={new Date(interview.tanggal)} // Konversi string `tanggal` dari backend ke Date object
                // ... tambahkan prop lain jika ada di BackendInterviewData dan dibutuhkan di InterviewCard
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
      </section>{" "}
    </>
  );
};

export default Page;
