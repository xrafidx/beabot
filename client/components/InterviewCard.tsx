// components/InterviewCard.tsx
"use client";

import React from "react";
// import dayjs from "dayjs";
import { getCoverImage } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { InterviewCardProps, InterviewStatus } from "@/Types/index";
import CardWrapper from "./CardWrapper";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/constants";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const InterviewCard = ({
  id,
  uid,
  judulinterview,
  namabeasiswa,
  jenispertanyaan,
  tanggal,
  rating,
  completestatus,
  interviewstatus, // Ini adalah prop status yang diterima
}: InterviewCardProps) => {
  // const formattedDate = dayjs(tanggal).format("MMM DD, YYYY");
  const queryClient = useQueryClient();

  // KOREKSI UTAMA DI SINI:
  // Logika untuk menampilkan status pemrosesan/siap
  const isPendingQuestions = interviewstatus === InterviewStatus.PENDING_QUESTIONS || interviewstatus === InterviewStatus.PENDING_SETUP; // <-- KOREKSI: Gunakan 'interviewstatus' untuk kedua pengecekan
  const isReadyToStart = interviewstatus === InterviewStatus.QUESTIONS_GENERATED;
  const isCompleted = interviewstatus === InterviewStatus.INTERVIEW_COMPLETED;
  const isCancelled = interviewstatus === InterviewStatus.INTERVIEW_CANCELLED;

  const deleteMutation = useMutation({
    mutationFn: async (interviewIdToDelete: string) => {
      const response = await fetch(`http://localhost:5000${API_ENDPOINTS.BASE_INTERVIEW_CARD_BY_ID}/${interviewIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal menghapus interview: ${response.status}`);
      }
      return response.json();
    },
    onMutate: async (interviewIdToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["userInterviewsDashboard"] });
      const previousInterviews = queryClient.getQueryData<InterviewCardProps[]>(["userInterviewsDashboard"]);

      queryClient.setQueryData<InterviewCardProps[]>(["userInterviewsDashboard"], (old) => (old ? old.filter((interview) => interview.id !== interviewIdToDelete) : []));

      const toastId = toast.loading("Menghapus interview...");
      return { previousInterviews, toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.dismiss(context?.toastId);
      toast.success("Interview berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
    },
    onError: (err, interviewIdToDelete, context) => {
      if (context?.previousInterviews) {
        queryClient.setQueryData<InterviewCardProps[]>(["userInterviewsDashboard"], context.previousInterviews);
      }
      toast.dismiss(context?.toastId);
      toast.error(`Gagal menghapus interview: ${err.message}`);
      console.error("Error menghapus interview:", err);
    },
    onSettled: (data, error, variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
    },
  });

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat interview ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <CardWrapper>
      {isPendingQuestions ? ( // Tampilkan UI loading jika sedang menunggu pertanyaan
        <div className="flex flex-col items-center justify-center p-4 min-h-[200px] text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-500 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800">Mempersiapkan Interview...</h3>
          <p className="text-gray-600">Pertanyaan sedang digenerate oleh AI.</p>
        </div>
      ) : (
        // UI normal jika tidak dalam status PENDING_QUESTIONS
        <div className="card-interview flex flex-col gap-4">
          {/* Badge kategori */}
          <div className="absolute top-0 right-0 bg-[#753a88] rounded-bl-lg px-3 py-1">
            <span className="badge-text text-white text-sm font-medium">{jenispertanyaan}</span>
          </div>

          {/* Logo instansi */}
          <div className="flex justify-start mt-3">
            <Image src={getCoverImage(namabeasiswa)} alt="interview cover" width={70} height={70} className="rounded-full object-cover" />
          </div>

          {/* Judul dan nama beasiswa */}
          <div className="mt-1">
            <h3 className="text-lg font-semibold capitalize">{judulinterview}</h3>
            <h4 className="text-sm text-gray-600">{namabeasiswa}</h4>
          </div>

          {/* Feedback / Status */}
          <p className="text-sm text-gray-700 text-justify">
            {isCompleted // Jika sudah selesai
              ? `Rating: ${rating?.toFixed(1) || "N/A"}`
              : "Anda belum mengambil interview ini. Ambil sekarang untuk meningkatkan skill Anda."}
          </p>

          {/* Tanggal & Rating */}
          <div className="flex gap-6 text-sm text-gray-600 mt-1">
            <div className="flex items-center gap-1">
              <Image src="/calendar.svg" alt="calendar" width={20} height={20} />
              <span>{tanggal}</span>
            </div>
            <div className="flex items-center gap-1">
              <Image src="/star.svg" alt="star" width={20} height={20} />
              <span>{rating !== null && rating !== undefined ? rating.toFixed(1) : "---"}</span>
            </div>
          </div>

          {/* Tombol & Dropdown Menu */}
          <div className="flex justify-between items-center mt-4">
            {isReadyToStart && ( // Tombol "Mulai Interview" jika pertanyaan siap
              <Button asChild className="btn-primary">
                <Link href={`/dashboard/interview-room/${id}`}>Mulai Interview</Link>
              </Button>
            )}
            {isCompleted && ( // Tombol "Lihat Feedback" jika sudah selesai
              <Button asChild className="btn-primary">
                <Link href={`/dashboard/interview-feedback/${id}`}>Lihat Feedback</Link>
              </Button>
            )}
            {!isReadyToStart &&
              !isCompleted &&
              !isPendingQuestions &&
              !isCancelled && ( // Fallback jika status tidak dikenal
                <Button className="btn-primary" disabled>
                  Status Tidak Diketahui
                </Button>
              )}
            {isCancelled && (
              <Button className="btn-primary" disabled>
                Interview Dibatalkan
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-700">
                  {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default InterviewCard;
