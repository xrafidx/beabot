import { CardProps, Category } from "@/Types"; // Pastikan CardProps diimpor dari Types.ts
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

// Definisikan CardListProps agar generik dengan tipe T yang extends CardProps
interface CardListProps<T extends CardProps> {
  cards: T[]; // Array dari tipe kartu T
  activeCategory: Category; // Pastikan Category juga diimpor
  createNewUrl: string;
  noDataButtonText: string;
  CardComponent: React.ComponentType<T>; // Komponen harus menerima props bertipe T
  title: string;
}

// Gunakan generic saat mendefinisikan komponen CardList
// Perhatikan bahwa kita tidak lagi menggunakan React.FC<CardListProps> di sini,
// melainkan fungsi biasa dengan generic.
function CardList<T extends CardProps>({ cards, activeCategory, createNewUrl, noDataButtonText, CardComponent, title }: CardListProps<T>) {
  // Terapkan generic T di sini juga

  const getNoDataMessage = (category: Category) => {
    switch (category) {
      case "all":
        return `Tidak ada ${title.toLowerCase()} yang ditemukan.`;
      case "completed":
        return `Tidak ada ${title.toLowerCase()} yang sudah selesai.`;
      case "incomplete":
        return `Tidak ada ${title.toLowerCase()} yang belum selesai.`;
      default:
        // Handle case where Category might extend more types in future
        return "Tidak ada data yang ditemukan.";
    }
  };

  return (
    <div className="interviews-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.length > 0 ? (
        // ************ PENTING: Lakukan penyebaran props dengan aman ************
        // TypeScript sekarang tahu bahwa 'card' adalah tipe 'T', dan CardComponent mengharapkan 'T'
        cards.map((card) => <CardComponent key={card.id} {...(card as T)} />)
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600 mb-4">{getNoDataMessage(activeCategory)}</p>
          {/* Periksa createNewUrl sebelum menampilkan Link */}
          {activeCategory === "all" && createNewUrl && (
            <Link href={createNewUrl}>
              <Button className="px-6 py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700">{noDataButtonText}</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default CardList;
