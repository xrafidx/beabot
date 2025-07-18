import { CardListProps, Category } from "@/Types";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const CardList: React.FC<CardListProps> = ({ cards, activeCategory, createNewUrl, noDataButtonText, CardComponent, title }) => {
  const getNoDataMessage = (category: Category) => {
    switch (category) {
      case "all":
        return `Tidak ada ${title.toLowerCase()} yang ditemukan.`;
      case "completed":
        return `Tidak ada ${title.toLowerCase()} yang sudah selesai.`;
      case "incomplete":
        return `Tidak ada ${title.toLowerCase()} yang belum selesai.`;
      default:
        return "Tidak ada data yang ditemukan.";
    }
  };

  return (
    <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.length > 0 ? (
        cards.map((card) => <CardComponent key={card.id} {...card}></CardComponent>)
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600 mb-4">{getNoDataMessage(activeCategory)}</p>
          {activeCategory === "all" && createNewUrl && (
            <Link href={createNewUrl}>
              <Button className="px-6 py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700">{noDataButtonText}</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default CardList;
