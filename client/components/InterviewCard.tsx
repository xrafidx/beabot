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
    <div className="card-border w-[360px] zmax-sm:w-full ">
      <div className="card-interview">
        <div>
          {/* Ini teks buat kategori interview */}
          <div className="absolute top-0 right-0 w-fit p-2 rounded-bl-lg bg-accent">
            <p className="badge-text text-black">{jenispertanyaan}</p>
          </div>
        </div>

        {/* Logo Instansi */}
        <Image src={getCoverImage(namabeasiswa)} alt="interview cover" width={90} height={90} className="rounded-full object-fit size-[90px]" />

        {/* Judul Interview */}
        <h3 className="mt-5 capitalize">{judulinterview}</h3>

        <h4 className="mt-5">{namabeasiswa}</h4>
        <div className="flex flex-row gap-2">
          {/* Summary singkat Interview */}
          <p>{feedback?.totalScore || "You haven't take this interview yet. Take it now to improve your skills."}</p>
        </div>

        {/* Icon Kalender */}
        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" alt="calendar" width={22} height={22}></Image>
            <p>{tanggal}</p>
          </div>

          {/* Icon Bintang */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" alt="star" width={22} height={22}></Image>
            <p>{rating || "---"}</p>
          </div>
        </div>

        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row justify-between">
            {/* <DisplayFieldLogo></DisplayFieldLogo> */}
            <Button className="btn-primary">View an interview</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Menghapus" : "Hapus"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
