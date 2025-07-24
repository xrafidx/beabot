"use client";

import CategoryTabs from "@/components/CategoryTabs";
import DataStatusDisplay from "@/components/DataStatusDisplay";
import EssayCard from "@/components/EssayCard";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants";
import { mapBackendEssayToCard, useFetchCardsData } from "@/hooks/useFetchCardsData";
import { BackendEssayData, Category, EssayCardProps } from "@/Types";
import Link from "next/link";
import { useMemo, useState } from "react";

const Page = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const {
    mappedCards: essayCards,
    isLoading,
    isError,
    error,
    refetch: refetchEssays,
  } = useFetchCardsData<BackendEssayData, EssayCardProps>({
    queryKey: ["userEssays"],
    apiEndpoint: API_ENDPOINTS.ESSAY_REVIEW,
    mapper: mapBackendEssayToCard,
  });

  // Jumlah semua essay
  const allCount = essayCards.length;

  // Hitung jumlah completed dan incomplete
  const completedCount = essayCards.filter((card) => card.rating !== null && card.rating !== undefined).length;
  const incompleteCount = essayCards.filter((card) => card.rating === null || card.rating === undefined).length;

  // Filter sesuai tab
  const filteredEssays: EssayCardProps[] = useMemo(() => {
    if (activeCategory === "completed") {
      return essayCards.filter((card) => card.rating !== null && card.rating !== undefined);
    }
    if (activeCategory === "incomplete") {
      return essayCards.filter((card) => card.rating === null || card.rating === undefined);
    }
    return essayCards; // untuk 'all'
  }, [activeCategory, essayCards]);

  if (isLoading || isError) {
    return <DataStatusDisplay isLoading={isLoading} isError={isError} error={error} onRetry={refetchEssays} />;
  }

  return (
    <section className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Interview Saya</h1>
        <Link href="/dashboard/essay-form" className="btn btn-primary mt-4 md:mt-0">
          {" "}
          {/* Tambah margin top di mobile, hilangkan di md */}
          Mulai Review Baru
        </Link>
      </div>

      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} allCount={allCount} completedCount={completedCount} incompleteCount={incompleteCount}></CategoryTabs>

      <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEssays.length > 0 ? (
          filteredEssays.map((essay) => <EssayCard key={essay.id} id={essay.id} userid={essay.userid} judulessay={essay.judulessay} tanggal={essay.tanggal} rating={essay.rating} />)
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
