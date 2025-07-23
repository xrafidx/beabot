// pages/dashboard.tsx atau app/dashboard/page.tsx

"use client";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { API_ENDPOINTS } from "@/constants";
// import { useQuery } from "@tanstack/react-query";
import { BackendEssayData, BackendInterviewData, EssayCardProps, InterviewCardProps, InterviewStatus } from "@/Types";
import EssayCard from "@/components/EssayCard";
import { id } from "zod/v4/locales";
import DataStatusDisplay from "@/components/DataStatusDisplay";
import { mapBackendEssayToCard, mapBackendInterviewToCard, useFetchCardsData } from "@/hooks/useFetchCardsData";
import CardWrapper from "@/components/CardWrapper";
import CardList from "@/components/CardList";

const Page = () => {
  // Bakal fetch data interviews
  const {
    mappedCards: interviewCards,
    isLoading: isLoadingInterviews,
    isError: isErrorInterviews,
    error: errorInterviews,
    refetch: refetchInterviews,
  } = useFetchCardsData<BackendInterviewData, InterviewCardProps>({
    queryKey: ["userInterviewsDashboard"],
    apiEndpoint: API_ENDPOINTS.GET_ALL_INTERVIEW_CARDS,
    mapper: mapBackendInterviewToCard,
    refetchInterval: (query) => {
      const currentInterviewCards = query.state.data as InterviewCardProps[] | undefined;
      const pendingCount = currentInterviewCards?.filter((card) => card.interviewstatus === InterviewStatus.PENDING_QUESTIONS).length || 0;
      return pendingCount > 0 ? 5000 : false;
    },
    refetchIntervalInBackground: true,
  });

  // Bakal fetch data essay

  const {
    mappedCards: essayCards,
    isLoading: isLoadingEssays,
    isError: isErrorEssays,
    error: errorEssays,
    refetch: refetchEssays,
  } = useFetchCardsData<BackendEssayData, EssayCardProps>({
    queryKey: ["userEssaysDashboard"],
    apiEndpoint: API_ENDPOINTS.ESSAY_REVIEW,
    mapper: mapBackendEssayToCard,
  });

  const isLoading = isLoadingEssays || isLoadingInterviews;
  const isError = isErrorEssays || isErrorInterviews;
  const error = errorEssays || errorInterviews;

  if (isLoading || isError) {
    return (
      <DataStatusDisplay
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          refetchEssays();
          refetchInterviews();
        }}
        loadingMessage="Memuat dashboard..."
        errorMessage="Gagal memuat dashboard"></DataStatusDisplay>
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
              <Link href="/dashboard/essay-form">Start Essay Review</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 lg:mt-0">
          <Image src="/hero.png" alt="hero section image" width={400} height={400} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none" />
        </div>
      </section>

      {/* Bagian Interview Cards (hanya menampilkan 3 teratas) */}
      <section className="flex flex-col gap-4 mt-8">
        <h2>Your Recent Interviews</h2> {/* Judul lebih spesifik */}
        <CardList
          cards={interviewCards.sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 3)} // Ambil 3 teratas
          activeCategory="all" // Untuk dashboard, biasanya menampilkan 'all'
          createNewUrl="/dashboard/interview-form"
          noDataButtonText="Buat Interview Baru"
          CardComponent={InterviewCard} // Meneruskan komponen InterviewCard
          title="interviews" // Judul untuk pesan no data (akan jadi 'interviews' kecil di pesan)
        />
        {interviewCards.length > 3 && ( // Tampilkan tombol "See all" jika ada lebih dari 3
          <Link href="/dashboard/my-interview" className="btn-primary text-center mt-4">
            See all my interviews.
          </Link>
        )}
      </section>

      {/* Bagian Essay Cards (juga bisa menampilkan 3 teratas atau sesuai kebutuhan) */}
      <section className="flex flex-col gap-4 mt-8">
        <h2>Your Recent Essay Reviews</h2> {/* Judul untuk essay */}
        <CardList
          cards={essayCards.sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 3)} // Ambil 3 teratas
          activeCategory="all"
          createNewUrl="/dashboard/essay-form" // URL untuk form essay Anda
          noDataButtonText="Mulai Review Essay Baru"
          CardComponent={EssayCard} // Meneruskan komponen EssayCard
          title="essay reviews" // Judul untuk pesan no data
        />
        {essayCards.length > 3 && ( // Tampilkan tombol "See all" jika ada lebih dari 3
          <Link href="/dashboard/my-essays" className="btn-primary text-center mt-4">
            See all my essay reviews.
          </Link>
        )}
      </section>
    </>
  );
};

export default Page;
