"use client";

import React from "react";
import dayjs from "dayjs";
import { getCoverImage } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { BackendInterviewData, Feedback, InterviewCardProps } from "@/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const InterviewCard = ({ id, uid, judulinterview, namabeasiswa, jenispertanyaan, tanggal, rating }: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const queryClient = useQueryClient();
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
      toast.loading("Menghapus interview...");
      return { previousInterviews };
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Interview berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
    },

    onError: (err, interviewIdToDelete, context) => {
      if (context?.previousInterviews) {
        queryClient.setQueryData<InterviewCardProps[]>(["userInterviewsDashboard"], context.previousInterviews);
      }
      toast.error(`Gagal menghapus interview: ${err.message}`);
      console.error("Error menghapus interview:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
    },
  });

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat interview ini?")) {
      deleteMutation.mutate(id);
    }
  };
  return (
    // Bikin card
    <div className="card-border w-[360px] max-sm:w-full relative">
      <div className="card-interview flex flex-col gap-4">
        {/* Badge kategori */}
        <div className="absolute top-0 right-0 bg-[#753a88] rounded-bl-lg px-3 py-1">
          <span className="badge-text text-white text-sm font-medium">{jenispertanyaan}</span>
        </div>

        {/* Logo instansi */}
        <div className="flex justify-start mt-3">
          <Image src={getCoverImage(namabeasiswa)} alt="interview cover" width={70} height={70} className="rounded-full object-fit" />
        </div>

        {/* Judul dan nama beasiswa */}
        <div className="mt-1">
          <h3 className="text-lg font-semibold capitalize">{judulinterview}</h3>
          <h4 className="text-sm text-gray-600">{namabeasiswa}</h4>
        </div>

        {/* Feedback */}
        <p className="text-sm text-gray-700 text-justify">{feedback?.totalScore || "You haven't take this interview yet. Take it now to improve your skills."}</p>

        {/* Tanggal & Rating */}
        <div className="flex gap-6 text-sm text-gray-600 mt-1">
          <div className="flex items-center gap-1">
            <Image src="/calendar.svg" alt="calendar" width={20} height={20} />
            <span>{tanggal ? dayjs(tanggal).format("MMM DD, YYYY") : "---"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/star.svg" alt="star" width={20} height={20} />
            <span>{rating || "---"}</span>
          </div>
        </div>

        {/* Tombol */}
        <div className="flex justify-between items-center mt-4">
          <Button className="btn-primary">View an interview</Button>
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
    </div>
  );
};

export default InterviewCard;
